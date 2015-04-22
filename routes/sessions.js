var express = require('express');
var router = express.Router();

// login
router.post('/create', function(req, res, next) {
	var 
		username = req.params.username,
		password = req.params.password;

	// user authentication


	req.session.login = "true";
	res.redirect('/dashboard');
});

// logout
router.post('/destroy', function(req, res, next) {
	req.session.login = null;
	res.redirect('/signin');
});

module.exports = router;
