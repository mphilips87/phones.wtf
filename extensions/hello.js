var loading = new Array(); loading["start"] = new Date().toLocaleTimeString(); 
function dataCheck(selector = "section[data-brand]",variable = "qualMetaData")
{
	var querySelect = document.querySelector(selector);
	var getVariable = variable => window[variable] !== undefined ? window[variable] : false;
	var getSelector = selector => querySelect !== null ? querySelect : false; 
	return (getVariable(variable) || getSelector(selector).dataset || false);
}

console.log("Hello!");
window.onloadeddata=()=>    { loading["data"]  = new Date().toLocaleTimeString(); ; }
window.onloadedmetadata=()=>{ loading["meta"]  = new Date().toLocaleTimeString(); ; }
window.onload=()=>          { loading["done"]  = new Date().toLocaleTimeString(); ; }


var DATASET = false;
var NETWORK = false;

window.addEventListener("load", function() 
{  
	loading["listener"]  = new Date().toLocaleTimeString(); ;
	
	DATASET = dataCheck();
	NETWORK = (DATASET.BRAND || DATASET.brand || false)
	// Send a message to the background script letting it know we've landed on a new page and found our TF Data.
	if(NETWORK!=false) 
	{
		var msg = {type: "hello",data: DATASET,url: window.location.href};
			console.clear
		console.log("MESSAGE SENT: ",msg);
		chrome.runtime.sendMessage(msg, function(response) { console.log(response); }); 
	}
});

