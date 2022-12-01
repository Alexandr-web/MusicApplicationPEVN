const sequelize = require("../db");
const { DataTypes, } = require("sequelize");

const User = sequelize.define("user", {
  name: {
    type: DataTypes.STRING,
    required: true,
    unique: true,
  },
  password: {
    type: DataTypes.TEXT,
    required: true,
  },
  avatar: {
    type: DataTypes.TEXT,
    required: true,
  },
  email: {
    type: DataTypes.STRING,
    required: true,
    unique: true,
  },
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
}, { tableName: "user", });

module.exports = User;