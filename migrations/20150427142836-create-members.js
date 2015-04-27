"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Members", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      team_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: "Teams",
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
    migration.dropTable("Members").done(done);
  }
};