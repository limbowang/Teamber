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

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard', isAuth, function(req, res, next) {
  console.log(req.session);
  res.render('dashboard', { title: '我的面板' });
});

router.get('/signin', isNotAuth, csrf(), function(req, res, next) {
  res.render('signin', { title: '登录' });
});

router.get('/signup', isNotAuth, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile', isAuth, function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;