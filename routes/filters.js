var filters = {};

filters.isNotAuth = function(req, res, next) {
	var isLogined = req.session.login;
	if (!isLogined || isLogined == "false") {
		next();
	} else {
		res.redirect('/dashboard');
	}
}

filters.isAdmin = function(req, res, next) {
	var isAdmin = req.session.admin;
	if (isAdmin && isAdmin == "true") {
		next();
	} else {
		res.redirect('/');
	}
}

module.exports = filters;