chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	alert();
	switch(request.type)
	{
		case 'hello':
			var tabId = content.tabId;
				console.log(sender,request.content);
		break;
		case 'test':
			//Check the URL and element existence to determine the script to execute
				console.log("Message From - "+sender.tab.title+"("+sender.tab.id+"): ",request,);
				sendResponse({"dataType":"ackHello","content":"Extension: Greetings Tab! Are you logged in?"});
		break;
	}
});
	

