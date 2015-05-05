var express = require('express');
var filters = require('./filters');
var models  = require('../models');
var utils   = require('./utils');

var router = express.Router();
var Taskboard = models.Taskboard;
var Task   = models.Task;
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
  Task
    .create({
      name: params.name,
      taskboard_id: params.taskboardid,
      creator_id: userId
    })
    .then(function(task) {
      res.json({
        result: "success",
        data: task
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
  Task
    .find(id)
    .then(function(task) {
      return task.updateAttributes(params, 
        {fields: ['name', 'due_time', 'taskboard_id']});
    })
    .then(function(taskboard) {
      res.json({
        result: "success",
        data: taskboard
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
  Task
    .find(id)
    .then(function(task) {
      return task.destroy();
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

router.post('/:id/complete', function(req, res, next) {
	var
    id = req.params.id,
    userId = req.user.id;
  Task
    .find(id)
    .then(function(task) {
      return task.complete();
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
  Task
    .find(id)
    .then(function(task) {
      res.json({
        result: "success",
        data: task
      });
    })
    .catch(function(e) {
      res.json({
        result: "error",
        msg: e
      });
    })
});

router.get('/:id/subtasks', function(req, res, next) {
	var id = req.params.id;
  Task
    .find({ where: { ptask_id: id } })
    .then(function(subtasks) {
      res.json({
        result: "success",
        data: subtasks
      });
    })
    .catch(function(e) {
      res.json({
        result: "error",
        msg: e
      });
    })
});

router.get('/:id/comments', function(req, res, next) {
	var id = req.params.id;
  Task
    .find(id)
    .then(function(task) {
    	return task.getComments();
    })
    .then(function(comments) {
      res.json({
        result: "success",
        data: comments
      });
    })
    .catch(function(e) {
      res.json({
        result: "error",
        msg: e
      });
    })
});

router.get('/:id/checkitems', function(req, res, next) {
	var id = req.params.id;
  Task
    .find(id)
    .then(function(task) {
    	return task.getCheckitems();
    })
    .then(function(checkitems) {
      res.json({
        result: "success",
        data: checkitems
      });
    })
    .catch(function(e) {
      res.json({
        result: "error",
        msg: e
      });
    })
});

router.get('/:id/histories', function(req, res, next) {
	var id = req.params.id;
  Task
    .find(id)
    .then(function(task) {
    	return task.getHistories();
    })
    .then(function(histories) {
      res.json({
        result: "success",
        data: histories
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