var express = require('express');
var filters = require('./filters');
var models  = require('../models');
var utils   = require('./utils');

var router = express.Router();
var User   = models.User;
var Subproject = models.Subproject;
var Taskboard = models.Taskboard;
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
	var
    params = req.body,
    userId = req.user.id;
  Taskboard
    .create({
      name: params.name,
      subproject_id: params.subprojid,
      creator_id: userId
    })
    .then(function(taskboard) {
      res.json(taskboard);
    })
    .catch(function(e) {
      res.json({
        result: "error",
        msg: e
      });
    });
});

router.post('/:id/update', function(req, res, next) {
	var
    params = req.body,
    id = req.params.id;
  Taskboard
    .find(id)
    .then(function(taskboard) {
      return taskboard.updateAttributes(params, 
        {fields: ['name']});
    })
    .then(function(taskboard) {
      res.json(taskboard);
    })
    .catch(function(e) {
      res.json({
        result: "error",
        msg: e
      });
    });
});

router.post('/:id/destroy', function(req, res, next) {
	var
    id = req.params.id;
  Taskboard
    .find(id)
    .then(function(taskboard) {
      return taskboard.destroy();
    })
    .then(function(result) {
      res.json(result);
    })
    .catch(function(e) {
      res.json({
        result: "error",
        msg: e
      });
    });
});

router.get('/:id', function(req, res, next) {
	var id = req.params.id;
  Taskboard
    .find(id)
    .then(function(taskboard) {
      res.json(taskboard);
    })
    .catch(function(e) {
      res.json({
        result: "error",
        msg: e
      });
    })
});

router.get('/:id/tasks', function(req, res, next) {
  var id = req.params.id;
  Taskboard
    .find(id)
    .then(function(taskboard) {
    	return taskboard.getTasks();
    })
    .then(function(tasks) {
      res.json(tasks);
    })
    .catch(function(e) {
      res.json({
        result: "error",
        msg: e
      });
    })
});

module.exports = router;