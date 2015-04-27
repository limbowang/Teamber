"use strict";
module.exports = function(sequelize, DataTypes) {
  var Taskboard = sequelize.define("Taskboard", {
    name: {
      type: DataTypes.STRING,
    },
    creator_id: {
      type: DataTypes.INTEGER,
    },
    project_id: {
      type: DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Taskboard;
};