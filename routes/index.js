var express = require('express');
var csrf = require('csurf');
var filters = require('./filters');
var models  = require('../models');

var router = express.Router();
var User = models.User;

router.param('id', function (req, res, next, id) {
  if (isNaN(id)) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  } else {
  	next();
  }
});

router.get('/', function(req, res, next) {
  res.render('index', { title: '首页'});
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: '我的面板' });
});

router.get('/signin', csrf(), function(req, res, next) {
  res.render('signin', { title: '登录' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', {
    title: '注册',
    helpers: {
      error: function() { return ""; }
    }
  });
});

router.get('/admin', filters.isAdmin, function(req, res, next) {
  var userId = req.user.id;
  User
  .findAll()
  .then(function(users) {
    res.render('admin', { title: '管理', users: users });
  })
  .catch(function(e) {
    res.render('admin', { title: '管理'});
  })
})


module.exports = router;