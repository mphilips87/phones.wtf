function parseTrackingData(data)
{
    var shipments=[];
        data.forEach((response)=>
            {
                if(typeof(response.TrackResponse.Shipment.Package)=='undefined')
                {
                    Object.values(data.TrackResponse.Shipment).forEach((shp)=>
                    {
                        shipments.push(shp);
                    }); 
                }
                 else 
                 {
                     shipments.push(data.TrackResponse.Shipment);
                 }
                });
                console.log(shipments);
            shipments.forEach((shp)=>{ console.log(shp); });
}

var trackingData=[];
var promises=[];
    inputs.forEach((i,n)=>
    {
        promises[n] = fetch("https://phones.wtf/api/ups?q="+i[0]+"&z="+i[1]).then(res => res.json());
    });

Promise.allSettled(promises).
    then((results) => results.forEach((result) =>
    {
            if(typeof(result.value.TrackResponse)=='object')
            {
                trackingData.push(result.value); 
            }
     })).then(()=>{  parseTrackingData(trackingData);  }); 
     })).then(()=>{  parseTrackingData(trackingData);  }); 