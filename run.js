console.log("[turbo] RUN.JS");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "start") {
        console.log("run recieved", request);
    }
});

function start() {
    alert("started");
}
