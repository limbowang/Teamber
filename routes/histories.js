var express = require('express');
var filters = require('./filters');
var models  = require('../models');
var utils   = require('./utils');

var router = express.Router();
var User   = models.User;
var Task   = models.Task;
var History = models.History;
var teamMember = filters.teamMember;
var getValidateError = utils.getValidateError;

router.param('id', function(req, res, next, id) {
  if (isNaN(id)) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  } else {
    next();
  }
});

router.post('/create', function(req, res, next) {

});

router.post('/:id/update', function(req, res, next) {

});

router.post('/:id/destroy', function(req, res, next) {

});

router.get('/', function(req, res, next) {

});

router.get('/:id', function(req, res, next) {

});

module.exports = router;