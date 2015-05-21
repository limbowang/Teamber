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
      team_id: params.teamid != 0? params.teamid : null,
      creator_id: userId,
      is_private: params.teamid == 0
    })
    .then(function(proj) {
      proj.addContributor(userId);
      if (proj.team_id == null) {
        proj.dataValues.team_id = 0;
      }
      res.json(proj);
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
  Project
    .find(id)
    .then(function(proj) {
      return proj.updateAttributes(params, 
        {fields: ['name']});
    })
    .then(function(proj) {
      if (proj.team_id == null) {
        proj.dataValues.team_id = 0;
      }
      res.json(proj);
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
  Project
    .find(id)
    .then(function(proj) {
      return proj.destroy();
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

router.post('/:id/contributors/add', function(req, res, next) {
  var
    params = req.body,
    email = params.email,
    id = req.params.id;
  User
  .find({where: {email: email}, attributes: ['id', 'username', 'nickname', 'email', 'avatar']})
  .then(function(user) {
    if (user == null) {
      res.status(500).json({
        result: "error",
        msg: "没有该用户"
      });
    } else {
      Project
      .find(id)
      .then(function(proj) {
        proj
        .hasContributor(user)
        .then(function(hasContributor) {
          if (hasContributor) {
            res.status(500).json({
              result: "error",
              msg: "用户已经在您的项目中"
            });
          } else {
            proj
            .addContributor(user)
            .then(function(result) {
              user.dataValues.proj_id = proj.id;
              res.json(user);
            });
          }
        })
      })
    }
  })
  .catch(function(e) {
    res.status(500).json({
      result: "error",
      msg: e
    });
  });
});

router.post('/:id/contributors/remove', function(req, res, next) {
  var
    params = req.body,
    id = req.params.id,
    userId = req.session.userid;

  User
  .find({where: {email: params.email}})
  .then(function(user) {
    if (user == null) {
      res.status(500).json({
        result: "error",
        msg: "没有该用户"
      });
    } else {
      Project
      .find(id)
      .then(function(proj) {
        proj
        .hasContributor(user)
        .then(function(hasContributor) {
          if (!hasContributor) {
            res.status(500).json({
              result: "error",
              msg: "用户不在您的项目"
            });
          } else {
            proj
            .removeContributor(user)
            .then(function(result) {
              res.json({});
            });
          }
        })
      })
    }
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
  Project
    .find(id)
    .then(function(proj) {
      if (proj.team_id == null) {
        proj.dataValues.team_id = 0;
      }
      res.json(proj);
    })
    .catch(function(e) {
      res.status(500).json({
        result: "error",
        msg: e
      });
    })
});

router.get('/:id/subprojects', function(req, res, next) {
  var id = req.params.id;
  Project
    .find(id)
    .then(function(proj) {
      return proj.getSubprojects();
    })
    .then(function(subprojs) {
      res.json(subprojs);
    })
    .catch(function(e) {
      res.status(500).json({
        result: "error",
        msg: e
      });
    })
});

router.get('/:id/contributors', function(req, res, next) {
  var id = req.params.id;
  var userId = req.session.userid;
  var curProj = null;
  
  Project
  .find(id)
  .then(function(proj) {
    curProj = proj;
    return proj.getContributors(
      {attributes: ['id', 'username', 'nickname', 'email', 'avatar']});
  })
  .then(function(contributors) {
    for(var key in contributors) {
      if (curProj.creator_id == contributors[key].id) {
        contributors[key].dataValues.is_owner = true;
      } else {
        contributors[key].dataValues.is_owner = false;
      }
      contributors[key].dataValues.proj_id = id;
    }
    res.json(contributors);
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