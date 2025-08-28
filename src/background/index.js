import Browser from 'webextension-polyfill';

let isEnabled = false;

Browser.action.onClicked.addListener(async (tab) => {
  isEnabled = !isEnabled;

  if (tab.id) {
    Browser.tabs.sendMessage(tab.id, {
      action: "INIT",
      value: isEnabled,
    });
  }

  const iconPath = "../icon-default.png";
  Browser.action.setIcon({ path: iconPath });
});

Browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg === "capture_tab") {

    let tabId;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      tabId = tabs[0].id
    })

    console.log('tabId', tabId)

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