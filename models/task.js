"use strict";
var manager = require('../lib/validator-manager');

module.exports = function(sequelize, DataTypes) {
  var Task = sequelize.define("Task", {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validates: {
        notEmpty: manager.genNotEmpty("名称"),
        len: manager.genLen("名称", 6, 20)
      }
    },
    creator_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    project_id: {
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
        Task.belongsToMany(models.User, { through: 'assignments', foreignKey: 'task_id', as: 'Assignments' });
        // Project
        Task.belongsTo(models.Project, { foreignKey: 'project_id' });
        // Taskboard
        Task.belongsTo(models.Taskboard, { foreignKey: 'taskboard_id' });
        // Task itself
        Task.belongsTo(models.Task, { foreignKey: 'ptask_id', as: 'Subtask' });
        // Comment
        Task.hasMany(models.Comment, { foreignKey: 'task_id' });
        // Checkitem
        Task.hasMany(models.Checkitem, { foreignKey: 'task_id' });
        // History
        Task.hasMany(models.History, { foreignKey: 'task_id' });
      }
    },
    instanceMethods: {
      complete: function() {
        return this.updateAttributes({complete_at: sequelize.fn('NOW')});
      }
    }
  });
  return Task;
};