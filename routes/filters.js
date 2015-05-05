var models  = require('../models');
var Team   = models.Team;

var filters = {};

filters.isNotAuth = function(req, res, next) {
  var isLogined = req.session.login;
  if (!isLogined || isLogined == "false") {
    next();
  } else {
    res.redirect('/dashboard');
  }
}

filters.isAdmin = function(req, res, next) {
  var isAdmin = req.session.admin;
  if (isAdmin && isAdmin == "true") {
    next();
  } else {
    res.redirect('/');
  }
}

filters.teamOwner = function(req, res, next) {
  var
    userId = req.user.id,
    id = req.path.indexOf('/teams') > 0 ? 
          req.params.id:
          req.params.teamid;
  
  Team
    .find(id)
    .then(function(team) {
      if (team.creator_id == userId) {
        next();
      } else {
        res.json({
          result: "error",
          msg: "没有权限"
        });
      }
    })
    .catch(function(e) {
      res.json({
        result: "error",
        msg: e
      });
    });
}

filters.teamMember = function(req, res, next) {
  var
    userId = req.user.id,
    id = req.path.indexOf('/teams') > 0 ? 
          req.params.id:
          req.params.teamid;
  
  Team
    .find(id)
    .then(function(team) {
      if (team.hasMember(userId)) {
        next();
      } else {
        res.json({
          result: "error",
          msg: "没有权限"
        });
      }
    })
    .catch(function(e) {
      res.json({
        result: "error",
        msg: e
      });
    });
}

module.exports = filters;