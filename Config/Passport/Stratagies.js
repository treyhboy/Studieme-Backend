const LocalStrategy = require("passport-local").Strategy;
const ud = require("../db").ud;
const bcrypt = require("bcrypt");
const request = require('request');

const LocalLogin = new LocalStrategy(function(username, password, done) {

  if (username) username = username.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

  process.nextTick(function () {
    ud
      .findOne({where: {username: username}})
      .then(function (user) {
            if (user) {
              done(null, user.dataValues);
            } else {
              done(null, false, {Message: "wrong pass"});
            }


      })
      .catch(function () {
        done(null, false, {message: "User not found"});
      });
  });
});

const LocalSignup = new LocalStrategy(function(email, token, done) {
  if (email)
      email = email.toLowerCase();
  console.log(token);
  console.log(email);
  console.log(done);
  process.nextTick(function() {

      request.post(
          `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${req.body.d}&redirect_uri=http://localhost:3000/linkedin&client_id=81k5i16hicsnq3&client_secret=GC3LNUuTqXoaqlHD`,
          function (error, response, body) {
              console.log(body)
          }
      );
      ud
      .findOne({ where: { username: email } })
      .then(function(user) {
        if (user) {
          return done(null, false, { message: "User Exist" });
        } else {
            ud
              .create({
                username: email,
                token: token
              })
              .then(function(user) {
                  console.log("user.dataValues->");
                  console.log(user.dataValues);
                return done(null, user.dataValues);
              })
              .catch(function(err) {
                throw err;
              });

        }
      })
      .catch(err => done(err));
  });
});

module.exports = { LocalSignup, LocalLogin };
