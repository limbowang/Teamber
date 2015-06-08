var express = require('express');
var filters = require('./filters');
var models  = require('../models');
var utils   = require('./utils');

var router = express.Router();
var User   = models.User;
var Task   = models.Task;
var Checkitem = models.Checkitem;
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
  Checkitem
    .create({
      content: params.content,
      task_id: params.taskid,
      creator_id: userId
    })
    .then(function(checkitem) {
      res.json(checkitem);
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
    id = req.params.id,
    userId = req.user.id;
  Checkitem
    .find(id)
    .then(function(checkitem) {
      if (params.isChecked == 'true') {
        params.check_at = models.sequelize.fn('NOW');
        params.checker_id = userId;
      } else if (params.isChecked == 'false'){
        params.check_at = null;
        params.checker_id = null;
      }
      return checkitem.updateAttributes(params, 
        {fields: ['content', 'check_at', 'checker_id']});
    })
    .then(function(checkitem) {
      res.json(checkitem);
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
  Checkitem
    .find(id)
    .then(function(checkitem) {
      return checkitem.destroy();
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
  Checkitem
    .find(id)
    .then(function(checkitem) {
      res.json(checkitem);
    })
    .catch(function(e) {
      res.status(500).json({
        result: "error",
        msg: e
      });
    })
});

module.exports = router;