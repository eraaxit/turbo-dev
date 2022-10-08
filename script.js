var currentTab;
var version = "1.0";

function onAttach(tabId) {
    chrome.debugger.sendCommand(
        {
            //first enable the Network
            tabId: tabId,
        },
        "Network.enable"
    );

    chrome.debugger.onEvent.addListener(allEventHandler);
}

function allEventHandler(debuggeeId, message, params) {
    if (currentTab.id != debuggeeId.tabId) {
        return;
    }

    if (message == "Network.responseReceived") {
        //response return
        chrome.debugger.sendCommand(
            {
                tabId: debuggeeId.tabId,
            },
            "Network.getResponseBody",
            {
                requestId: params.requestId,
            },
            function (response) {
                // you get the response body here!
                // you can close the debugger tips by:
                chrome.debugger.detach(debuggeeId);
                console.log("response", response);
            }
        );
    }
}

function popup() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        currentTab = tabs[0];
        chrome.webRequest.onBeforeRequest.addListener(
            function (details) {
                console.log("onCompleted", details);
                return { cancel: true };
            },
            { urls: ["*://*/*"] },
            []
        );
        // chrome.tabs.sendMessage(currentTab.id, { message: "start" });
    });
    console.log("sent from popup");
}

// chrome.tabs.query(
//     //get current Tab
//     {
//         currentWindow: true,
//         active: true,
//     },
//     function (tabArray) {
//         console.log("currentTab: ", currentTab);
//         currentTab = tabArray[0];
//         chrome.debugger.attach(
//             {
//                 //debug at current tab
//                 tabId: currentTab.id,
//             },
//             version,
//             onAttach.bind(null, currentTab.id)
//         );
//     }
// );
