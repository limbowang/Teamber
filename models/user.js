"use strict";

var util = require('crypto');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validates: {
        len: [6, 20]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set: function(val) {
        this.setDataValue('password', this.encrypt(val));
      }
      validates: {
        len: [6, 20]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validates: {
        isEmail: true
      }
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validates: {
        len: [6, 10]
      }
    },
    description: {
      type: DataTypes.STRING,
      validates: {
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
              return user && user.password == this.encrypt(password);
            });
      },
      encrypt: function(value) {
        var sha2 = crypto.createHash('sha256');
        sha2.update(value);
        return sha2.digest('hex');
      }
    }
  });
  return User;
};