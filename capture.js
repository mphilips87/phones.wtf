function capture()
    {
      //const header = document.head.querySelector("meta[name='x-response-capture']");
      //if (header) {
        const capture = {
          url: location.href,
          statusCode: performance.getEntriesByType("navigation")[0].responseStart,
          responseText: document.documentElement.innerHTML
        };
        chrome.storage.local.get({captures: []}, data => {
          data.captures.push(capture);
          chrome.storage.local.set({captures: data.captures});
        });
      //}
    }
  
	chrome.webNavigation.onCompleted.addListener(details => {chrome.scripting.executeScript({t1arget: {tabId: details.tabId},function:capture()}, {url: [{urlMatches: "<all_urls>"}]}); });