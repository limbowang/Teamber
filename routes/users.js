var express = require('express');
var filters = require('./filters');
var models  = require('../models');
var utils   = require('./utils');

var router = express.Router();
var User   = models.User;
var Team = models.Team;
var Project = models.Project;
var getValidateError = utils.getValidateError;

router.post('/create', function(req, res, next) {
  var params = req.body;
  User
  .create({
    username: params.username,
    password: params.password,
    password_confirm: params.password_confirm,
    email:    params.email,
    nickname: params.nickname
  })
  .then(function(user) {
    req.session.login    = "true";
    req.session.userid       = user.id;
    req.session.nickname = user.nickname;
    req.session.avatar   = user.avatar;
    res.redirect('/dashboard');
  })
  .catch(function(e, user) {
    req.session.flash.errors = getValidateError(e);
    req.session.flash.old = params;
    res.redirect('/signup');
  });
});

router.post('/:username/update', function(req, res, next) {
});

router.post('/:username/destroy', function(req, res, next) {
});

router.get('/:username', function(req, res, next) {
  res.render('index', { title: 'User test' });
});

router.get('/own/calendar', function(req, res, next) {
  var userId = req.user.id;
  User
  .find(userId)
  .then(function(user) {
    return user.getAssignedTasks({
      where: {
        due_time: {$ne: null}
      }
    })
  })
  .then(function(tasks) {
    var result = [];
    for (var key in tasks) {
      var item = {};
      item.id = tasks[key].id;
      item.title = tasks[key].name;
      // item.start = new Date(tasks[key].createdAt).getTime();
      item.start = item.end = new Date(tasks[key].due_time).getTime();
      item['class'] = "event-warning";
      console.log(item);
      result.push(item);
    }
    res.json({
      success: 1,
      result: result
      // result: [{
      //   "id": "293", 
      //   "title": "This is warning class event with very long title to check how it fits to evet in day view", 
      //   "url": "http://www.example.com/", 
      //   "class": "event-warning", 
      //   "start": "1362938400000", 
      //   "end": "1363197686300"
      // }]
    });
  })
  .catch(function(e) {
    console.log(e);
    res.status(500).json({
      result: "error",
      msg: e
    });
  });
});

router.get('/own/tasks', function(req, res, next) {
  var params = req.query;
  var type = params.type;
  var userId = req.user.id;
  var query = {
    include: [{
      model: Project,
      attributes: ['team_id']
    }]
  }
  if (type == 'complete') {
    query.where = { complete_at: {$ne: null} };
  } else if (type == 'overdue') {
    query.where = { due_time: {$lt: new Date()}}
  } else if (type == "incomplete") {
    query.where = { complete_at: null }
  }
  User
  .find(userId)
  .then(function(user) {
    return user.getAssignedTasks(query)
  })
  .then(function(tasks) {
    for(var key in tasks) {
      var team_id = tasks[key].Project.team_id || 0;
      tasks[key].dataValues.Project = undefined;
      tasks[key].dataValues.team_id = team_id;
    }
    res.json(tasks);
  })
  .catch(function(e) {
    console.log(e);
    res.status(500).json({
      result: "error",
      msg: e
    });
  });
})

module.exports = router;