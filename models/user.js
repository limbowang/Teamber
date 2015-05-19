var utils   = require('../routes/utils');
var manager = require('../lib/validator-manager');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: manager.genNotEmpty("用户名"),
        len: manager.genLen("用户名", 6, 20)
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: manager.genNotEmpty("密码"),
        len: manager.genLen("密码", 6, 20)
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: manager.genNotEmpty("邮箱"),
        isEmail: manager.genBool("邮箱", true)
      }
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: manager.genNotEmpty("昵称"),
        len: manager.genLen("昵称", 6, 10)
      }
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        len: manager.genLen("个人描述", 0, 255)
      }
    },
    avatar: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        // Team
        User.hasMany(models.Team, { foreignKey: 'creator_id', as: 'OwnTeam'});
        User.belongsToMany(models.Team, { through: 'members', foreignKey: 'user_id', as: 'Teams'});
        // Project
        User.hasMany(models.Project, { foreignKey: 'creator_id' });
        // Subproject
        User.hasMany(models.Subproject, { foreignKey: 'creator_id' });
        // Taskboard
        User.hasMany(models.Taskboard, { foreignKey: 'creator_id' });
        // Task
        User.hasMany(models.Task, { foreignKey: 'creator_id' });
        User.belongsToMany(models.Task, { through: 'assignments', foreignKey: 'user_id', as: 'AssignedTask' });
        // Comment
        User.hasMany(models.Comment, { foreignKey: 'creator_id' });
        // Checkitem
        User.hasMany(models.Checkitem, { foreignKey: 'creator_id' });
      },
      check: function(username, password, callback) {
        var res = false;
        var error = null;

        if (!username) {
          error = {
            username: "用户名不能为空"
          }
          callback(res, error);
          return ;
        }

        if (!password) {
          error = {
            password: "密码不能为空"
          }
          callback(res, error);
          return ;
        }

        this
          .find({where: { username: username }})
          .then(function(user) {
            if (user) {
              if (user.password == utils.hash(password)) {
                res = user;
              } else {
                error = {
                  password: "密码不正确"
                }
              }
            } else {
              error = {
                username: "用户不存在"
              }
            }
          })
          .catch(function(e) {
            console.log(e);
          })
          .finally(function() {
            callback(res, error);
          });
      }
    },
    hooks: {
      beforeCreate: function(user, options, fn) {
        user.password = utils.hash(user.password);
        fn();
      }
    }
  });
  return User;
};