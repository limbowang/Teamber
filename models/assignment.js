"use strict";
module.exports = function(sequelize, DataTypes) {
  var Assignment = sequelize.define("Assignment", {
    task_id: {
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
  return Assignment;
};