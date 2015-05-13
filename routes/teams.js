var express = require('express');
var filters = require('./filters');
var models  = require('../models');
var utils   = require('./utils');

var router = express.Router();
var User   = models.User;
var Team   = models.Team;
var Project = models.Project;
var teamOwner = filters.teamOwner;
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
      res.status(500).json({
        result: "error",
        msg: e
      });
    });
});

router.post('/:id/update', teamOwner, function(req, res, next) {
  var
    params = req.body,
    userId = req.user.id,
    id = req.params.id;
  Team
    .find(id)
    .then(function(team) {
      return team.updateAttributes(params, 
        {fields: ['name', 'description']});
    })
    .then(function(team) {
      res.json(team);
    })
    .catch(function(e) {
      res.status(500).json({
        result: "error",
        msg: e
      });
    });
});

router.post('/:id/destroy', teamOwner, function(req, res, next) {
  var
    params = req.body,
    userId = req.user.id,
    id = req.params.id;
  Team
    .find(id)
    .then(function(team) {
      return team.destroy();
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

router.post('/:id/members/add', teamOwner, function(req, res, next) {
  var
    params = req.body,
    userId = req.user.id,
    id = req.params.id;
  Team
    .find(id)
    .then(function(team) {
      return team.addMember(params.userid);
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

router.post('/:id/members/remove', teamOwner, function(req, res, next) {
  var
    params = req.body,
    id = req.params.id;
  Team
    .find(id)
    .then(function(team) {
      User
        .find(params.userid)
        .then(function(user) {
          return team.removeMember(user)
        })
        .catch(function(e) {
          res.json({
            result: "error",
            msg: e
          });
        });
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
      res.status(500).json({
        result: "error",
        msg: e
      });
    });
});

router.get('/:id', teamMember, function(req, res, next) {
  var id = req.params.id;
  Team
    .find(id)
    .then(function(team) {
      res.json(team);
    })
    .catch(function(e) {
      res.status(500).json({
        result: "error",
        msg: e
      });
    })
});

router.get('/:id/projects', teamMember, function(req, res, next) {
  var id = req.params.id;
  var userId = req.session.userid;
  if (id == 0) {
    Project
      .findAll({where: {creator_id: userId, is_private: true}})
      .then(function(projs) {
        res.json(projs)
      })
      .catch(function(e) {
        res.status(500).json({
          result: "error",
          msg: e
        });
      });
  } else {
    Team
      .find(id)
      .then(function(team) {
        return team.getProjects();
      })
      .then(function(projs) {
        res.json(projs);
      })
      .catch(function(e) {
        res.status(500).json({
          result: "error",
          msg: e
        });
      });
  }
  
});

module.exports = router;