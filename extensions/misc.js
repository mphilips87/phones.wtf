/*if(location.hostname.match(/shop./gmi)!=null) {
psfunc.xhrList=function xhrPhoneList()
{
var psxhr;
var phonelist;
function getPSXHR()
{    	
	var catid=catids[location.host.split('.')[1]];
    var shopurl = '/shop/CategoryNavigationResultsView?sType=SimpleSearch&catalogId='+cid+'&filterFacet=&searchType=&resultCatEntryType=&pageSize=99&langId=-1&storeId='+sid+'&categoryId='+catid;
"https://shop.simplemobile.com/shop/CategoryNavigationResultsView?sType=SimpleSearch&catalogId="+sid+"&filterFacet=&searchType=&resultCatEntryType=&pageSize=58&langId=-1&storeId=11251&categoryId="+cid;
	
	//var shopurl='webapp/wcs/stores/servlet/en/tracfonestore/phones?pageSize=150&sType=SimpleSearch&catalogId='+cid+'&filterFacet=&searchType=&resultCatEntryType=&pageSize=90&langId=-1&storeId='+sid+'&categoryId=19512&manufacturer=';
    	//var shopurl='/webapp/wcs/stores/servlet/en/totalwireless/phones?catalogId='+cid+'&pageSize=99&storeId='+sid;
		
		var shoptype=0;
    	var t = {};
    	var x=new XMLHttpRequest();
    		var responseContainer=document.createElement('div');
            document.body.appendChild(responseContainer);
            responseContainer.style='width:1200px; border:1px solid #000; position:absolute; top:0; left:500;';


        x.open('GET',shopurl);
    	x.onload=function()
    	{
            responseContainer.setAttribute('phonesmartxhr','shopurl');
            var htmlcontainer=document.createElement('div');
                htmlcontainer.style='display:none;';
                document.body.appendChild(htmlcontainer);
                htmlcontainer.setAttribute('psxhr','');
            var htmlresult = x.response;
            psxhr=document.querySelector('[psxhr]');
            psxhr.innerHTML=htmlresult;
            phonelist=psfunc.scanShop(Object.values(psxhr.querySelectorAll('[id*=plplist]')));
            psfunc.phoneListMenu('tracfone',phonelist);
    	};
    x.send(); 

}

getPSXHR();
}


psfunc.a2cb=function add2cartButton(btn)
{
    
    if(phoneSmart.okgo)
    {
        phoneSmart.okgo=false; btn.disabled=1;  
        var divAddingPhoneStatus = document.createElement('div');  
        var phoneItem=btn.parentElement;
        phoneItem.appendChild(divAddingPhoneStatus);
        divAddingPhoneStatus.style='position:relative; top:-25px; left:25px; border:2px solid orange; background:#000; color:#FFF; width:50%; height:28px; padding:4px;';
        divAddingPhoneStatus.innerText='Adding Phone...';
        var phone_pid=phoneItem.getAttribute('pid');
            phoneSmart.postData.add2cart='storeId='+sid+'&catalogId='+cid+'&orderId=.&inventoryValidation=true&catEntryId_1='+phone_pid+'&quantity_1=1';
        var a2curl=phoneSmart.urls.add2cart+'?'+phoneSmart.postData.add2cart;
        var x=new XMLHttpRequest();
            x.open('GET',a2curl);
            x.onload=function()
            {
                setTimeout(
                function()
                {
                    phoneSmart.okgo=true;
                    btn.disabled=0;
                    if(x.response.length==72) 
                    {
                        divAddingPhoneStatus.innerText = 'Successfully added '+phoneItem.getAttribute('sku'); 
                        divAddingPhoneStatus.style.color='lime'; 
                        divAddingPhoneStatus.style.borderColor='lime'; 
                        setTimeout(function(){ divAddingPhoneStatus.remove(); },2000);
                    }
                    else 
                    {
                        divAddingPhoneStatus.innerText = 'Failed to add '+phoneItem.getAttribute('sku');
                        divAddingPhoneStatus.style.color='red'; 
                        divAddingPhoneStatus.style.borderColor='red'; 
                        setTimeout(function(){ divAddingPhoneStatus.remove(); },2000);
                    }
                },900);
            }
               x.send();
    }
}
phoneSmart.functions.lsclear = function lsclear() {
Object.keys(localStorage).forEach(function(k,v)
{
    var result="Removing "+k; 
    localStorage.removeItem(k);  
    try{ //console.log(localStorage[k]);
        if(typeof(localStorage[k])=='undefined') {  result+='...Removed'; } }catch(err)
        {
            result+="...Failed.";
        }
        pslog(result);
});}
psfunc.updateqty=function()
{
        var oldHTML0=document.querySelectorAll('select')[0].parentElement.innerHTML;
        var oldHTML1=document.querySelectorAll('select')[1].parentElement.innerHTML;
        var oldHTML2=document.querySelectorAll('select')[2].parentElement.innerHTML;
        document.querySelectorAll('select')[2].parentElement.innerHTML=oldHTML2.replace('<select ','<input type="text" ').replace('</select>','');
        document.querySelectorAll('select')[1].parentElement.innerHTML=oldHTML1.replace('<select ','<input type="text" ').replace('</select>','');
        document.querySelectorAll('select')[0].parentElement.innerHTML=oldHTML0.replace('<select ','<input type="text" ').replace('</select>','');

}
var website=location.protocol+'//'+location.host;
var workingsites=new Array('https://shop.tracfone.com','https://shop.net10wireless.com','https://shop.simplemobile.com','https://shop.totalwireless.com','https://shop.straighttalk.com');
var ok2run=(workingsites.includes(website));
	if(ok2run)
	{   
		psfunc.lsclear();
		
		console.clear();
		pslog('OK2run...');
		pslog('OkGo.....');
	}	
}

psfunc.scanShop =  function scanshop(t)
{
	pslog('<scanShop>'); 
    var phonelist={};
    //if(typeof(t)=='undefined') { var t = Object.values(document.querySelectorAll('div[class*=plplist]')); }
    t.forEach(function(phone)
    {
        var pid=phone.id.split('_')[1];
		var purl = phone.querySelectorAll('a[id*=cat]')[0].href;
        var pnm=phone.querySelectorAll('h3')[1].innerText.replaceAll(/ - |RECONDITIONED |[ ][\(][0-9A-Z]{4,8}[)]/gmi,'');
        var prc=phone.querySelector('.pricing').querySelector('h4').innerHTML.split(/[<]/gmi)[0];
        if(pnm!='					')
		{
			var idnm = pid + ' - ' + pnm + ' - ' + prc; 
				phonelist[pid]={};
				phonelist[pid]['name']=pnm;
                phonelist[pid]['price']=prc;
				phonelist[pid]['url'] = purl; 
        }
    });
    
    phoneSmart.phonelist=Object.values(phonelist);
	return phonelist;


}


psfunc.phoneListMenu=function(site,list) 
{
		var plist=list;
        pslog(list);
		pslog('Loading Phones...\n\n');
		pslog('Loaded.');
        
		if(document.querySelector('#pslistContainer')!=null)
		{
			pslog('Removing Old List.'); 
			document.querySelector('#pslistContainer').remove();
		}
			
		var divListContainer = document.createElement('div');
		var divList = document.createElement('ul');
			document.body.appendChild(divListContainer);
			divListContainer.appendChild(divList);
			divList.style='width:480px; font-size:9pt; padding:0px 0px; background:#FFE;';
			divList.setAttribute('class','psList');
			divListContainer.setAttribute('id','pslistContainer');
			divListContainer.style='height:320px; width:520px; border:1px solid #000; overflow-y:scroll; position:fixed; top:50px; left:66px; opacity:100%; background:#FFE;';
        
		
		pslog(plist);
		Object.entries(plist).forEach(function(phone,n)
        {
			var phoneListItem=document.createElement('li');
				divList.appendChild(phoneListItem);
				phoneListItem.innerHTML='<a href='+phone[1].url+' target="_ps_iframe">'+phone[1]['name'].replaceAll(/-|RECONDITIONED/gmi,'')+' ['+phone[0]+'] - '+phone[1].price+'</a><button style="display:none;">Add2Cart</button>';
				phoneListItem.setAttribute('a2c','storeId='+sid+'&catalogId='+cid+'&orderId=.&inventoryValidation=true&catEntryId_1='+pid+'&quantity_1='+qty); 
				phoneListItem.setAttribute('price',phone[1]['price']);
				phoneListItem.setAttribute('pid',phone[0]);
				phoneListItem.setAttribute('id','pli_'+phone[0]);
				phoneListItem.setAttribute('pname',phoneListItem.innerText.split(' (')[0]);
			
			try{ phoneListItem.setAttribute('sku',phoneListItem.innerText.split(' (')[1].split(')')[0]); }catch(err){  phoneListItem.setAttribute('sku',phoneListItem.getAttribute('pname').substr(0,12)); };
				phoneListItem.children[1].addEventListener('click',function(evt){  psfunc.a2cb(evt.target); },false);
				phoneListItem.style='list-style:none; border:0px solid #000; border-bottom:0px; padding:5px; padding-left:15px;'; phoneListItem.querySelector('a').style='cursor: grab;';
				phoneListItem.addEventListener('mouseover',function(evt) { if(phoneSmart.okgo) {  var s=phoneListItem.style; s.backgroundColor='rgba(254, 189, 24,50%)';  s.backdropFilter='contrast(0.6) blur(2px)'; s.color='#000';  s.fontWeight='bold'; phoneListItem.querySelector('button').style.display='block'; } },true);
				phoneListItem.addEventListener('mouseout',function(evt) { if(phoneSmart.okgo) { var s=phoneListItem.style; s.backgroundColor='revert'; s.color='revert';  s.backdropFilter=''; s.fontWeight='normal'; phoneListItem.querySelector('button').style.display='none';  } },true);
        });

		setTimeout(function(){
			
		try{	
		document.querySelector('.psList').style.backgroundImage="url(\'https://phones.wtf/api/media/bgshadow3.png\')";
		ment.querySelector('.psList').style.backgroundAttachment="fixed";
		document.querySelector('.psList').style.backgroundPositionY="50px";
		document.querySelector('.psList').style.backgroundPositionX="66px";
		document.querySelector('.psList').style.backgroundRepeat="no-repeat";
		}catch(err){  console.error('FAIL!'); }
		},400);
}


phoneSmart.postData.add2cart='storeId='+sid+'&catalogId='+cid+'&orderId=.&inventoryValidation=true&catEntryId_1='+pid+'&quantity_1='+qty;
    phoneSmart.ls=typeof(localStorage.phonelist)!='undefined';

var site=location.host.split('.')[1];
    phoneSmart['site'] = site;
    phoneSmart['siteData'] = {};

if(phoneSmart.ls)
{
    
    phoneSmart.siteData[phoneSmart.site] = {};
    var shopdata=phoneSmart.siteData[phoneSmart.site];
    shopdata.phonelist=JSON.parse(localStorage.phonelist);
}


phoneSmart.var={};
phoneSmart.okgo=true;
phoneSmart.functions={};
psfunc=phoneSmart.functions;
psfunc.getPid=function getPid(q) 
{
	q=q.toUpperCase();
	var result=Object.entries(phoneSmart.siteData.tracfone.phonelist).find(
	function(n)
	{
		if(n[1].name.search(q)>-1)
		{
			return n; 
		}
		
	})[0];
	return result;
}

psfunc.getSKU=function getSKU(q) 
{
	q=q.toUpperCase();
	var result=Object.entries(phoneSmart.siteData.tracfone.phonelist).find(
	function(n)
	{
		if(n[1].name.search(q)>-1 || n[0].search(q)>-1)
		{
			return n; 
		}
	})[1]['name'].split(' (')[1].split(')')[0];
	return result; 
}

psfunc.getPhone=function getName(q) 
{
	q=q.toUpperCase(); var result=Object.entries(phoneSmart.siteData.tracfone.phonelist).find(function(n){  if(n[1].name.search(q)>-1 || n[0].search(q)>-1) { return n; } })[1]['name']; return result; 
}


var checkSplit=location.search.replace("?","").split(/=/);
async function jankyCheckOrder(){
if(checkSplit[0]=='checkOrder')
{
		jankyCheckOrder(); 
}

var WCParamJS = {};
	
var cid=catids 
var pid=281505;	
var catids=new Array();
catids['simplemobile'] = 23502;
catids['tracfone'] = 19512;
catids['totalwireless'] = 22001;
catids['net10wireless'] = 19017;
var storeIds={};
storeIds['tracfone'] = 20002;
var sid=storeIds[location.hostname.split('.')[0]];
var catid=catids[location.hostname.split('.')[0]];
var qty=1;
WCParamJS.storeId = sid;
WCParamJS.catalogId = cid;
function pslog(x){ if(typeof(x)=="string") { console.log('PS:> '+x);  } else { console.log('PS:> '+JSON.stringify(x)); } }

function vis(){document.getElementById('zipcode_needed').style.display='none'; document.body.style.overflow='scroll';   javascript:function zzzz() { xc=0;var tstStr='';while(document.getElementsByClassName("plp_noti").length >xc){tstStr = document.getElementsByClassName("plp_noti")[xc].innerHTML.replace(/(^\s+|\s+$)/g,'');if (document.getElementsByClassName("plp_noti")[xc].style.display != 'none'){if (tstStr=="In Stock") { document.getElementsByClassName("plp_noti")[xc].style.background='lime';document.getElementsByClassName("plp_noti")[xc].parentElement.parentElement.parentElement.style.background='lime';}else if (tstStr=="Limited Quantity"){document.getElementsByClassName("plp_noti")[xc].style.background='yellow';document.getElementsByClassName("plp_noti")[xc].parentElement.parentElement.parentElement.style.background='yellow'; }else{ document.getElementsByClassName("plp_noti")[xc].style.background='red';document.getElementsByClassName("plp_noti")[xc].parentElement.parentElement.parentElement.style.background='red';}}xc++;} return false;} zzzz();}//vis();


var phoneSmart={};
phoneSmart.phonelist={'00000000':{'name':'Test Phone','price':'9.99'}};
phoneSmart['urls']={}
phoneSmart['urls']['old_tf_shop_url'] = 'https://shop.tracfone.com/webapp/wcs/stores/servlet/en/tracfonestore/phones?pageSize=99&contentBeginIndex=0&productBeginIndex=0&beginIndex=0&orderBy=3&isHistory=false&pageView=grid&resultType=products&orderByContent=&searchTerm=&facet=&facetLimit=&minPrice=&maxPrice=&facetPath=&storeId=20002&catalogId=11051&langId=-1&objectId=&requesttype=ajax';
phoneSmart.urls['add2cart'] = 'https://shop.'+location.host.split('.')[1]+'.com/webapp/wcs/stores/servlet/AjaxOrderChangeServiceItemAdd';
phoneSmart.postData={};


var cid=WCParamJS.catalogId;
var sid=WCParamJS.storeId;
var pid=281505;	 
var qty=1;

*/