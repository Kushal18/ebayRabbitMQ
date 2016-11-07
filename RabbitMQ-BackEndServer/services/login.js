var mongoURL = "mongodb://localhost:27017/meantest";
var mongo = require("./mongo");
function handle_request(msg, callback){
	var res = {};
	var username = msg.username;
	var password = msg.password;
	var json_responses;
	console.log("In handle request:"+ username);
	console.log("message is :"+ password);
	try{
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('login');
			coll
			.find({"email":msg.username,"password":msg.password})
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
	}catch(Exception){
		console.log(Excpetion);
	}
	

	
	
}
function register(msg, callback){
	console.log("inside register");
	var res = {};
	var result = msg.result;
	console.log(result);
	try{
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('login');
			coll.insertOne(result, function(err, user){
				if (user) {
					// This way subsequent requests will know the user is logged in.
					console.log("inside");
					res.code = "200";
					res.value= "Registerd Succesfully";

				} else {
					console.log("returned false");
					res.code = "401";
					res.value= "Registerd Unsuccesfully";
				}
			});
		});
	}catch(Exception){
		console.log(Exception);
	}
	
	
}

exports.handle_request = handle_request;
exports.register = register;