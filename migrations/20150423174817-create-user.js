"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      username: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING(20)
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(64)
      },
      email: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING
      },
      nickname: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING(10)
      },
      description: {
        type: DataTypes.STRING
      },
      avatar: {
        type: DataTypes.STRING
      },
      is_admin: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    migration.dropTable("Users").done(done);
  }
};