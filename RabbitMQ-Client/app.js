var express = require('express')
  , routes = require('./routes')
  , http = require('http')
   path = require('path');
var register = require('./routes/register');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();


app.use(session({secret: 'ssshhhh', 
    saveUninitialized: true,
    resave: true}));
// all environments

app.use(session({
    secret: 'foo',
    resave:false,
    saveUninitialized:false
}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/signin', routes.index);
//app.get('/signin',home.sign_in);
app.post('/signinRegister', register.signin);

app.get('/confirm-login', function (req, res) {
	console.log("session variable!!!");
	var user = {"id":req.session.username,"lastLogin":req.session.lastLogin};
    res.send(user);
}
);

app.use('/sell',register.sell);

//app.get('/success_login', home.success_login);
//app.get('/fail_login', home.fail_login);
app.use('/register',register.register);
app.get('/home', routes.home);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
