"use strict";
var manager = require('../lib/validator-manager');

module.exports = function(sequelize, DataTypes) {
  var Team = sequelize.define("Team", {
    name: {
      type: DataTypes.STRING,
      validates: {
        notEmpty: manager.genNotEmpty("名字"),
        len: manager.genLen("名字", 6, 20)
      }
    },
    creator_id:{
      allowNull: false,
      type: DataTypes.INTEGER
    },
    description: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        // user
        Team.belongsTo(models.User, { foreignKey: 'creator_id' });
        Team.belongsToMany(models.User, { through: 'members', foreignKey: 'team_id' });
        // project
        Team.hasMany(models.Project, { foreignKey: 'project_id' });
      }
    }
  });
  return Team;
};