const sequelize = require("../db");
const { DataTypes, } = require("sequelize");

const Song = sequelize.define("song", {
  name: { type: DataTypes.TEXT, },
  author: { type: DataTypes.TEXT, },
  audio: { type: DataTypes.TEXT, },
  poster: { type: DataTypes.TEXT, },
  time: { type: DataTypes.STRING, },
  duration: { type: DataTypes.REAL, },
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