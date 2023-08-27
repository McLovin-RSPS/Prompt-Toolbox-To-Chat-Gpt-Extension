chrome.runtime.onInstalled.addListener(async () => {
  console.log("Service Worker Installed");
});

chrome.runtime.onInstalled.addListener(function () {
  console.log("Extension installed");
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: "https://chat.openai.com/" });
});