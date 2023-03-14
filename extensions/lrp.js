var hostAddress = 'localhost';

function trimCell(c)
{
    var txt=c.innerText;
    var newtxt=txt;
    if(txt.match(/poll/i)) { newtxt = "poll"; };
    if(txt.match(/video/i)) { newtxt = "video"; };
    if(txt.match(/survey/i)) { newtxt = "survey"; };
    if(txt.match(/social network/i)) { newtxt = "share"; };
    if(txt.match(/wheel game/i)) { newtxt = "spin"; };
    if(txt.match(/fun game/i)) { newtxt = "game"; };
    if(txt.match(/Purchased a gift card/i)) { newtxt = "gc";};
    if(txt.match(/PHONE PROMO CODE/i)) { newtxt = "code";};
    if(txt.match(/Scratch/i)) { newtxt = "scratch";};
    if(txt.match(/Scratch/i)) { newtxt = "scratch";};
    if(txt.match(/Bonus: Enrollment in Loyalty Rewards Program/i)) { newtxt = "enrolled"; }
    if(txt.match(/Referred by a friend/i)) { newtxt = "joined"; }
    if(txt.match(/Referred a friend/i)) { newtxt = "referral"; }
    if(txt.match(/months enrolled in Loyalty/i)) { newtxt = txt.match(/[\d]+/)+" months"; };
    return newtxt;
}

function trimTable(t) {
Object.values(t.rows).forEach((r)=>{ 
    var c=r.cells; 
     if(c.length==4)   {      c[2].remove(); }
        c[2].innerText=trimCell(c[2]);
}); 

    return {"account":params['actid'],"lrpdata":t.innerText};
}


async function lrpScratch()
{
	fetch(location.origin+"/scratch-win").then((response)=>response.text()).then((text)=>{  lrpActivity['concentration']=text; });
		return lrpActivity['concentration'];
}
//grab lrp rewards phone codes and send them to server
//SPIN2WINWHEEL;
async function lrpSpin() 
{
    var fetchSpin=await fetch(location.origin+"/play/spin",{"headers": {"x-requested-with": "XMLHttpRequest"},"method": "POST"});
    var spinResult=spinResult={"error":"No Spin Attempted.","prize":null};
    try { spinResult = await fetchSpin.json(); } catch(e) { spinResult={"error":"Fetch Returned Bad Results.","prize":null};}
    var wheelPoints=(typeof(spinResult.error)=="undefined");
        if(wheelPoints==0) {  }
        else { wheelPoints = spinResult; }
        return spinResult; 
}	
    
	async function lrpSurvey()
	{
			var post_body="";
				if(document.querySelector('meta[name=_token]')!=null)
				{
					post_body="_token="+document.querySelector('meta[name=_token]').content+"&";
				}

		post_body+="brandSatisfaction=satisfied&fullName=Name&testimonial=Reward+Points+can+only+be+applied+towards+an+eligible+Total+by+Verizon+plan+when+you+accumulate+the+total+amount+of+points+needed.+Reward+Points+have+no+cash+value+and+cannot+be+transferred+to+another+customer.+Additional+terms+and+conditions+apply.&city=Townsville&state=GA";


		var result=await fetch(location.origin+"/home/testimonial", 
		{
			"headers": {"accept-language": "en-US,en;q=0.9","cache-control": "no-cache","content-type": "application/x-www-form-urlencoded","pragma": "no-cache"},
			"body": post_body,
			"method":"POST"
		});
		
		var result2=await result.text();
		return result2;
	}
	

async function lrpPoll() 
{ 
    var pollFrame1=document.createElement('iframe');
    document.body.appendChild(pollFrame1);
    pollFrame1.style="height:1px; width:1px;";
if(location.href!=pollFrame1.src) {    pollFrame1.src=location.origin+"/poll/vote/?wtfifr"; }
var pollFrame2=document.createElement('iframe');
    document.body.appendChild(pollFrame2);
	pollFrame2.style="height:1px; width:1px;";
if(location.href!=pollFrame2.src) {    pollFrame2.src=location.origin+"/poll/vote/?wtfifr"; }

setTimeout(()=>{  	
    
            var frm1=pollFrame1.contentDocument.forms[0];
			frm1.querySelector('input[type=radio]').disabled=false;
			frm1.querySelector('input[type=radio]').click();
			frm1.submit();
			

            var f2=pollFrame2.contentDocument.forms[0];
			f2.querySelector('input[type=radio]').disabled=false;
			f2.querySelector('input[type=radio]').click();
			f2.submit();
			pollFrame1.onload = function() 
			{
				var txt1=document.querySelectorAll('iframe[src*=poll]')[0].contentDocument.body.innerHTML; 
				if(txt1.match("Poll 1:You've already voted in this poll.")!=null){ui.log("Poll 1: 50 Points");} else { ui.log("Poll 1: 0 Points."); }
			}
			pollFrame2.onload = function() 
			{
				var txt2=document.querySelectorAll('iframe[src*=poll]')[0].contentDocument.body.innerHTML; 
				if(txt2.match("Poll 1:You've already voted in this poll.")!=null){ui.log("Poll 2: 50 Points");} else { ui.log("Poll 2: 0 Points."); }
			}	  
               
               },4000); 
}


async function lrpMatchGame() 
{
    var url="/play/concentration-confirmation";
	var totalPath = "https://rewards.totalbyverizon.com/play/concentration-confirmation/?gameType=Concentration&result=1#";
    var fetchMatchGame=await fetch(location.origin+"/play/concentration-confirmation/?gameType=Concentration&result=1#", {"headers": {"content-type": "application/x-www-form-urlencoded"},"body": "points=3&playtime=45","method": "POST"});
    var matchGameText= await fetchMatchGame.text();
    var MatchGamePoints=(matchGameText.match(/already earned the maximum number/gmi)==null)*10;
    return MatchGamePoints;
}
async function lrpVideo() {
var fetchVideo=await fetch(location.origin+"/handlers/TracfoneEventHandler", {
  "headers": {"content-type": "application/x-www-form-urlencoded; charset=UTF-8","pragma": "no-cache","x-requested-with": "XMLHttpRequest"},"body": "eventLog%5BeventName%5D=VIDEO_ENGAGING&eventLog%5BeventDescription%5D=","method": "POST"});
var videoResults = await fetchVideo.json(); 
return videoResults.message; }
async function lrpSocial(platform) 
{
    
var fetchSoscial = await fetch(location.origin+"/handlers/TracfoneEventHandler", {
  "headers": {"content-type": "application/x-www-form-urlencoded; charset=UTF-8","pragma": "no-cache"},"body": "eventLog%5BeventName%5D=SOCIAL_MEDIA_"+platform+"&eventLog%5BeventDescription%5D=",
  "method": "POST"});
    socialResult = await fetchSoscial.text();
    if(socialResult.match(/DOCTYPE/gmi)==null)
    {
        socialResult = JSON.parse(socialResult).message;
    }
    else 
    {
        socialResult={"error":"Fetch Returned Bad Results.","prize":null};
    }

    return socialResult;
}


    



async function grabCodes()
{
	if(document.querySelector('select')!=null) {
		var change = new Event('change');
			change.initEvent('change');
		var sel=document.querySelector('select');
			sel.value=-1;
			sel.dispatchEvent(change);

			var coupons={};
		var ctbl=document.querySelectorAll('table')[1].tBodies[0].innerText.split(/\n/); 
			ctbl=ctbl.forEach((row,n)=>{ coupons[n]=row.split(/\t/); });
			coupons=Object.values(coupons).filter((c)=>{  if(c[3]!='Expired') { return c; }})
			var x=await fetch(hostAddress+'/coupons/?c='+JSON.stringify(coupons));
			}
			else { console.warn('No Codes.'); }
			
			
}



//Color code the LRP Table;
async function styleRewardsTable(t,hideold)
{
	
	var evt = new Event('change'); evt.initEvent('change');
	var sel = document.querySelector('#datatable').parentElement.querySelector('select');
    sel.value=-1; sel.dispatchEvent(evt);    
    
	//Hide old rows or not.
	if(typeof(hideold)=="undefined") { var hideold=true; }
    
	//R = rows;
	var r=Object.values(t.tBodies[0].rows);
    var copyTable=t.tBodies[0].cloneNode(true );
	document.body.appendChild(copyTable);
	copyTable.id="copyTable";
	var sendTable=JSON.stringify(trimTable(copyTable));
	var sendingTable=await fetch(hostAddress,{ method: "POST",
    body: sendTable});
	
	r.forEach((x)=>
	{
        const msd=86400000; 
        var c1=x.cells[0]; 
        var t1=c1.innerText;
        var c2=x.cells[1];
        var t2=c2.innerText;
        var c3=x.cells[2];
        
        var pts=parseInt(t2);
        var waitPeriod=11;
        if(pts>=5000) { waitPeriod = 61; }

        var d1=new Date(t1)-0; 
        var today=new Date()-0;
        var dms=d1-today; 
        var dx=Math.floor(dms/msd)+waitPeriod;
            c3.innerText=dx; 
            if(dx<=29) { x.style = 'background-color:#060; color:#000;'; }
            if(dx<=7) { x.style = 'background-color:#0B0; color:#000;'; }
            if(dx<=0) { x.style = 'background-color:#0F0; color:#000;'; }
            if(dx<=-30) 
			{ 
				x.style = 'background-color:#666; color:#aaa;'; 
				if(hideold) {  x.style.display='none';  } else { x.style.display='table-row'; }
			}
    });
}


	async function dolrp(output)
	{
		
			if(document.querySelector('table#datatable')!=null)
			{
				styleRewardsTable(datatable); grabCodes();
			}
			
			if(location.search.match("wtfifr")==null)
			{
				lrpActivity["spin"] =await  lrpSpin().then((response)=>
				{
					console.log(response.error,response.prize); 
					if(typeof(response.prize)=='undefined' || response.prize === null) 
					{
						output.log(response.error); 
						lrpActivity["spin"] = 0;
					} 
					else
					{
						if(typeof(response.prize.translations)=='undefined') 
						{
							output.log(response.error);
							lrpActivity["spin"] = 0;
						}
						else
						{
							output.log("Spin: "+response.prize.translations.resultTitle); 
							lrpActivity["spin"] = 1;
						}
					}
				}); 
				
				
			
				lrpActivity["matchGame"] = await lrpMatchGame().then((response)=>{  output.log("Match: "+response+" Points."); });  
				lrpActivity["facebook"] =await lrpSocial("FACEBOOK").then((response)=>{ var pts=0; if(response.match(/max /g)==null) { pts=50;  }  output.log("Fbook: "+pts+" Points."); });
				lrpActivity["twitter"] = await lrpSocial("TWITTER").then((response)=>{ var pts=0; if(response.match(/max /g)==null) { pts=50;  }  output.log("Twitter: "+pts+" Points."); });
				lrpActivity['video'] = await lrpVideo().then((response)=>{ var pts=0; if(response.match(/max /g)==null) { pts=10;  }  output.log("Video: "+pts+" Points."); });
				lrpActivity['survey'] = await lrpSurvey();
				if(lrpActivity.survey.search("You’ve already earned the ")==-1)
				{
					lrpActivity.survey = 50;
				}
				else	
				{
					lrpActivity.survey = 0;
				}
					ui.log("Survey: "+lrpActivity.survey+" Points.");
				lrpPoll();
				lrpScratch();
			}
	}
	
	
	
	
function checkURLParams(urlParams)
{  
    var returnJSON={"actid":000000000,"pp":0,"ap":0};
    if(urlParams.get('actid')!=null && urlParams.get('pp')!=null && urlParams.get('ap')!=null)
    {
        var id=urlParams.get('actid');
        var pp=urlParams.get('pp');
        var ap=urlParams.get('ap');
    
        returnJSON={"actid":id,"pp":pp,"ap":ap};
        
    }
    return returnJSON;
}



    


    

	







//console.groupEnd();