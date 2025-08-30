import Browser from 'webextension-polyfill';

let isEnabled = false;

// Toggle the extension on/off when the toolbar icon is clicked
Browser.action.onClicked.addListener(async (tab) => {
  isEnabled = !isEnabled;

  if (tab.id) {
    Browser.tabs.sendMessage(tab.id, {
      action: "INIT",
      value: isEnabled,
    });
  }

  const iconPath = isEnabled ? "../icon-enabled.png" : "../icon.png";
  Browser.action.setIcon({ path: iconPath });
});

// Listen for messages from content script to capture the tab screenshot
Browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg === "capture_tab") {

    let tabId;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      tabId = tabs[0].id
    })

    chrome.tabs.captureVisibleTab(
      tabId,
      { format: "png", quality: 100 },
      function (dataUrl) {
        sendResponse({
          tabId: tabId,
          imgSrc: dataUrl
        })
      }
    )
    return true
  }
})