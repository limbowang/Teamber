"use strict";
var manager = require('../lib/validator-manager');

module.exports = function(sequelize, DataTypes) {
  var Taskboard = sequelize.define("Taskboard", {
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
      type: DataTypes.INTEGER
    },
    subproject_id: {
      allowNull: false,
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
        Taskboard.hasMany(models.Task, { foreignKey: 'taskboard_id' });
      }
    }
  });
  return Taskboard;
};