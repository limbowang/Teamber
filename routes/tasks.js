var express = require('express');
var filters = require('./filters');
var models  = require('../models');
var utils   = require('./utils');

var router = express.Router();
var User = models.User;
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
  if (params.taskboardid === undefined && params.ptaskid === undefined) {
    res.status(500).json({
      result: "error",
      msg: "参数缺乏"
    })
  }
  Task
    .create({
      name: params.name,
      taskboard_id: params.taskboardid,
      creator_id: userId,
      ptask_id: params.ptaskid
    })
    .then(function(task) {
      res.json(task);
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
  Task
    .find(id)
    .then(function(task) {
      return task.updateAttributes(params, 
        {fields: ['name', 'due_time', 'taskboard_id']});
    })
    .then(function(taskboard) {
      res.json(taskboard);
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
  Task
    .find(id)
    .then(function(task) {
      return task.destroy();
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
      res.json(result);
    })
    .catch(function(e) {
      res.status(500).json({
        result: "error",
        msg: e
      });
    });
});

router.post('/:id/assign', function(req, res, next) {
  var
    id = req.params.id,
    email = req.body.email;
  User
  .find({where: {email: email}, attributes: ['id', 'username', 'nickname', 'email', 'avatar']})
  .then(function(user) {
    if (user == null) {
      res.status(500).json({
        result: "error",
        msg: "没有该用户"
      });
    } else {
      Task
      .find(id)
      .then(function(task) {
        task
        .hasAssignment(user)
        .then(function(hasAssign) {
          if (hasAssign) {
            res.status(500).json({
              result: "error",
              msg: "用户已经被分配"
            });
          } else {
            task
            .addAssignment(user)
            .then(function(result) {
              user.dataValues.task_id = task.id;
              user.dataValues.id = undefined;
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

router.post('/:id/dismiss', function(req, res, next) {
  var
    id = req.params.id,
    email = req.body.email;
  User
  .find({where: {email: email}, attributes: ['id', 'username', 'nickname', 'email', 'avatar']})
  .then(function(user) {
    if (user == null) {
      res.status(500).json({
        result: "error",
        msg: "没有该用户"
      });
    } else {
      Task
      .find(id)
      .then(function(task) {
        task
        .hasAssignment(user)
        .then(function(hasAssign) {
          if (!hasAssign) {
            res.status(500).json({
              result: "error",
              msg: "无法解散成员"
            });
          } else {
            task
            .removeAssignment(user)
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
  Task
    .find(id)
    .then(function(task) {
      res.json(task);
    })
    .catch(function(e) {
      res.status(500).json({
        result: "error",
        msg: e
      });
    })
});

router.get('/:id/subtasks', function(req, res, next) {
	var id = req.params.id;
  Task
    .findAll({ where: { ptask_id: id } })
    .then(function(subtasks) {
      res.json(subtasks);
    })
    .catch(function(e) {
      res.status(500).json({
        result: "error",
        msg: e
      });
    })
});

router.get('/:id/comments', function(req, res, next) {
	var id = req.params.id;
  var userId = req.user.id;
  Task
    .find(id)
    .then(function(task) {
    	return task.getComments();
    })
    .then(function(comments) {
      for(var key in comments) {
        if (comments[key].creator_id == userId) {
          comments[key].dataValues.is_own = true;
        } else {
          comments[key].dataValues.is_own = false;
        }
      }
      res.json(comments);
    })
    .catch(function(e) {
      res.status(500).json({
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
      res.json(checkitems);
    })
    .catch(function(e) {
      res.status(500).json({
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
      res.json(histories);
    })
    .catch(function(e) {
      res.status(500).json({
        result: "error",
        msg: e
      });
    })
});

router.get('/:id/assignments', function(req, res, next) {
  var id = req.params.id;
  var userId = req.session.userid;
  var curTask = null;
  if (id != 0) {
    Task
      .find(id)
      .then(function(task) {
        return task.getAssignments(
          {attributes: ['id', 'username', 'nickname', 'email', 'avatar']});
      })
      .then(function(tasks) {
        for(var key in tasks) {
          members[key].dataValues.id = undefined;
          members[key].dataValues.task_id = curTask.id;
        }
        res.json(tasks);
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

router.get('/:id/unassignments', teamMember, function(req, res, next) {
  var id = req.params.id;
  var userId = req.session.userid;
  var curTask = null;
  if (id != 0) {
    Task
      .find(id)
      .then(function(task) {
        return task.getAssignments(
          {attributes: ['id', 'username', 'nickname', 'email', 'avatar']});
      })
      .then(function(tasks) {
        for(var key in tasks) {
          members[key].dataValues.id = undefined;
          members[key].dataValues.task_id = curTask.id;
        }
        res.json(tasks);
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

module.exports = router;