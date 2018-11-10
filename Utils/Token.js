const secret = "mysecretkey";
const jwt = require("jsonwebtoken");


function createToken(user) {
  let scope;

  if (user.admin) {
    scope = "admin";
  }
    console.log(JSON.stringify(user.expire));
  return jwt.sign(
    {
      sub: user.token,
      username: user.username,
      role: "admin",
      scope
    },
    secret,
    {
      algorithm: "HS256",
      expiresIn: JSON.stringify(user.expire)
    }
  );
}

module.exports = createToken;
