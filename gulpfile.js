// To prevent rewriting the source and build folder locations
const paths = {
  source: './src',
  build: './dist',
};

const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const merge = require('merge-stream');
const glob = require('glob');

function cssBuild() {
  return gulp
      .src(`${paths.source}/**/*.css`)
      .pipe(postcss([cssnano()]))
      .pipe(gulp.dest(`${paths.build}`));
}

// Write our html task in a seperate function
function htmlBuild() {
  return gulp
      .src(`${paths.source}/**/*.html`)
      .pipe(
          htmlmin({
            collapseWhitespace: true,
            removeComments: true,
          }),
      )
      .pipe(gulp.dest(paths.build));
}

function javascriptBuild() {
  return glob('./src/**/*.js', {}, function(err, files) {
    const tasks = files.map(function(entry) {
      return (
        browserify({
          entries: [entry],
          transform: [babelify.configure({presets: ['@babel/preset-env']})],
        })
            .bundle()
            .pipe(source(entry.split('/').pop()))
        // Turn it into a buffer!
            .pipe(buffer())
        // And uglify
            .pipe(uglify())
            .pipe(
                gulp.dest(function(file) {
                  return `${entry
                      .replace(paths.source, paths.build)
                      .replace(file.basename, '')}`;
                }),
            )
      );
    });
    return merge([tasks]);
  });
}

function copyResources() {
  return merge([
    gulp.src(`${paths.source}/**/*.json`).pipe(gulp.dest(paths.build)),
    gulp.src(`${paths.source}/**/*.png`).pipe(gulp.dest(`${paths.build}`)),
  ]);
}

function cleanup() {
  // Simply execute del with the build folder path
  return del([paths.build]);
}

exports.default = exports.build = gulp.series(
    cleanup,
    gulp.parallel(javascriptBuild, htmlBuild, cssBuild, copyResources),
);
