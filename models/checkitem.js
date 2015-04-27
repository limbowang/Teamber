"use strict";
module.exports = function(sequelize, DataTypes) {
  var Checkitem = sequelize.define("Checkitem", {
    content: {
      type: DataTypes.STRING,
    },
    creator_id: {
      type: DataTypes.INTEGER,
    },
    checked: {
      type: DataTypes.INTEGER,
    },
    checker_id: {
      type: DataTypes.INTEGER,
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
  return Checkitem;
};