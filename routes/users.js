var express = require('express');
var router = express.Router();

router.param('id', function (req, res, next, id) {
  if (isNaN(id)) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  } else {
  	next();
  }
})

router.post('/create', function(req, res, next) {
});

router.post('/:id/update', function(req, res, next) {
});

router.post('/:id/destroy', function(req, res, next) {
});

router.get('/:id', function(req, res, next) {
  res.render('index', { title: 'User test' });
});


module.exports = router;
