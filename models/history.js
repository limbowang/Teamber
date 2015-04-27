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
        // associations can be defined here
      }
    }
  });
  return History;
};