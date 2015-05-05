var express = require('express');
var filters = require('./filters');
var models  = require('../models');
var utils   = require('./utils');

var router = express.Router();
var User   = models.User;
var Task   = models.Task;
var Comment = models.Comment;
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
  Comment
    .create({
      content: params.name,
      task_id: params.taskid,
      creator_id: userId
    })
    .then(function(comment) {
      res.json({
        result: "success",
        data: comment
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
  Comment
    .find(id)
    .then(function(comment) {
      return comment.updateAttributes(params, 
        {fields: ['content']});
    })
    .then(function(comment) {
      res.json({
        result: "success",
        data: comment
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
  Comment
    .find(id)
    .then(function(comment) {
      return comment.destroy();
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
  Comment
    .find(id)
    .then(function(comment) {
      res.json({
        result: "success",
        data: comment
      });
    })
    .catch(function(e) {
      res.json({
        result: "error",
        msg: e
      });
    });
});

module.exports = router;