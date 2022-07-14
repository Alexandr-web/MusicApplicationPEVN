const sequelize = require("../db");
const { DataTypes, } = require("sequelize");

const User = sequelize.define("user", {
  name: { type: DataTypes.STRING, },
  password: { type: DataTypes.TEXT, },
  avatar: { type: DataTypes.TEXT, },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
}, { tableName: "user", });

module.exports = User;