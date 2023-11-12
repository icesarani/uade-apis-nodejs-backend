/**
 * @type {Module jsonwebtoken|Module jsonwebtoken}
 * @author | Mohammad Raheem
 */
const jwt = require("jsonwebtoken");
const config = require("../config").config();

const authorization = function (req, res, next) {
  const token = req.headers["x-access-token"];
  console.log("token", token);
  const msg = { auth: false, message: "No token provided." };
  if (!token) res.status(500).send(msg);

  let sec = process.env.SECRET;
  //console.log("secret",sec)
  jwt.verify(token, sec, function (err, decoded) {
    const msg = { auth: false, message: "Failed to authenticate token." };
    if (err) res.status(500).send(msg);
    req.userId = decoded.id;
    next();
  });
};

module.exports = authorization;
