"use strict";
module.exports = function(sequelize, DataTypes) {
  var Task = sequelize.define("Task", {
    name: {
      type: DataTypes.STRING,
    },
    creator_id: {
      type: DataTypes.INTEGER,
    },
    taskboard_id: {
      type: DataTypes.INTEGER,
    },
    ptask_id: {
      type: DataTypes.INTEGER,
    },
    due_time: {
      type: DataTypes.DATETIME,
    },
    complete_at: {
      type: DataTypes.DATETIME
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Task;
};