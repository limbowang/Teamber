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
      type: DataTypes.DATE,
    },
    complete_at: {
      type: DataTypes.DATE
    }
  }, {
    classMethods: {
      associate: function(models) {
        // User
        Task.belongsTo(models.User, { foreignKey: 'creator_id' });
        Task.belongsToMany(models.User, { through: 'assignments', foreignKey: 'task_id' });
        // Taskboard
        Task.belongsTo(models.Taskboard, { foreignKey: 'taskboard_id' });
        // Task itself
        Task.belongsTo(models.Task, { foreignKey: 'ptask_id' });
        // Comment
        Task.hasMany(models.Comment, { foreignKey: 'task_id' });
        // Checkitem
        Task.hasMany(models.Checkitem, { foreignKey: 'task_id' });
        // History
        Task.hasMany(models.History, { foreignKey: 'task_id' });
      }
    }
  });
  return Task;
};