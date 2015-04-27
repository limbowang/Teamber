"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Checkitems", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      content: {
        type: DataTypes.STRING
      },
      creator_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: "Users",
        referenceKey: "id"
      },
      checked: {
        type: DataTypes.INTEGER,
        defaultValue: false
      },
      checker_id: {
        type: DataTypes.INTEGER,
        references: "Users",
        referenceKey: "id"
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
    migration.dropTable("Checkitems").done(done);
  }
};