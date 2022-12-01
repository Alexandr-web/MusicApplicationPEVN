const sequelize = require("../db");
const { DataTypes, } = require("sequelize");

const Song = sequelize.define("song", {
  name: {
    type: DataTypes.TEXT,
    required: true,
  },
  author: {
    type: DataTypes.TEXT,
    required: true,
  },
  audio: {
    type: DataTypes.TEXT,
    required: true,
  },
  poster: {
    type: DataTypes.TEXT,
    required: true,
  },
  time: {
    type: DataTypes.STRING,
    required: true,
  },
  duration: {
    type: DataTypes.REAL,
    required: true,
  },
  likes: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  },
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
}, { tableName: "song", });

module.exports = Song;