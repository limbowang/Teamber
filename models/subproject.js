"use strict";
module.exports = function(sequelize, DataTypes) {
  var Subproject = sequelize.define("Subproject", {
    name: {
      allowNull: false,
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
    project_id: {
      allowNull: false,
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