chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) 
{
	if (!tab.url.includes('chrome://'))
	{
		if (changeInfo.status == 'complete')
		{
			console.log(tab);
			chrome.scripting.executeScript(
			{
				target: {tabId: tab.id},
				files: ['content.js','tfapi.js','lrp.js','manageOrders.js','dataFinder.js']
			});	 
		}
	}
});