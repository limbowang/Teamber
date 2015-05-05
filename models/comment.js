"use strict";
var manager = require('../lib/validator-manager');

module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define("Comment", {
    content: {
      allowNull: false,
      type: DataTypes.STRING,
      validates: {
        notEmpty: manager.genNotEmpty("内容"),
        len: manager.genLen("内容", 1, 255)
      }
    },
    creator_id: {
      allowNull: false,
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
        Comment.belongsTo(models.User, { foreignKey: 'creator_id' });
        // Task
        Comment.belongsTo(models.Task, { foreignKey: 'task_id' });
      }
    }
  });
  return Comment;
};