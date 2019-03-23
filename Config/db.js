const sequelize = require("sequelize");

// const db = new sequelize({
//   host: "localhost",
//   username: "root",
//   database: "db",
//   password: "taruntrehan",
//   dialect: "mysql"
// });
const db = new sequelize (process.env.DATABASE_URL);

const ud = db.define("testooodb", {
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
