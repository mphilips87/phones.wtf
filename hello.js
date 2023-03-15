var TABID = null;
var killQSI = setInterval(()=>{
document.querySelectorAll(".QSIPopOver").forEach((popUp)=>popUp.remove()); 
document.querySelectorAll(".QSIPopOverShadowBox").forEach((popUp)=>popUp.remove()); },2000);
//This function gets all current cookies.
	async function cookieJar(full = false)
	{
		var cookies = await cookieStore.getAll()
			.then((cookies)=>cookies)
			.then((cookieArray)=>
			{
				var cookieJar = {}; 
					cookieArray.forEach((cookie)=>
					{
						cookieJar[cookie.name] = cookie.value || false; 
					});
				return cookieJar; 
			});
		return cookies;
	}


	//This function checks for the required html element or javaScript vairable that we need to reliably identify our brand, and user.
	function dataCheck(selector = "section[data-brand]",variable = "qualMetaData")
	{
		var querySelect = document.querySelector(selector);
		var getVariable = variable => window[variable] !== undefined ? window[variable] : false;
		var getSelector = selector => querySelect !== null ? querySelect : false; 
		return (getVariable(variable) || getSelector(selector).dataset || false);
	}

	//This function checks a given object of cookies for 3 token objects. 
	function tokenCheck(cookies,booleanReturn = false) 
	{		
		var tokens = {};
			tokens['wcToken'] = cookies['wcToken'] || false;
			tokens['wcTrust'] = cookies['wcTrustedToken'] || false;
			tokens['roToken'] = cookies['roToken'] || false;
			if(booleanReturn === true) 
			{
				var all3TokensFound = (Object.values(tokens).filter((val)=>(!(val===false))).length == 3);
				if(!all3TokensFound)  {  return false } else { return true; }
			}
		return tokens;		
	}
	
	
	//This function sends the dataCheck() results to the background script.
	async function sendData(dataType,dataContent,i)
	{
		var send = {'type':dataType,'content':dataContent};
			console.log("Sending: ",dataContent);
			comms[i] = {"direction":"OUT","data":send};
			
			i++;
			
			chrome.runtime.sendMessage(send, async (reply)=>
			{
				comms[i] = {"direction":"IN","data":reply}; i++;
				if(TABID==null) { TABID = reply.tabId; console.log("Tab ID:",TABID); }
				
			});
	}	



	//This file is intended to run on all page loads to determine if we are logged in and if so report back to the background script.
	//Debugging vairable comms. Each time a message is sent or received im putting it in this array so it can function as a sort of communication log.
	const comms=new Array();
	var i = 0;

//On Window load this function gets the cookies we need.
//wcToken && WcTrustedToken are required for API tasks.
//roToken is set if our user is logged in and grants access to the user's dash board and rewards info.
//If roToken is not set then there is no user logged in.
function runCode()
{
	//alert('RUN');
	console.log('Running...');
	var cookies;
	
	cookieJar().then((jar)=>
	{
		cookies = jar; 
		//DATASET holds the results from dataCheck
		//BRANDID is the brand of the site if it is set.
		try{ var USER = JSON.parse(sessionStorage.$userServive); } catch(err) { var USER ={}; }
		var TOKENS = tokenCheck(cookies,true);
		var DATASET = dataCheck();
		var BRANDID = (document.body.innerHTML.match(/STRAIGHT_TALK|TRACFONE|NET10|SIMPLE_MOBILE|TOTAL_WIRELESS/) || [false])[0];
		var clientId = DATASET.clientid; 
		
			USER.clientId = clientId;
			
		console.log("BRAND NAME FOUND: ",BRANDID);
		console.log("API TOKENS FOUND: ",TOKENS);
		console.log("CLIENT ID FOUND :",DATASET.clientid);
		var send={"BRAND":BRANDID,"USER":USER,"TOKENS":TOKENS};
		// Send a message to the background script letting it know we've landed on a new page and found our brand and data.
		if(BRANDID!=false && TOKENS === true) 
		{
				USER.account_id = JSON.parse(sessionStorage.$userService).account_id;
				USER.emailId = JSON.parse(sessionStorage.$userService).emailId;
				send.BRAND = BRANDID;
				send.USER =USER;
				send.TOKENS = tokenCheck(cookies);
		}
		sendData('hello',send,i);
		
	});
}
	
window.addEventListener("load", async function() 
{  
	runCode();
});