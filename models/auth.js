"use strict";
module.exports = function(sequelize, DataTypes) {
  var Auth = sequelize.define("Auth", {
    user_id: {
      type: DataTypes.INTEGER,
    },
    team_id: {
      type: DataTypes.INTEGER
    },
    value: {
      type: DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Auth;
};