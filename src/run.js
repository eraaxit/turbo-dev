const REQUESTS = [];

function dragElement(elmnt) {
  let pos1 = 0;
  let pos2 = 0;
  let pos3 = 0;
  let pos4 = 0;
  if (document.getElementById(elmnt.id + 'header')) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
    elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('[run.js] request', request.message);
  if (request.message === 'start') {
    embeddedRequestBox();
  } else if (request.message === 'requestDetails') {
  } else if (request.message === 'requestDetailsFromBackground') {
    const details = JSON.parse(request.data);
    const currentUrl = window.location.href;
    const requestInitiator = details.initiator;
    if (currentUrl.includes(requestInitiator)) {
      REQUESTS.push(JSON.parse(request.data));
      addRequestsInList();
    }
  }
});

function embeddedRequestBox() {
  const networkRequestsBox = document.createElement('div');
  networkRequestsBox.id = 'network-requests-box';
  networkRequestsBox.innerHTML = `
        <div class="box-controllers">
            <div class="close">❌</div>
            <div class="minimize">➖</div>
        </div>
        <div class="requests-list">
        </div>
    `;
  document.body.appendChild(networkRequestsBox);

  dragElement(networkRequestsBox);

  const closeBtn = networkRequestsBox.querySelector('.close');
  closeBtn.addEventListener('click', () => {
    networkRequestsBox.remove();
  });

  const minimizeBtn = networkRequestsBox.querySelector('.minimize');
  minimizeBtn.addEventListener('click', () => {
    networkRequestsBox.classList.toggle('minimized');
  });
}

function addRequestsInList() {
  const requestsList = document.querySelector('.requests-list');
  if (!requestsList) {
    console.log('no requests list');
    return;
  }
  requestsList.innerHTML = '';
  REQUESTS.forEach((request) => {
    const singleRequestWrapper = document.createElement('div');
    singleRequestWrapper.classList.add('single-request-wrapper');
    singleRequestWrapper.innerHTML = `
            <div class="request-info">
                <div class="request-method">${request.method}</div>
                <div class="request-url">${request.url}</div>
            </div>
            <div class="request-status">${request.statusCode}</div>
        `;
    requestsList.appendChild(singleRequestWrapper);
  });
}

window.onload = function() {
  embeddedRequestBox();
};
