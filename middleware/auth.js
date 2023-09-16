const jwt = require("jsonwebtoken");
const connection = require("../connection");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided" });
  }
  try {
    const decoded = jwt.verify(token, "myPrivateKey");
    console.log("decoded: ", decoded);
    const findQuery = "SELECT * FROM users WHERE id = ?";
    connection.query(findQuery, [decoded.id], (err, data) => {
      if (err || !data.length) {
        return res
          .status(404)
          .send({ message: "Invalid token or User does not exist" });
      }
      req.user = data[0];
      next();
    });
  } catch (e) {
    return res.status(400).send({ message: "Invalid token" });
  }
}

exports.auth = auth;
