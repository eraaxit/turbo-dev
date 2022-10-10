console.log("[turbo] RUN.JS", chrome);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "start") {
        embeddedRequestBox();
        console.log("[turbo] embedded network request tab");
    } else if (request.message === "requestDetails") {
        console.log("[turbo] requestDetails", request.data);
    } else if (request.message === "requestDetailsFromBackground") {
        console.log("[turbo] requestDetailsFromBackground", request.data);
    }
});

function start() {
    alert("started");
}

const REQUESTS = [
    {
        documentId: "EC7196FD2B44C1B5C6ACAE6F18BC3C92",
        documentLifecycle: "active",
        frameId: 0,
        frameType: "outermost_frame",
        fromCache: false,
        initiator: "https://myaccount.google.com",
        ip: "142.250.193.206",
        method: "GET",
        parentFrameId: -1,
        requestId: "18731",
        statusCode: 204,
        statusLine: "HTTP/1.1 204",
        tabId: 2073115190,
        timeStamp: 1665302348244.938,
        type: "image",
        url: "https://myaccount.google.com/u/3/_/AccountSettingsUi/gen204/?tmambps=0.0004469574780058651&rtembps=-1&rttms=9&ct=undefined",
    },
    {
        frameId: -1,
        fromCache: true,
        initiator: "https://csecrew.com",
        ip: "142.250.193.234",
        method: "GET",
        parentFrameId: -1,
        requestId: "18750",
        statusCode: 200,
        statusLine: "HTTP/1.1 200",
        tabId: -1,
        timeStamp: 1665302351863.93,
        type: "xmlhttprequest",
        url: "https://fonts.googleapis.com/css?family=Assistant",
    },
    {
        frameId: -1,
        fromCache: false,
        initiator: "https://csecrew.com",
        ip: "142.250.194.8",
        method: "GET",
        parentFrameId: -1,
        requestId: "18754",
        statusCode: 200,
        statusLine: "HTTP/1.1 200",
        tabId: -1,
        timeStamp: 1665302352401.04,
        type: "xmlhttprequest",
        url: "https://www.googletagmanager.com/gtag/js?id=G-L7M8WVYFKW",
    },
];

function embeddedRequestBox() {
    const networkRequestsBox = document.createElement("div");
    networkRequestsBox.id = "network-requests-box";
    networkRequestsBox.innerHTML = `
        <div class="box-controllers">
            <div class="close">❌</div>
            <div class="minimize">➖</div>
        </div>
        <div class="requests-list">
        </div>
    `;
    document.body.appendChild(networkRequestsBox);
    const requestsList = networkRequestsBox.querySelector(".requests-list");
    REQUESTS.forEach((request) => {
        const singleRequestWrapper = document.createElement("div");
        singleRequestWrapper.classList.add("single-request-wrapper");
        singleRequestWrapper.innerHTML = `
            <div class="request-info">
                <div class="request-method">${request.method}</div>
                <div class="request-url">${request.url}</div>
            </div>
            <div class="request-status">${request.statusCode}</div>
        `;
        requestsList.appendChild(singleRequestWrapper);
    });

    const closeBtn = networkRequestsBox.querySelector(".close");
    closeBtn.addEventListener("click", () => {
        networkRequestsBox.remove();
    });

    const minimizeBtn = networkRequestsBox.querySelector(".minimize");
    minimizeBtn.addEventListener("click", () => {
        networkRequestsBox.classList.toggle("minimized");
    });
}
