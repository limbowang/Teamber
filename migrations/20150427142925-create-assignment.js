"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Assignments", {
      task_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: "Tasks",
        referenceKey: "id",
        onDelete: 'cascade'
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: "Users",
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
    migration.dropTable("Assignments").done(done);
  }
};