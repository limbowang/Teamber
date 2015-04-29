"use strict";
module.exports = function(sequelize, DataTypes) {
  var Taskboard = sequelize.define("Taskboard", {
    name: {
      type: DataTypes.STRING,
    },
    creator_id: {
      type: DataTypes.INTEGER,
    },
    subproject_id: {
      type: DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate: function(models) {
        // User
        Taskboard.belongsTo(models.User, { foreignKey: 'creator_id' });
        // suboroject
        Taskboard.belongsTo(models.Subproject, { foreignKey: 'subproject_id' });
        // Task
        Taskboard.hasMany(models.Task, { foreignKey: 'task_id' });
      }
    }
  });
  return Taskboard;
};