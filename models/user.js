"use strict";

var utils   = require('../routes/utils');
var manager = require('../lib/validator-manager');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {args: true, msg: "用户名已使用"},
      validate: {
        len: manager.genLen("用户名", 6, 20)
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: manager.genLen("密码", 6, 20)
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: manager.genBool("邮箱", true)
      }
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
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
        this
          .find({where: { username: username }})
          .then(function(user) {
            res = user && user.password == utils.hash(password)? user : false;
          })
          .catch(function(e) {
            console.log(e);
          })
          .finally(function() {
            callback(res);
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