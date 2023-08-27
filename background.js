chrome.runtime.onInstalled.addListener(async () => {
  console.log("Service Worker Installed");
});

chrome.runtime.onInstalled.addListener(function () {
  console.log("Extension installed");
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: "https://chat.openai.com/" });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "storePrompts") {
    chrome.storage.local.set({ "prompts": request.data });
    sendResponse({ success: true });
  } else if (request.action === "getPrompts") {
    chrome.storage.local.get(["prompts"], function(result) {
      sendResponse({ prompts: result.prompts });
    });
    return true;  // Will respond asynchronously.
  }
});