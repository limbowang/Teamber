"use strict";
var manager = require('../lib/validator-manager');

module.exports = function(sequelize, DataTypes) {
  var Checkitem = sequelize.define("Checkitem", {
    content: {
      allowNull: false,
      type: DataTypes.STRING,
      validates: {
        len: manager.genLen("详细描述", 0, 255)
      }
    },
    creator_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    check_at: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    checker_id: {
      type: DataTypes.INTEGER
    },
    task_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate: function(models) {
        // User
        Checkitem.belongsTo(models.User, { foreignKey: 'creator_id' });
        Checkitem.belongsTo(models.User, { foreignKey: 'checker_id' });
        // Task
        Checkitem.belongsTo(models.Task, { foreignKey: 'task_id' });
      }
    }
  });
  return Checkitem;
};