"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Tasks", {
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
      taskboard_id: {
        type: DataTypes.INTEGER,
        references: "Taskboards",
        referenceKey: "id"
      },
      ptask_id: {
        type: DataTypes.INTEGER
      },
      due_time: {
        type: DataTypes.DATE
      },
      complete_at: {
        type: DataTypes.DATE
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
    migration.dropTable("Tasks").done(done);
  }
};