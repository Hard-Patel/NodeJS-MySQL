const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const connection = require("../connection");

exports.loginUserController = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(400)
      .send({ message: "Invalid request", errors: error.array() });
  }
  const { email, password } = req.body;
  try {
    const findQuery = "SELECT * FROM users WHERE email = ?";
    connection.query(findQuery, [email], async (err, data) => {
      if (err || data.length == 0) {
        return res.status(500).send({ message: "User doesn't exist" });
      }
      const { name, email, isAdmin, password: dbPwd, id } = data[0];
      const isValid = await bcrypt.compare(req.body.password, dbPwd);
      if (!isValid) {
        return res.send({
          message: "Invalid username or password",
        });
      }
      const token = jwt.sign({ id }, "myPrivateKey");
      return res.send({
        data: {
          name,
          email,
          isAdmin,
          id,
          "x-auth-token": token,
        },
        message: "LoggedIn successfully",
      });
    });
  } catch (e) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};
