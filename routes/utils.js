var crypto = require('crypto');
var t = require('../lib/translation');

var utils = {};

utils.loadUser = function(req, res, next) {
  var isLogined = req.session? req.session.login : "";
  if (!req.user && isLogined && isLogined == "true") {
    // load user
    res.locals.user = req.user = {
      id:       req.session.id,
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

utils.hash = function(value) {
  var sha2 = crypto.createHash('sha256');
  sha2.update(value || "");
  return sha2.digest('hex');
}

utils.getValidateError = function(e) {
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