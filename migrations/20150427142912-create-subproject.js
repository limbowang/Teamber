"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Subprojects", {
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
        references: "Projects",
        referenceKey: "id",
        onDelete: 'cascade'
      },
      is_default: {
        allowNull: false,
        type: DataTypes.BOOLEAN
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
    migration.dropTable("Subprojects").done(done);
  }
};