var express = require('express');
var router = express.Router();

// login
router.post('/create', function(req, res, next) {
	res.redirect('../dashboard');
});

// logout
router.post('/destroy', function(req, res, next) {
	res.redirect('../login');
});

module.exports = router;
