var mongoURL = "mongodb://localhost:27017/meantest";
var mongo = require("./mongo");

function sell(msg, callback){
	var req = {};
	console.log("storing the summary in a session");
	console.log(msg);
	
	console.log(msg.result.summary);
	console.log(msg.mail);

	if(typeof msg.mail !== "undefined" || msg.mail !== ''){
	mongo.connect(function(_connection){
		var coll = _connection.collection('sellerDetails');
		
		coll.insert({"email":msg.mail,"itemToSell":msg.result.itemToSell,"price":msg.result.price,
			"sellerName":msg.result.sellerName,"itemavailable":msg.result.quantity,"itemsold":0,
			"itemowner":msg.mail,"quantity":msg.result.quantity,"summary":msg.result.summary,
			"feature1":msg.result.feature1,"feature2":msg.result.feature2,"feature3":msg.result.feature3,
			"feature4":msg.result.feature4,"address":msg.result.address,"auction":msg.result.auction},function(err,docsInserted){
			 if(docsInserted.length == 0){
				 console.log("couldnt insert data in sellerDetails");
			 } else {
				 console.log("inside else");
				 console.log("inserted successfully");
				 console.log(docsInserted);	 
			 }
				
			
			});
		});
			
	}
	


}

exports.sell = sell;