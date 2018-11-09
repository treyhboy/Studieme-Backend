const passport = require("Passport");
const strategies = require("./Stratagies");
const ud = require("../db").ud;

passport.serializeUser(function(user, done) {
  console.log("serialize");
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log("deserialize");
  ud
    .findById(id)
    .then(function(user) {
      done(null, user.dataValues);
    })
    .catch(function(err) {
      done(err, false);
    });
});

passport.use("local-signup", strategies.LocalSignup);

passport.use("local-login", strategies.LocalLogin);

module.exports = passport;
