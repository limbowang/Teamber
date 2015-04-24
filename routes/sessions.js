var express = require('express');
var models = require('../models');

var router = express.Router();
var User = models.User;

// login
router.post('/create', function(req, res, next) {

	// user authentication
	result = User.check(req.username, req.password);
	if (result) {
		req.session.login    = "true";
		req.session.nickname = result.nickname;
		req.session.avatar   = result.avatar;
		res.redirect('/dashboard');
	} else {
		res.redirect('back');
	}
});

// logout
router.post('/destroy', function(req, res, next) {
	req.session.destroy();
	res.redirect('/signin');
});

module.exports = router;
