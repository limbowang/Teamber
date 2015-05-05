var express = require('express');
var filters = require('./filters');
var models  = require('../models');
var utils   = require('./utils');

var router = express.Router();
var User   = models.User;
var Team   = models.Team;
var Project = models.Project;
var Subproject = models.Subproject;
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
  Subproject
    .create({
      name: params.name,
      team_id: params.projid,
      creator_id: userId
    })
    .then(function(subproj) {
      res.json({
        result: "success",
        data: subproj
      });
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
  Subroject
    .find(id)
    .then(function(subproj) {
      return subproj.updateAttributes(params, 
        {fields: ['name']});
    })
    .then(function(subproj) {
      res.json({
        result: "success",
        data: subproj
      });
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
  Subroject
    .find(id)
    .then(function(subproj) {
      return subproj.destroy();
    })
    .then(function(result) {
      res.json({
        result: "success",
        data: result
      });
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
  Subroject
    .find(id)
    .then(function(subproj) {
      res.json({
        result: "success",
        data: subproj
      });
    })
    .catch(function(e) {
      res.json({
        result: "error",
        msg: e
      });
    })
});

router.get('/:id/taskboards', function(req, res, next) {
  var id = req.params.id;
  Subroject
    .find(id)
    .then(function(subproj) {
    	return subproj.getTaskborads();
    })
    .then(function(taskboards) {
      res.json({
        result: "success",
        data: taskboards
      });
    })
    .catch(function(e) {
      res.json({
        result: "error",
        msg: e
      });
    })
});

module.exports = router;