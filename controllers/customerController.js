const { validationResult } = require("express-validator");
const connection = require("../connection");

exports.getCustomer = async (req, res) => {
  try {
    const fetchCustomer = "SELECT * FROM customers";
    connection.query(fetchCustomer, (err, data) => {
      if (err) {
        return res.status(500).send({ message: "Server error" });
      }
      return res.send({
        message: "Customers fetched successfully",
        data: data,
      });
    });
  } catch (e) {
    return res.status(500).send({ message: "Server error" });
  }
};

exports.getOneCustomer = async (req, res) => {
  try {
    const findQuery = `SELECT * FROM customers WHERE id=?`;
    connection.query(findQuery, [req.params.id], (err, data) => {
      if (err || !data.length) {
        return res.status(404).send({ message: "Customer doesn't exist" });
      }
      res.send({ message: "Customer found successfully", data: data[0] });
    });
  } catch (e) {
    return res.status(404).send({ message: "Customer doesn't exists" });
  }
};

exports.createCustomer = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) return res.status(401).send({ message: error.array() });

  try {
    const tableName = "customers";
    const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (id INT AUTO_INCREMENT PRIMARY KEY, 
                                  name VARCHAR(255) NOT NULL,
                                  isGold TINYINT(1) DEFAULT 0,
                                  phone VARCHAR(20) NOT NULL)`;

    connection.query(createTableQuery, (err, result) => {
      if (err) {
        console.log("err: ", err);
        return res
          .status(500)
          .send({ message: "Error while creating the table" });
      }
      const insertData =
        "INSERT INTO customers (name, isGold, phone) VALUES (?, ?, ?)";
      connection.query(
        insertData,
        [req.body.name, req.body.isGold, req.body.phone],
        (err, result) => {
          if (err) {
            return res
              .status(400)
              .send({ message: "Failed to insert the data" });
          }
          return res.send({
            data: result,
            message: "Customer added successfully.",
          });
        }
      );
    });
  } catch (e) {
    res.status(400).send({ message: "Something went wrong" });
  }
};

exports.updateCustomer = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) return res.status(401).send({ message: error.array() });

  try {
    const tableName = "customers";
    const updateQuery = `UPDATE ${tableName} SET name = ?, isGold = ?, phone = ? WHERE id = ? `;
    connection.query(
      updateQuery,
      [req.body.name, req.body.isGold, req.body.phone, req.params.id],
      (err, result) => {
        if (err && result?.affectedRows != 0) {
          console.log("err: ", err);
          return res.status(400).send({ message: "Customer doesn't exist" });
        }
        return res.send({
          data: result,
          message: "Customer updated successfully.",
        });
      }
    );
  } catch (e) {
    res.status(400).send({ message: "Something went wrong" });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const deleteQuery = "DELETE FROM customers WHERE id=?";
    connection.query(deleteQuery, [req.params.id], (err, data) => {
      if (err || data.affectedRows == 0) {
        return res.status(400).send({ message: "Customer doesn't exist" });
      }
      return res.send({
        data: data,
        message: "Customer deleted successfully",
      });
    });
  } catch (e) {
    return res.status(404).send({ message: `Customer doesn't exists` });
  }
};
