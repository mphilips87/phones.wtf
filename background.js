///Run on install
chrome.runtime.onInstalled.addListener(function()
{
		//Set rules for network request captures.
		var rules = [];
			rules = [{id: 1,priority: 1,action: {type: "modifyHeaders",responseHeaders: [{operation: "set",header: "x-response-capture",value: "true"}]},condition: {urlFilter: "<all_urls>"}}];
			chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: [1],addRules: rules});
			
		//This creates our context menu. Eventually it will be used to manually log in to our accounts and other useful things.
		chrome.contextMenus.create({"title": "Phonesmart","contexts": ["page"],"id": "PCM"});
		chrome.contextMenus.create({"title": "Login","parentId": "PCM","id": "PCM_LOGIN"});
		
		//This is for when the user clicks on the login menu button.
		chrome.contextMenus.onClicked.addListener(function(info, tab)
		{
			console.log(info,tab);
			if (info.menuItemId === "PCM_LOGIN") 
			{
				//This will execute the login script.
				chrome.scripting.executeScript({target: {tabId: tab.id, allFrames: true},files: ['tfLogin.js']});
			}
		});
		
		chrome.runtime.onMessage.addListener(function(message, sender, sendResponse)
		{
			switch(message.type)
			{
				case 'hello':
					// Check the URL and element existence to determine the script to execute
					console.log("Message From - "+sender.tab.title+"("+sender.tab.id+"): ",message,);
					sendResponse({"dataType":"ackHello","content":"Extension: Greetings Tab! Are you logged in?"});
				break;
				case 'test':
					// Check the URL and element existence to determine the script to execute
					console.log("Message From - "+sender.tab.title+"("+sender.tab.id+"): ",message,);
					sendResponse({"dataType":"ackHello","content":"Extension: Greetings Tab! Are you logged in?"});
				break;
			}
		});

});




