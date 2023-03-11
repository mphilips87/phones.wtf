chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    "title": "Your menu title",
    "id": "your_menu_id"
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  // Handle menu click event here
});

chrome.contextMenus.onShown.addListener(function() {
  chrome.contextMenus.refresh();
});

