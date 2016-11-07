
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('signin_register', { title: 'Express' });
};

exports.home = function(req, res){
	 res.render('home', { title: 'Express' });
	};