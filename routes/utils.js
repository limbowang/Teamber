var crypto = require('crypto');
var t = require('../lib/translation');

var utils = {};

utils.loadUser = function(req, res, next) {
  var isLogined = req.session? req.session.login : "";
  if (!req.user && isLogined && isLogined == "true") {
    // load user
    res.locals.user = req.user = {
      id:       req.session.userid,
      nickname: req.session.nickname,
      avatar:   req.session.avatar
    };
  }
  next();
}

utils.loadFlash = function(req, res, next) {
  if (req.session.flash) {
    res.locals = req.session.flash;
    // console.log(req.session.flash.errors.get('username'));
  }
  req.session.flash = {};
  
  next();
}

utils.auth = function(req, res, next) {
  var noAuthPathList = [
    '/',
    '/signin',
    '/signup',
    '/sessions/create',
    '/users/create'
  ];
  var needLoginPageList = [
    '/dashboard',
    '/signout',
    '/profile'
  ];
  var isLogined = req.session.login;
  if (noAuthPathList.indexOf(req.path) >= 0) {
    if (!isLogined || isLogined == "false") {
      next();
    } else {
      res.redirect('/dashboard');
    }
  } else {
    if (isLogined && isLogined == "true") {
      next();
    } else {
      if (needLoginPageList.indexOf(req.path) >= 0) {
        res.redirect('/signin');
      } else {
        res.status(500).json({
          error: '您还未登录'
        });
      }
    }
  }
}

utils.hash = function(value) {
  var sha2 = crypto.createHash('sha256');
  sha2.update(value || "");
  return sha2.digest('hex');
}

utils.parseError = function(e) {
  var errors = {};
  e = e.errors;
  for (var i = 0; i < e.length; i++) {
    if (errors[e[i].path] == null) {
      if (e[i].type == "unique violation") {
        errors[e[i].path] = t(e[i].path) + "已存在"
      } else {
        errors[e[i].path] = e[i].message;
      }
    }
  }
  
  return errors;
}

module.exports = utils;