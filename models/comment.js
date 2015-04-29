"use strict";
module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define("Comment", {
    content: {
      type: DataTypes.STRING,
    },
    creator_id: {
      type: DataTypes.INTEGER,
    },
    task_id: {
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