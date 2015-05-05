"use strict";
var manager = require('../lib/validator-manager');

module.exports = function(sequelize, DataTypes) {
  var History = sequelize.define("History", {
    content: {
      allowNull: false,
      type: DataTypes.STRING
    },
    task_id: {
      allowNull: false,
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