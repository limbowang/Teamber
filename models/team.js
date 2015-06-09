"use strict";
var manager = require('../lib/validator-manager');

module.exports = function(sequelize, DataTypes) {
  var Team = sequelize.define("Team", {
    name: {
      type: DataTypes.STRING,
      validates: {
        notEmpty: manager.genNotEmpty("名称"),
        len: manager.genLen("名称", 6, 20)
      }
    },
    creator_id:{
      allowNull: false,
      type: DataTypes.INTEGER
    },
    description: {
      type: DataTypes.STRING,
      validates: {
        len: manager.genLen("详细描述", 0, 255)
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // user
        Team.belongsTo(models.User, { foreignKey: 'creator_id' });
        Team.belongsToMany(models.User, 
          { through: 'members', foreignKey: 'team_id', as: 'members'});
        // project
        Team.hasMany(models.Project, { foreignKey: 'team_id' });
      }
    },
    instanceMethods: {
      toJSON: function() {
        return this.dataValues;
      }
    }
  });
  return Team;
};