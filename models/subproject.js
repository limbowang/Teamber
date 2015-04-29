"use strict";
module.exports = function(sequelize, DataTypes) {
  var Subproject = sequelize.define("Subproject", {
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
        // user
        Subproject.belongsTo(models.User, { foreignKey: 'creator_id' });
        // project
        Subproject.belongsTo(models.Project, { foreignKey: 'project_id' });
        // taskboard
        Subproject.hasMany(models.Taskboard, { foreignKey: 'taskboard_id' });
      }
    }
  });
  return Subproject;
};