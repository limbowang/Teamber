var express = require('express');
var models = require('../models');

var router = express.Router();
var User = models.User;

// login
router.post('/create', function(req, res, next) {

	// user authentication
	var params = req.body;
	User.check(params.username, params.password, function(user, e) {
		if (user) {
			req.session.login    = "true";
			req.session.userid   = user.id;
			req.session.nickname = user.nickname;
			req.session.avatar   = user.avatar;
			res.redirect('/dashboard');
		} else {
			req.session.flash.errors = e;
			req.session.flash.old    = params;
			res.redirect('back');
		}
	});
});

// logout
router.post('/destroy', function(req, res, next) {
	req.session.destroy();
	res.redirect('/signin');
});

module.exports = router;
