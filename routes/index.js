var express = require('express');
var csrf = require('csurf');
var filters = require('./filters');

var isAuth = filters.isAuth;
var isNotAuth = filters.isNotAuth;
var router = express.Router();

router.param('id', function (req, res, next, id) {
  if (isNaN(id)) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  } else {
  	next();
  }
});

router.get('/', isNotAuth, function(req, res, next) {
  res.render('index', { title: '首页'});
});

router.get('/dashboard', isAuth, function(req, res, next) {
  res.render('dashboard', { title: '我的面板' });
});

router.get('/signin', isNotAuth, csrf(), function(req, res, next) {
  res.render('signin', { title: '登录' });
});

router.get('/signup', isNotAuth, function(req, res, next) {
  res.render('signup', {
    title: '注册',
    helpers: {
      error: function() { return ""; }
    }
  });
});

router.get('/profile', isAuth, function(req, res, next) {
  res.render('index', { title: '个人资料' });
});


module.exports = router;