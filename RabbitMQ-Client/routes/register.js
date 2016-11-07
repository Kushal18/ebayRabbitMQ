//var mongoURL = "mongodb://localhost:27017/meantest";
//var mongo = require("./mongo");
var mq_client = require('../rpc/client');

var signin = function(req,res){
	console.log("inside sigin");
	var username = req.body.email;
	var password = req.body.password;
	console.log(password +" is the object");
	console.log("username is "+username);
	console.log("password is "+password);
	var json_responses;
	var msg_payload = { "username": username, "password": password };
	console.log("In POST Request = UserName:"+ username+" "+password);
	

	mq_client.make_request('login_queue',msg_payload, function(err,results){
		console.log("results code is " +results.code);
		console.log("results first name is " +results.firstName);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("valid Login");
				console.log("first name of this user is ");
				var firstName = results.firstName;
				console.log("first Name "+firstName);
				req.session.email = req.body.email; //since request was succesfull hence setting the email in the session
				req.session.username = firstName;
				req.session.lastLogin = results.lastloggedin;
				console.log("last login "+results.lastLogin);
				res.send({"login":firstName});
			}
			else {    
				
				console.log("Invalid Login");
				res.send({"login":"Fail"});
			}
		}  
	});
	



};

var register = function(req,res){
	var json_responses;
	console.log("inside register");
	console.log(req);
	var email = req.body.email;
	var password = req.body.password;
	var result;
	result = req.body;
	console.log(result);
	var msg_payload = { "result": result };
	mq_client.make_request('register_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("valid Login");
				
				res.send({"register":"Success"});
			}
			else {    
				
				console.log("Invalid Login");
				res.send({"register":"Fail"});
			}
		}  
	});
	



};

var sell = function(req,res){
	console.log("inside sell");
	console.log(req.session.email);
	
	var msg_payload = { "result": req.body , "mail":req.session.email};
	mq_client.make_request('sell_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				
			}
			else {    
				
				
			}
		}  
	});
};

exports.sell = sell;
exports.signin = signin;
exports.register = register;
