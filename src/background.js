console.log("background.js");

const webhookTestUrl =
    "https://webhook.site/0d97f3f9-6a22-4e66-abfd-37637d9bae84";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("SERVICE WORKER✅");
    if (request.message === "start") {
        embeddedRequestBox();
        console.log("[turbo] embedded network request tab");
    } else if (request.message === "requestDetails") {
        console.log("[turbo] requestDetails", request.data);
    } else if (request.message === "requestDetailsFromBackground") {
        console.log("[turbo] requestDetailsFromBackground", request.data);
    }
});

function startSendingRequests() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        currentTab = tabs[0];
        // chrome.webRequest.onBeforeRequest.addListener(
        //     function (details) {
        //         console.log("onBeforeRequest", details);
        //     },
        //     { urls: ["*://*/*"] },
        //     []
        // );
        chrome.webRequest.onCompleted.addListener(
            function (details) {
                chrome.tabs.sendMessage(currentTab.id, {
                    message: "requestDetailsFromBackground",
                    data: JSON.stringify(details),
                });
                chrome.tabs.query(
                    { active: true, currentWindow: true },
                    function (tabs) {
                        chrome.tabs.sendMessage(
                            tabs[0].id,
                            {
                                message: "requestDetailsFromBackground",
                                data: JSON.stringify(details),
                            },
                            function (response) {}
                        );
                    }
                );
                fetch(webhookTestUrl + "?q=" + JSON.stringify(details));
                console.log("sent onCompleted details");
            },
            { urls: ["*://*/*"] },
            []
        );
        console.log("events added");
    });
}
startSendingRequests();
