console.log("[turbo] RUN.JS", chrome);

// console.log("run.js", chrome.devtools.network);

let REQUESTS = [];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("[run.js] request", request.message);
    if (request.message === "start") {
        embeddedRequestBox();
        // console.log("[turbo] embedded network request tab");
    } else if (request.message === "requestDetails") {
        // console.log("[turbo] requestDetails", request.data);
    } else if (request.message === "requestDetailsFromBackground") {
        // console.log("[turbo] requestDetailsFromBackground", request.data);
        const details = JSON.parse(request.data);
        const currentUrl = window.location.href;
        const requestInitiator = details.initiator;
        if (currentUrl.includes(requestInitiator)) {
            REQUESTS.push(JSON.parse(request.data));
            addRequestsInList();
        }
    }
});

function start() {
    alert("started");
}

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
    // REQUESTS.forEach((request) => {
    //     const singleRequestWrapper = document.createElement("div");
    //     singleRequestWrapper.classList.add("single-request-wrapper");
    //     singleRequestWrapper.innerHTML = `
    //         <div class="request-info">
    //             <div class="request-method">${request.method}</div>
    //             <div class="request-url">${request.url}</div>
    //         </div>
    //         <div class="request-status">${request.statusCode}</div>
    //     `;
    //     requestsList.appendChild(singleRequestWrapper);
    // });

    const closeBtn = networkRequestsBox.querySelector(".close");
    closeBtn.addEventListener("click", () => {
        networkRequestsBox.remove();
    });

    const minimizeBtn = networkRequestsBox.querySelector(".minimize");
    minimizeBtn.addEventListener("click", () => {
        networkRequestsBox.classList.toggle("minimized");
    });
}

function addRequestsInList() {
    const requestsList = document.querySelector(".requests-list");
    if (!requestsList) {
        console.log("no requests list");
        return;
    }
    requestsList.innerHTML = "";
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
}

window.onload = function () {
    embeddedRequestBox();
};
