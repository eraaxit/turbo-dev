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
localStorage.setItem("turbo", "true");
