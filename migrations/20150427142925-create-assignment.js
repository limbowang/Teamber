"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Assignments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      task_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: "Tasks",
        referenceKey: "id"
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
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