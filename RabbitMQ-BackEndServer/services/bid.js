var mysql = require('./mySql');
var mysqlconnpool = require('./myConnSql').pool;
var register = require('./register');
var logFile = require('./logFile');
var purchase_history_order = function(msg,callback){
	console.log("purchase_history_order");
	try{

		mongo.connect(function(_connection){
			var coll = _connection.collection('history_order');
			
			coll.insert({"owner":msg.mail,"buyer":msg.buyer,"Amount":msg.result.price,
				"summary":msg.result.summary}),function(err,docsInserted){
				 if(docsInserted.length == 0){
					 console.log("couldnt insert data in sellerDetails");
				 } else {
					 console.log("inside else");
					 console.log("inserted successfully");
					 console.log(docsInserted);	 
				 }
					
			});	
				
			
	});
	catch(Exception){
		
		console.log(Exception);
		
	}
	
	
	






var updateQuantity = function(req,res,index,quantityToUpdate){
	console.log("inside update quantity");
	console.log(quantityToUpdate);
	console.log(index);
	console.log(req.session.cart[index].itemId);
	var params;
	try{

		mongo.connect(function(_connection){
			var coll = _connection.collection('history_order');
			
			coll.insert({"owner":msg.mail,"buyer":msg.buyer,"Amount":msg.result.price,
				"summary":msg.result.summary}),function(err,docsInserted){
				 if(docsInserted.length == 0){
					 console.log("couldnt insert data in sellerDetails");
				 } else {
					 console.log("inside else");
					 console.log("inserted successfully");
					 console.log(docsInserted);	 
				 }
					
			});	
				
			
	});
	catch(Exception){
		
		console.log(Exception);
		
	}
var orderConfirmation = function(req,res){
	console.log(req);
	console.log("now going to validate the card details");
	var result;
	var cardNo = req.body.cardNumber; // this is the card number from the screem
	var expiryDate = req.body.expiryDate; // this is the expiry date from the screen
	var cvvNumber = req.body.cvv; // this is the cvv number from the screen
	var quantityToUpdate;
	var index;
	console.log("card number is" +cardNo);
	console.log("expiryDate number is" +expiryDate);
	console.log("cvvNumber is" +cvvNumber);

	if(cardNo.length < 16 ){
		console.log("card number cannot be less than 16");
		result = {"statuscode":400,"error":"Card number cannot be less than 16"};
		res.send(result);
		
	} else if(cvvNumber.length < 3){
		console.log("cvv cannot be less than 3");
		result = {"statuscode":400,"error":"cvv cannot be less than 3"};
		res.send(result);
	}else if(expiryDate == null){
		console.log("expiryDate cannot be null");
		result = {"statuscode":400,"error":"expiryDate cannot be null"};
		res.send(result);
	}else{
		console.log("update the quantity in the table and session");
		logFile.logToFile(req,res,'Action: Ordered this item Quantity"'+req.session.cart.quantity+'"!');
		logFile.logToFile(req,res,'Action: Order Total"'+req.session.cart.price+'"!');
		console.log(req.session.cart);
		for(var i = 0 ; i < req.session.cart.length ;i++){
			req.session.cart[i].quantity = parseInt(req.session.cart[i].quantity) - 1;
			quantityToUpdate = req.session.cart[i].quantity;
			index = i;
			updateQuantity(req,res,index,quantityToUpdate);
			console.log("update the history table");
		}
		purchase_history_order(req,res);
		result = {"statuscode":200};
		res.send(result);
	}
};
var buyPage = function(req,res){
	console.log("inside buyPage");
	var valueItemId = req.body.valueItemId;
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('bidDetails');
		coll
		.find({"email":msg.username,"bidAmount":msg.amount})
		.toArray(function(err,docs){
		if (docs.length == 0) {
				// This way subsequent requests will know the user is logged in.
				console.log("error couldnt fetch");
				console.log(docs);
				res.code = "401";
				res.value = "Failed Login";

			} else {
				console.log("i got " +docs);
				console.log("getting the first name" +docs[0].firstName);
				console.log("getting the first name" +docs[0].lastloggedin);
				res.firstName = docs[0].firstName;
				console.log("first name is " +res.firstName);
				res.code = 200;
				var date = new Date(Date.now()).toLocaleString();
	            console.log("date is:"+date);
	            coll.update({"email":msg.username},{$set:{"lastloggedin":date}});
	            res.lastloggedin = docs[0].lastloggedin;
				res.value = "Success Login";
				callback(null, res);
			}
		});
	});
	
};
exports.buyPage    = buyPage;
exports.orderConfirmation = orderConfirmation;
