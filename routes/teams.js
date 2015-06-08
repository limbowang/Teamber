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
  Team
  .create({
    name: params.name,
    description: params.description,
    creator_id: userId
  })
  .then(function(team) {
    team.addMember(userId);
    team.dataValues.is_owner = true;
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
    team.dataValues.is_owner = true;
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
    email = params.email,
    id = req.params.id;
  if (id == 0) {
      res.status(500).json({
        result: "error",
        msg: "无法添加成员"
      });
  } else {
    User
    .find({where: {email: email}, attributes: ['id', 'description', 'username', 'nickname', 'email', 'avatar']})
    .then(function(user) {
      if (user == null) {
        res.status(500).json({
          result: "error",
          msg: "没有该用户"
        });
      } else {
        Team
        .find(id)
        .then(function(team) {
          team
          .hasMember(user)
          .then(function(hasMember) {
            if (hasMember) {
              res.status(500).json({
                result: "error",
                msg: "用户已经在您的团队中"
              });
            } else {
              team
              .addMember(user)
              .then(function(result) {
                user.dataValues.team_id = team.id;
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
  }
});

router.post('/:id/members/remove', teamOwner, function(req, res, next) {
  var
    params = req.body,
    id = req.params.id,
    userId = req.session.userid;

  if (id == 0) {
      res.status(500).json({
        result: "error",
        msg: "无法删除成员"
      });
  } else {
    User
    .find({where: {email: params.email}})
    .then(function(user) {
      if (user == null) {
        res.status(500).json({
          result: "error",
          msg: "没有该用户"
        });
      } else {
        Team
        .find(id)
        .then(function(team) {
          if (team.creator_id == user.id) {
            res.status(500).json({
              result: "error",
              msg: "无法删除成员"
            });
          } else {
            team
            .hasMember(user)
            .then(function(hasMember) {
              if (!hasMember) {
                res.status(500).json({
                  result: "error",
                  msg: "用户不在您的团队"
                });
              } else {
                team
                .removeMember(user)
                .then(function(result) {
                  res.json({});
                });
              }
            })
          }
        })
      }
    })
    .catch(function(e) {
      res.status(500).json({
        result: "error",
        msg: e
      });
    });
  }
});

router.get('/', function(req, res, next) {
  var userId = req.session.userid;
  User
    .find(userId)
    .then(function(user) {
      return user.getTeams();
    })
    .then(function(teams) {
      for(var key in teams) {
        if (teams[key].creator_id == userId) {
          teams[key].dataValues.is_owner = true;
        } else {
          teams[key].dataValues.is_owner = false;
        }
      }
      res.json(teams);
    })
    .catch(function(e) {
      console.log(e);
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
        for(var key in projs) {
          if (projs[key].team_id == null) {
            projs[key].dataValues.team_id = 0;
          }
        }
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

router.get('/:id/members', teamMember, function(req, res, next) {
  var id = req.params.id;
  var userId = req.session.userid;
  var curTeam = null;
  if (id == 0) {
    User
    .find(userId)
    .then(function(member) {
      member.dataValues.is_owner = true;
      member.dataValues.team_id = id;
      res.json([member]);
    })
    .catch(function(e) {
      console.log(e);
      res.status(500).json({
        result: "error",
        msg: e
      });
    })
  } else {
    Team
    .find(id)
    .then(function(team) {
      curTeam = team;
      return team.getMembers(
        {attributes: ['id', 'username', 'description', 'nickname', 'email', 'avatar']});
    })
    .then(function(members) {
      for(var key in members) {
        if (curTeam.creator_id == members[key].id) {
          members[key].dataValues.is_owner = true;
        } else {
          members[key].dataValues.is_owner = false;
        }
        members[key].dataValues.team_id = id;
      }
      res.json(members);
    })
    .catch(function(e) {
      console.log(e);
      res.status(500).json({
        result: "error",
        msg: e
      });
    })
  }
});

router.get('/:id/members/:nickname', teamMember, function(req, res, next) {
  var id = req.params.id != 0? req.params.id : null;
  var nickname = req.params.nickname;
  var curTeam = null;
  var curUser = null;
  User
  .find({
    where: {nickname: nickname},
    attributes: ['id', 'username', 'description', 'nickname', 'email', 'avatar']
  })
  .then(function(user) {
    curUser = user;
    if (!user) {
      res.status(500).json({
        result: "error",
        msg: "用户不在您的团队"
      });
    } else {
      return user.getAssignedTasks({
        attributes: ['complete_at', 'due_time', 'createdAt'],
        include: [{
          model: Project,
          attributes: ['team_id'],
          where: {
            team_id: id
          }
        }]
      });
    }
  })
  .then(function(tasks) {
    var user = curUser.get({plain: true});
    var dateToday = new Date();
    var dateWeekAgo = new Date(dateToday);
    dateWeekAgo.setDate(dateWeekAgo.getDate() - 7);
    user.assigns = {};
    user.completes = {};
    user.counts = {};
    user.counts.assigns = 0;
    user.counts.completes = 0;
    user.counts.incompletes = 0;
    user.counts.overdue = 0;

    for (var key in tasks) {
      var dateCreated = new Date(tasks[key]['createdAt']);
      var dateAssigned = new Date(tasks[key]['assignments']['updatedAt']);
      var dateComplete = tasks[key].complete_at? new Date(tasks[key].complete_at) : null;
      var dateDue = tasks[key].due_time? new Date(tasks[key].due_time) : null;
      if (user.assigns[dateAssigned]) {
        user.assigns[dateAssigned]++;
      } else {
        user.assigns[dateAssigned] = 1;
      }
      if (dateComplete) {
        if (user.completes[dateComplete]) {
          user.completes[dateComplete]++;
        } else {
          user.completes[dateComplete] = 1;
        }
      }
      // get count
      if (dateCreated > dateWeekAgo && dateCreated < dateToday) {
        user.counts.assigns++;
        if (dateComplete) {
          user.counts.completes++;
        } else {
          user.counts.incompletes++;
        }
        if (dateDue < dateToday) {
          user.counts.overdue++;
        }
      }
    }
    // user.tasks = tasks.get({plain: true});
    res.json(user);
  })
  .catch(function(e) {
    console.log(e);
    res.status(500).json({
      result: "error",
      msg: e
    });
  });
});

module.exports = router;