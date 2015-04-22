var utils = {};

utils.loadUser = function(req, res, next) {
	var isLogined = req.session? req.session.login : "";
	if (!req.user && isLogined && isLogined == "true") {
		// load user
		res.locals.user = req.user = {
			nickname: 'testname'
		};
	}
	next();
}

module.exports = utils;