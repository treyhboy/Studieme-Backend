const secret = "mysecretkey";
const jwt = require("jsonwebtoken");


function createToken(user,name) {
  let scope;

  if (user.admin) {
    scope = "admin";
  }
    console.log("user");
    console.log(user);

  return jwt.sign(
    {
      sub: user.token,
      username: user.username,
        name:name,
      role: "admin",
      scope
    },
    secret,
    {
      algorithm: "HS256",
      expiresIn: "30d"
    }
  );
}

module.exports = createToken;
