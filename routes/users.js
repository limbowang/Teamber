var express = require('express');
var router = express.Router();

router.param('id', function (req, res, next, id) {
  if (isNaN(id)) {
  	
  }
  next();
})

router.post('/create', function(req, res, next) {
});

router.post('/:id/update', function(req, res, next) {
});

router.post('/:id/destroy', function(req, res, next) {
});

router.get('/:id/edit', function(req, res, next) {
});

module.exports = router;
