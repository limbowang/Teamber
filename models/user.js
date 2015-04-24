"use strict";

var utils = require('../routes/utils');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [6, 20]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 20]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [6, 10]
      }
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        len: [0, 255]
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
      check: function(username, password) {
        return 
          this
            .find({where: { username: username }})
            .then(function(user) {
              return user && user.password == utils.hash(password)? user : false;
            });
      }
    },
    hooks: {
      beforeCreate: function(user, options, fn) {
        user.password = utils.hash(user.password);
      }
    }
  });
  return User;
};