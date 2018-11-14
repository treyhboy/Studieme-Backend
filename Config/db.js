const sequelize = require("sequelize");

const db = new sequelize({
  host: "localhost",
  username: "root",
  database: "db",
  password: "taruntrehan",
  dialect: "mysql"
});

const ud = db.define("test1211db", {
    username: {
    type: sequelize.DataTypes.STRING,
    primaryKey: true
  },
    token: sequelize.DataTypes.JSON,
    expire:sequelize.DataTypes.INTEGER
});


db.sync().then(function() {
  console.log("Database is ready");
});

module.exports = {
  ud
};
