"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Auths", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: "Users",
        referenceKey: "id"
      },
      team_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: "Teams",
        referenceKey: "id"
      },
      value: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0
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
    migration.dropTable("Auths").done(done);
  }
};