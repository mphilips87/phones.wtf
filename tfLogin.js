

	class userLogin 
	{
		// constructor function for userLogin class
		constructor(usr,pwd) 
		{ 
				// create a user object to store account information and profile details
				this.user = {};
				// set account number to user object
				this.user.accntnum = usr;
				// set password to user object
				this.user.password = pwd;
				// set profile object with ID to user object
				this.user.profile={"id":usr};
				
				// get the dataset from the DOM element with data-brand attribute
				this.ds = document.querySelector('[data-brand]').dataset;
				
				// create an object to store web cookie information
				this.wc = {};
				// set function to retrieve web cookie token
				this.wc.wcTokenRequest = async ()=>{ return await cookieStore.get('wcToken').then((c)=>c.value).catch((err)=>err.name);  };
				// set function to retrieve web cookie trusted token
				this.wc.wcTrustRequest = async ()=>{ return await cookieStore.get('wcToken').then((c)=>c.value).catch((err)=>err.name);  };
				// set wcToken property to undefined
				this.wc.wcToken;
				// set wcTrust property to undefined
				this.wc.wcTrust;
				// set function to retrieve both web cookie tokens
				this.wc.getTokens = async()=>
				{
					this.wc.wcToken = await this.wc.wcTokenRequest();
					this.wc.wcTrust = await this.wc.wcTrustRequest();
				}
				
				// call getTokens function to retrieve web cookie tokens and roToken from API
				this.wc.getTokens()
					.then(async()=>
						{
							// set roToken property with API response
							this.wc.roToken = await this.api.roToken()
							.then((response)=>response.access_token); 
						})
					.then(async()=>
						{  
							// set profile property with API response
							this.user.profile = await this.api.profile(); 
						});
				
				// create an API object to store API endpoints
				this.api = {};
				// set API base URL
				this.api.url = "https://webapigateway.tracfone.com/api/pub/";

			
				// set API endpoint for retrieving roToken
				// accountid and password are optional parameters with default values of user account number and password respectively
				this.api.roToken = async (accountid = this.user.accntnum,password = this.user.password)=>
				{
					var results = false;
					// call API endpoint with fetch function
					results = await fetch(this.api.url+"oauth/token/ro?client_id="+this.ds.clientid+"&language=ENG",
						{
						  "headers": 
							{
								"access-control-expose-headers": "LtpaToken2","authenitcatecommerce": "FALSE","brandname": this.ds.brand,"content-type": "text/plain;charset=UTF-8",
								"sourcesystem": "WEB","wctoken": this.wc.wcToken,"wctrustedtoken": this.wc.wcTrust
							},
							"body": "username="+usr+"&password="+pwd+"&scope=TF-AEM-WEB&grant_type=password","method": "POST"
						})
					// parse API response as JSON
					.then((response)=>response.json())
					// catch and display any errors
					.catch((err)=>alert(err.message));
					return results;
				}

				this.api.profile = async ()=>
				{
					var results = false;
					// Send a GET request to retrieve the user's profile using the account ID, brand, and client ID
					// This endpoint requires authentication using the roToken
						results = await fetch(this.api.url+"customer-mgmt/customer/"+usr+"/profile?brand="+this.ds.brand+"&source=WEB&view=FULL&language=ENG&client_id="+this.ds.clientid,
						{"headers":{"authorization": "Bearer "+this.wc.roToken,"content-type": "application/json"},
						 "referrer": "https://www.tracfone.com/",
						  "referrerPolicy": "strict-origin-when-cross-origin",
						  "body": null,
						  "method": "GET",
						  "mode": "cors",
						  "credentials": "omit"
						})
							.then((response)=>response.json())
							.catch((err)=>alert(err.message));
					// Return the user's profile information
					return results;
				}

			// Return the userLogin object
			return this;
		}
	}

        // Function to prompt the user for their account ID and password, then create a new userLogin object with those credentials
        /*const logon=(p = true,usr,pwd)=>
        {
            if(p) { var usr = prompt("Account ID","",""); var pwd = prompt("Password","paradyne",""); }
            
            var auth = new userLogin(usr,pwd);
            return auth;
        }*/
		
//		console.log(logon);
console.log("User Login Script Loaded.");
const session = new userLogin("698591484","paradyne");
const userProfile = session.user.profile.customer;
const strProfile = JSON.stringify(userProfile);
console.log("%c "strProfile,"color:brown;");