"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Histories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      content: {
        allowNull: false,
        type: DataTypes.STRING
      },
      task_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: "Tasks",
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
    migration.dropTable("Histories").done(done);
  }
};