var crypto = require('crypto');

var utils = {};

utils.loadUser = function(req, res, next) {
	var isLogined = req.session? req.session.login : "";
	if (!req.user && isLogined && isLogined == "true") {
		// load user
		res.locals.user = req.user = {
			nickname: req.session.nickname,
			avatar:   req.session.avatar
		};
	}
	next();
}

utils.hash = function(value) {
  var sha2 = crypto.createHash('sha256');
  sha2.update(value || "");
  return sha2.digest('hex');
}

module.exports = utils;