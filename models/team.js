"use strict";
var manager = require('../lib/validator-manager');

module.exports = function(sequelize, DataTypes) {
  var Team = sequelize.define("Team", {
    name: {
      type: DataTypes.STRING,
      validates: {
        notEmpty: manager.genNotEmpty("名字"),
        len: manager.genLen("名字", 6, 20)
      }
    },
    creator_id:{
      type: DataTypes.INTEGER
    },
    description: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Team;
};