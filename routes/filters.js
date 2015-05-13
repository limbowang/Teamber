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
    id = req.body.id || req.params.id;

  if (id == 0) {
    next();
    return ;
  }
  Team
    .find(id)
    .then(function(team) {
      if (!team) {
        res.status(500).json({
          result: "error",
          msg: "团队不存在"
        });
      } else if (team.creator_id == userId) {
        next();
      } else {
        res.json({
          result: "error",
          msg: "没有权限"
        });
      }
    })
    .catch(function(e) {
      res.status(500).json({
        result: "error",
        msg: e
      });
    });
}

filters.teamMember = function(req, res, next) {
  var
    userId = req.user.id,
    id = req.body.teamid === 0 || req.body.id || req.params.id;

  if (id == 0) {
    next();
    return ;
  }
  Team
    .find(id)
    .then(function(team) {
      if (!team) {
        res.status(500).json({
          result: "error",
          msg: "团队不存在"
        });
      } else if (team.hasMember(userId)) {
        next();
      } else {
        res.json({
          result: "error",
          msg: "没有权限"
        });
      }
    })
    .catch(function(e) {
      console.log(e);
      res.status(500).json({
        result: "error",
        msg: e
      });
    });
}

module.exports = filters;