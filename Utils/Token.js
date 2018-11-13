const secret = "mysecretkey";
const jwt = require("jsonwebtoken");


function createToken(user) {
  let scope;

  if (user.admin) {
    scope = "admin";
  }
    console.log("expireee");
    console.log(JSON.stringify(user.expire)+"s");
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
      expiresIn: (JSON.stringify(user.expire)+"s")
    }
  );
}

module.exports = createToken;
