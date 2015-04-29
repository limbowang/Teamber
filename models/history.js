"use strict";
module.exports = function(sequelize, DataTypes) {
  var History = sequelize.define("History", {
    content: {
      type: DataTypes.STRING,
    },
    task_id: {
      type: DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate: function(models) {
        // Task
        History.belongsTo(models.Task, { foreignKey: 'task_id' });
      }
    }
  });
  return History;
};