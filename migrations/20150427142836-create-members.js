"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Members", {
      team_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: "Teams",
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
      auth: {
        allowNull: false,
        type: DataTypes.ENUM('ADMIN', 'MEMBER'),
        defaultValue: 'MEMBER'
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