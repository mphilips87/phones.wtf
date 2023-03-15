///Run on install
const TABS = {};
const USERS = {};
chrome.runtime.onInstalled.addListener(function()
{
		var logins;
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
		
		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
		{
			switch(request.type)
			{
				case 'hello':
					// Check the URL and element existence to determine the script to execute
					console.log("Message From Tab #"+sender.tab.id,sender.tab.url.substr(0,25),request);
					sendResponse({"type":"ackHello","content":"Extension: Greetings Tab! Your ID is: "+sender.tab.id,"tabId":sender.tab.id});
					if(typeof(request.content.USER.account_id)!=null) 
					{
						var account = request.content.USER.account_id;
							chrome.scripting.executeScript({target: {tabId: sender.tab.id, allFrames: true},files: ['tfLogin.js']});
					}
				break;
			}
		});

});




