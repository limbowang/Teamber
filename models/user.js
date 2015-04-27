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
        // associations can be defined here
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