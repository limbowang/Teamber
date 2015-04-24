var express = require('express');
var filters = require('./filters');
var models  = require('../models');

var router = express.Router();
var isAuth = filters.isAuth;
var User   = models.User; 

router.param('id', function(req, res, next, id) {
  if (isNaN(id)) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  } else {
  	next();
  }
});

router.post('/create', function(req, res, next) {
	var params = req.body;
	User
		.create({
			username: params.username,
			password: params.password,
			email:    params.email,
			nickname: params.nickname
		})
		.then(function(user) {
			req.session.login    = "true";
			req.session.nickname = user.nickname;
			req.session.avatar   = user.avatar;
			res.redirect('/dashboard');
		})
		.catch(function(e) {
			console.log(e);
			res.redirect('back');
		});
});

router.post('/:id/update', function(req, res, next) {
});

router.post('/:id/destroy', function(req, res, next) {
});

router.get('/:id', isAuth, function(req, res, next) {
  res.render('index', { title: 'User test' });
});

module.exports = router;