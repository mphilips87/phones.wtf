async function getWMStoreInfo() 
{
	if(location.pathname.match(/undefined-undefined/)==null)
	{
		var jsn=JSON.parse(document.querySelector('script[type*=app]').innerHTML);
		var data=jsn.props.pageProps.initialData.initialDataNodeDetail.data;
		var sid = "wm"+data.nodeDetail.id;
		var store={};
		if(typeof(localStorage.wmstores)!='undefined')
		{
			var store = JSON.parse(localStorage.wmstores);    
		}   
		store[sid]={};
		store[sid].Address=data.nodeDetail.address.addressLineOne;
		store[sid].city=data.nodeDetail.address.city;
		store[sid].state=data.nodeDetail.address.state;
		store[sid].zip=data.nodeDetail.address.postalCode;
		store[sid].phone=data.nodeDetail.phoneNumber;
		localStorage.wmstores=JSON.stringify(store);
		var send=await fetch('https://phones.wtf/fetch/2/update.php?s='+JSON.stringify(store[sid]));
		var reslt=await send.text();
			console.log(reslt);
		var nextStore=location.origin+"/store/"+eval(parseInt(sid.substr(2))+1);
	}
	else
	{
		var nextStore=location.origin+"/store/"+eval(parseInt(location.pathname.substr(7).replaceAll(/[^\d]/g,''))+1);
	}
		
		location.href=nextStore;
}

if(location.host=="www.walmart.com" && location.pathname.match(/store\/[\d]/gmi))
{
	getWMStoreInfo();
}
