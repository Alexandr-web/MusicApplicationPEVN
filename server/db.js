const { Sequelize, } = require("sequelize");
const data = {
  databaseName: process.env.DATABASE_NAME,
  userName: process.env.USER_NAME,
  userPassword: process.env.USER_PASSWORD,
  options: {
    dialect: "postgres",
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT,
  },
};

module.exports = new Sequelize(...Object.values(data));