"use strict";
module.exports = function(sequelize, DataTypes) {
  var Project = sequelize.define("Project", {
    name: {
      type: DataTypes.STRING,
    },
    creator_id: {
      type: DataTypes.INTEGER,
    },
    team_id: {
      type: DataTypes.INTEGER,
    },
    is_private: {
      type: DataTypes.BOOLEAN
    }
  }, {
    classMethods: {
      associate: function(models) {
        // user
        Project.belongsTo(models.User, { foreignKey: 'creator_id' });
        // Project
        Project.belongsTo(models.Team, { foreignKey: 'team_id' });
        // Subproject
        Project.hasMany(models.Subproject, { foreignKey: 'project_id' });
      }
    }
  });
  return Project;
};