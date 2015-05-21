"use strict";
var manager = require('../lib/validator-manager');

module.exports = function(sequelize, DataTypes) {
  var Project = sequelize.define("Project", {
    name: {
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
    team_id: {
      type: DataTypes.INTEGER
    },
    is_private: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // user
        Project.belongsTo(models.User, { foreignKey: 'creator_id' });
        Project.belongsToMany(models.User, { through: 'contributors', foreignKey: 'project_id', as: 'Contributors'});
        // Team
        Project.belongsTo(models.Team, { foreignKey: 'team_id' });
        // Subproject
        Project.hasMany(models.Subproject, { foreignKey: 'project_id' });
      }
    }
  });
  return Project;
};