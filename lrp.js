//console.log('lrp.js');
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

function trimTable(t) 
{
	Object.values(t.rows).forEach((r)=>{ 
		var c=r.cells; 
			if(c.length==4)   {      c[2].remove(); }
			c[2].innerText=trimCell(c[2]);
	}); 
	
		return {"account":actid,"lrpdata":t.innerText};
}


async function lrpScratch()
{
	fetch(location.origin+"/scratch-win").then((response)=>response.text()).then((text)=>{  lrpActivity['concentration']=text; });
		return lrpActivity['concentration'];
}

async function lrpSpin() 
{
	var w = await fetch(location.origin+"/play/spin",{"headers": {"x-requested-with": "XMLHttpRequest"},"method": "POST"});
	 
	 var pts = 0;
if(typeof(w.error)=='undefined') 
{
    if(typeof(w.prize)!='undefined') 
    {
        if(typeof(w.prize.points)!='undefined') 
        {
            if(w.prize.points != null)
            {
                pts = w.prize.points;    
            }
        }
    }
}

return pts;
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
		"headers": {"accept-language": "en-US,en;q=0.9","cache-control": "no-cache","content-type": "application/x-www-form-urlencoded","pragma": "no-cache"},"body": post_body,"method":"POST"
	});
		var result2=await result.text();
		return result2;
}
	

function getPollFormValues(HTML)
{
    var formValues = [];    
    
        formHTML=HTML.match(/\<form[\w\d\W\n\t]{1,}<\/form>/g)[0];
        formElementsHTML=formHTML.match(/<input [\w\d\W ]{20,90}>/g);
        formValues['action'] = "https://"+formHTML.match(/(?<=<form action="\/\/)[\w\.\/]+/g)[0];
        formElementsHTML.forEach((el)=>{ formValues[el.match(/(?<=name=\")\w+(?=")/g)[0]] = el.match(/(?<=value=\")\w+(?=")/g)[0]; }); 

    return formValues;
}

async function answerPoll(pts)
{
    out=pts+await fetch(location.origin+"/poll/vote").then((response)=>response.text())
    .then((HTML)=>getPollFormValues(HTML))
    .then(async (vals)=>
        {
            var formBody={};
                formBody.SurveyId=vals.SurveyId;
                formBody.questionId=vals.questionId;
                formBody.answer=vals.answer;
            var strBody=JSON.stringify(formBody);
            var out=await fetch(vals.action,{"body":strBody,"method":"POST"})
                .then((response)=>response.text())
                .then((result)=>
                    {  
                        var points = 0;
                            points=(!/already voted in this poll/.test(result))*50; return points; 
                    });
                
            return out;
    });

    return out;   
} 

async function lrpPoll(x)
{
    var totalPoints = 0;
    if(typeof(x)=='undefined') { var x = 2; }
    var i = 0;
    while(i<x)
        {
             totalPoints = await answerPoll(totalPoints);    
            i++;
        }
    return totalPoints;
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
			var x=await fetch($HOST_URL+'/coupons/?c='+JSON.stringify(coupons));
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
	var sendingTable=await fetch($HOST_URL+"/",{ method: "POST",
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


async function dolrp(output,account)
{
		if(typeof(account)!='undefined')
		{
			fetch($HOST_URL+"/json/accounts/"+account+".json")
			.then((account)=>account.json())
			.then((account)=>{ ui.log(account.contactMedium[1].contactDetails.emailAddress,3); });
		}	
		
			if(document.querySelector('table#datatable')!=null)
			{
				styleRewardsTable(datatable);
				grabCodes();
			}
			
			if(location.search.match("wtfifr")==null)
			{
				lrpActivity["spin"]=await lrpSpin().then((pts)=>{  output.log("Spin: "+pts+" Points."); return pts;  })
				lrpActivity["matchGame"] = await lrpMatchGame().then((pts)=>{   output.log("Match: "+pts+" Points."); return pts; });  
				lrpActivity["facebook"] =await lrpSocial("FACEBOOK").then((response)=>{ var pts=0; if(response.match(/max /g)==null) { pts=50;  }  output.log("Fbook: "+pts+" Points."); return pts; });
				lrpActivity["twitter"] = await lrpSocial("TWITTER").then((response)=>{ var pts=0; if(response.match(/max /g)==null) { pts=50;  }  output.log("Twitter: "+pts+" Points."); return pts; });
				lrpActivity['video'] = await lrpVideo().then((response)=>{ var pts=0; if(response.match(/max /g)==null) { pts=10;  }  output.log("Video: "+pts+" Points."); return pts; });
				lrpActivity['survey'] = await lrpSurvey().then((response)=>{ var pts=0; if(response.search("You’ve already earned the ")==-1){ pts=50;} ui.log("Survey: "+pts+" Points."); return pts; })
				lrpActivity['poll'] = await lrpPoll(2).then((pts)=>{ ui.log("Poll: "+pts+" Points."); return pts; });
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




    


    

	







