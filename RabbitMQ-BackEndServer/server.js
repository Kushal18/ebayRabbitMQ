//super simple rpc server example
var amqp = require('amqp')
, util = require('util');
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var login = require('./services/login');
var sell = require('./services/sell');
var app = express();

app.post('/login',
		  passport.authenticate('local', { successRedirect: '/',
		                                   failureRedirect: '/login',
		                                   failureFlash: true })
		);
app.use(session({secret: 'ssshhhh', 
    saveUninitialized: true,
    resave: true}));
// all environments

app.use(session({
    secret: 'foo',
    resave:false,
    saveUninitialized:false
    
    
}));
app.use(passport.initialize());
app.use(passport.session());
var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
	console.log("listening on login_queue");

	cnn.queue('login_queue', function(q){
	
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.handle_request(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});



cnn.on('ready', function(){
	console.log("listening on register_queue");

	cnn.queue('register_queue', function(q){
	
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.register(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});


cnn.on('ready', function(){
	console.log("listening on sell_queue");

	cnn.queue('sell_queue', function(q){
	
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			sell.sell(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});

cnn.on('ready', function(){
	console.log("listening on search_queue");

	cnn.queue('sell_queue', function(q){
	
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.search(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});

cnn.on('ready', function(){
	console.log("listening on puchase_and_account_queue");

	cnn.queue('sell_queue', function(q){
	
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.puchase(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
