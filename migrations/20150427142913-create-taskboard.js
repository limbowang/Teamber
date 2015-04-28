"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Taskboards", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(20)
      },
      creator_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: "Users",
        referenceKey: "id"
      },
      project_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: "Subprojects",
        referenceKey: "id"
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Taskboards").done(done);
  }
};