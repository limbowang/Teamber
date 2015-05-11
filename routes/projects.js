var express = require('express');
var filters = require('./filters');
var models  = require('../models');
var utils   = require('./utils');

var router = express.Router();
var User   = models.User;
var Team   = models.Team;
var Project = models.Project;
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

router.post('/create', teamMember, function(req, res, next) {
  var
    params = req.body,
    userId = req.user.id;
  Project
    .create({
      name: params.name,
      team_id: params.teamid,
      creator_id: userId,
      is_private: params.teamid == 0
    })
    .then(function(proj) {
      res.json({
        result: "success",
        data: proj
      });
    })
    .catch(function(e) {
      console.log(e);
      res.json({
        result: "error",
        msg: e
      });
    });
});

router.post('/:id/update', teamMember, function(req, res, next) {
  var
    params = req.body,
    id = req.params.id;
  Project
    .find(id)
    .then(function(proj) {
      return proj.updateAttributes(params, 
        {fields: ['name']});
    })
    .then(function(proj) {
      res.json({
        result: "success",
        data: proj
      });
    })
    .catch(function(e) {
      res.json({
        result: "error",
        msg: e
      });
    });
});

router.post('/:id/destroy', teamMember, function(req, res, next) {
  var
    id = req.params.id;
  Project
    .find(id)
    .then(function(proj) {
      return proj.destroy();
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

router.get('/:id', teamMember, function(req, res, next) {
  var id = req.params.id;
  Project
    .find(id)
    .then(function(proj) {
      res.json({
        result: "success",
        data: proj
      });
    })
    .catch(function(e) {
      res.json({
        result: "error",
        msg: e
      });
    })
});

router.get('/:id/subprojects', teamMember, function(req, res, next) {
  var id = req.params.id;
  Project
    .find(id)
    .then(function(proj) {
      return proj.getSubprojects();
    })
    .then(function(subprojs) {
      res.json({
        result: "success",
        data: subprojs
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