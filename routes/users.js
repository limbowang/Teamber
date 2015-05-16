var express = require('express');
var filters = require('./filters');
var models  = require('../models');
var utils   = require('./utils');

var router = express.Router();
var User   = models.User;
var getValidateError = utils.getValidateError;

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
    password_confirm: params.password_confirm,
    email:    params.email,
    nickname: params.nickname
  })
  .then(function(user) {
    req.session.login    = "true";
    req.session.userid       = user.id;
    req.session.nickname = user.nickname;
    req.session.avatar   = user.avatar;
    res.redirect('/dashboard');
  })
  .catch(function(e, user) {
    req.session.flash.errors = getValidateError(e);
    req.session.flash.old = params;
    res.redirect('/signup');
  });
});

router.post('/:id/update', function(req, res, next) {
});

router.post('/:id/destroy', function(req, res, next) {
});

router.get('/:id', function(req, res, next) {
  res.render('index', { title: 'User test' });
});

module.exports = router;