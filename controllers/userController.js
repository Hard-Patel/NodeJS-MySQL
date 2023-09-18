const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const connection = require("../connection");

exports.createUser = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(404)
      .send({ message: "Invalid request", errors: error.array() });
  }

  try {
    const { email, password, name, isAdmin = 0 } = req.body;
    const adminValue = isAdmin ? 1 : 0;
    const salt = await bcrypt.genSalt(10);
    let pwd = await bcrypt.hash(password, salt);

    const createTableQuery = `CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY,
                                name VARCHAR(255) NOT NULL, 
                                email VARCHAR(255) UNIQUE NOT NULL, 
                                password VARCHAR(255) NOT NULL, 
                                isAdmin TINYINT(1) DEFAULT 0)`;
    connection.query(createTableQuery, (err, data) => {
      if (err) {
        return res.status(500).send({ message: "Something went wrong" });
      }
      const insertQuery =
        "INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)";

      connection.query(
        insertQuery,
        [name, email, pwd, adminValue],
        async (err, data) => {
          if (err) {
            if (err.code == "ER_DUP_ENTRY") {
              return res
                .status(400)
                .send({ message: "Email address already registered" });
            }
            return res.status(500).send({ message: "Something went wrong" });
          }
          const token = jwt.sign({ id: data?.insertId }, "myPrivateKey");
          return res.header("x-auth-token", token).send({
            message: "User created successfully",
            data: { id: data?.insertId },
          });
        }
      );
    });
  } catch (e) {
    return res.status(500).send({ message: "Something went wrong1" });
  }
};
