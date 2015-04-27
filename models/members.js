"use strict";
module.exports = function(sequelize, DataTypes) {
  var Members = sequelize.define("Members", {
    team_id: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Members;
};