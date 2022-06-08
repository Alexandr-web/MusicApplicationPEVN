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

const Playlist = sequelize.define("playlist", {
  name: { type: DataTypes.STRING, },
  poster: { type: DataTypes.TEXT, },
  audio: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  },
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
}, { tableName: "playlist", });

User.hasMany(Song);
User.hasMany(Playlist);

Song.belongsTo(User);
Playlist.belongsTo(User);

module.exports = {
  Song,
  User,
  Playlist,
};