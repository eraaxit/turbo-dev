console.log("BACKGROUND SCRIPT STARTED");

window.addEventListener("load", function () {
    console.log("window loaded");
    chrome.tabs.sendMessage(currentTab.id, { message: "start" });
});
