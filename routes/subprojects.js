var express = require('express');
var filters = require('./filters');
var models  = require('../models');
var utils   = require('./utils');

var router = express.Router();
var User   = models.User;
var Team   = models.Team;
var Project = models.Project;
var Subproject = models.Subproject;
var Taskboard = models.Taskboard;
var Task = models.Task;
var teamMember = filters.teamMember;
var parseError = utils.parseError;

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
      project_id: params.projid,
      creator_id: userId
    })
    .then(function(subproj) {
      res.json(subproj);
    })
    .catch(function(e) {
      res.status(500).json({
        result: "error",
        msg: e
      });
    });
});

router.post('/:id/update', function(req, res, next) {
	var
    params = req.body,
    id = req.params.id;
  Subproject
    .find(id)
    .then(function(subproj) {
      return subproj.updateAttributes(params, 
        {fields: ['name']});
    })
    .then(function(subproj) {
      res.json(subproj);
    })
    .catch(function(e) {
      res.status(500).json({
        result: "error",
        msg: e
      });
    });
});

router.post('/:id/destroy', function(req, res, next) {
	var
    id = req.params.id;
  Subproject
    .find(id)
    .then(function(subproj) {
      return subproj.destroy();
    })
    .then(function(result) {
      res.json(result);
    })
    .catch(function(e) {
      res.status(500).json({
        result: "error",
        msg: e
      });
    });
});

router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  Subproject
    .find(id)
    .then(function(subproj) {
      res.json(subproj);
    })
    .catch(function(e) {
      res.status(500).json({
        result: "error",
        msg: e
      });
    })
});

router.get('/:id/taskboards', function(req, res, next) {
  var id = req.params.id;
  Subproject
  .find(id)
  .then(function(subproj) {
  	return subproj.getTaskboards({
      include:[{
        model: Task, 
        where: {ptask_id: null},
        required: false
      }]
    });
  })
  .then(function(taskboards) {
    res.json(taskboards);
  })
  .catch(function(e) {
    console.log(e);
    res.status(500).json({
      result: "error",
      msg: e
    });
  })
});

module.exports = router;