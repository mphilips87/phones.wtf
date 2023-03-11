chrome.runtime.onInstalled.addListener(function()
{
		chrome.contextMenus.create({"title": "Phonesmart","contexts": ["page"],"id": "PCM"});
		chrome.contextMenus.create({"title": "Login","parentId": "PCM","id": "PCM_LOGIN"});
	//chrome.contextMenus.create({"title": "Sync","parentId": "PCM","id": "PCM_SYNC"});
});


chrome.contextMenus.onClicked.addListener(function(info, tab)
{
  console.log(info,tab);
  if (info.menuItemId === "PCM_LOGIN") 
  {
	chrome.scripting.executeScript({target: {tabId: tab.id, allFrames: true},files: ['tfLogin.js']});
  }
});
		
		
////////////////////////////////////////////


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) 
{
	if (message.type === "hello") 
	{
		// Check the URL and element existence to determine the script to execute
		console.log("Message From - "+sender.tab.title+"("+sender.tab.id+"): ",message,);
		sendResponse({status:200});
	}
	
	if(message.type === "chat")
	{
		console.log('%c[Background Script]: ' + message, 'color: red');
		sendResponse('Message received!');
	}
});





chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  
});