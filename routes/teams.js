var express = require('express');
var filters = require('./filters');
var models  = require('../models');
var utils   = require('./utils');

var router = express.Router();
var User   = models.User;
var Team   = models.Team;
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
  Team
    .create({
      name: params.name,
      description: params.description,
      creator_id: userId
    })
    .then(function(team) {
      team.addMember(userId);
      res.json(team);
    })
    .catch(function(e) {
      res.json(getValidateError(e));
    });
});

router.post('/:id/update', function(req, res, next) {
});

router.post('/:id/destroy', function(req, res, next) {
});

router.get('/', function(req, res, next) {
  var userId = req.session.userid;
  User
    .find(userId)
    .then(function(user) {
      return user.getTeams();
    })
    .then(function(teams) {
      res.json(teams);
    })
    .catch(function(e) {
      res.json({
        error: 'error',
        msg: getValidateError(e)
      })
    })
});

router.get('/:id', function(req, res, next) {
  res.render('index', { title: 'User test' });
});

module.exports = router;