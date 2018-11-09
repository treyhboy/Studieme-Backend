const LocalStrategy = require("passport-local").Strategy;
const ud = require("../db").ud;
const bcrypt = require("bcrypt");

const LocalLogin = new LocalStrategy(function(username, password, done) {

  if (username) username = username.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

  process.nextTick(function () {
    ud
      .findOne({where: {username: username}})
      .then(function (user) {
        if (user.username === username) {
          bcrypt.compare(password, user.pass).then(function (res) {
            if (res) {
              done(null, user.dataValues);
            } else {
              done(null, false, {Message: "wrong pass"});
            }
          });
        } else {
          done(null, false, {message: "User not found"});
        }
      })
      .catch(function () {
        done(null, false, {message: "User not found"});
      });
  });
});

const LocalSignup = new LocalStrategy(function(email, password, done) {
  if (email) email = email.toLowerCase();
  console.log(password);
  console.log(email);
  console.log(done);
  process.nextTick(function() {
    ud
      .findOne({ where: { username: email } })
      .then(function(user) {
        if (user) {
          return done(null, false, { message: "User Exist" });
        } else {
          bcrypt.hash(password, 10).then(function(hash) {
            ud
              .create({
                username: email,
                pass: hash
              })
              .then(function(user) {
                return done(null, user.dataValues);
              })
              .catch(function(err) {
                throw err;
              });
          });
        }
      })
      .catch(err => done(err));
  });
});

module.exports = { LocalSignup, LocalLogin };
