const { validationResult } = require("express-validator");
const connection = require("../connection");
const CommonErrorHandler = require("../utils/errors");
const { APIError, ErrorMessages, StatusCodes } = require("../utils/constants");

exports.getCustomer = async (req, res) => {
  try {
    const fetchCustomer = "SELECT * FROM customers";
    connection.query(fetchCustomer, (err, data) => {
      if (err) {
        return CommonErrorHandler(res);
      }
      return res.send({
        message: "Customers fetched successfully",
        data: data,
      });
    });
  } catch (e) {
    return CommonErrorHandler(res);
  }
};

exports.getOneCustomer = async (req, res) => {
  try {
    const findQuery = `SELECT * FROM customers WHERE id=?`;
    connection.query(findQuery, [req.params.id], (err, data) => {
      if (err || !data.length) {
        return CommonErrorHandler(
          res,
          APIError.NOT_FOUND,
          ErrorMessages.CUSTOMER_DOES_NOT_EXISTS
        );
      }
      res.send({ message: "Customer found successfully", data: data[0] });
    });
  } catch (e) {
    return CommonErrorHandler(res);
  }
};

exports.createCustomer = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty())
    return CommonErrorHandler(APIError.BAD_REQUEST, undefined, undefined, {
      errors: error.array(),
    });

  try {
    const tableName = "customers";
    const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (id INT AUTO_INCREMENT PRIMARY KEY, 
                                  name VARCHAR(255) NOT NULL,
                                  isGold TINYINT(1) DEFAULT 0,
                                  phone VARCHAR(20) NOT NULL)`;

    connection.query(createTableQuery, (err, result) => {
      if (err) {
        return CommonErrorHandler(res);
      }
      const insertData =
        "INSERT INTO customers (name, isGold, phone) VALUES (?, ?, ?)";
      connection.query(
        insertData,
        [req.body.name, req.body.isGold, req.body.phone],
        (err, result) => {
          if (err) {
            return CommonErrorHandler(res);
          }
          return res.send({
            data: result,
            message: "Customer added successfully.",
          });
        }
      );
    });
  } catch (e) {
    return CommonErrorHandler(res);
  }
};

exports.updateCustomer = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty())
    return CommonErrorHandler(
      APIError.BAD_REQUEST,
      ErrorMessages.VALIDATION_ERROR,
      undefined,
      {
        message: error.array(),
      }
    );

  try {
    const tableName = "customers";
    const updateQuery = `UPDATE ${tableName} SET name = ?, isGold = ?, phone = ? WHERE id = ? `;
    connection.query(
      updateQuery,
      [req.body.name, req.body.isGold, req.body.phone, req.params.id],
      (err, result) => {
        if (err && result?.affectedRows != 0) {
          return CommonErrorHandler(
            APIError.BAD_REQUEST,
            ErrorMessages.CUSTOMER_DOES_NOT_EXISTS,
            StatusCodes.BAD_REQUEST
          );
        }
        return res.send({
          data: result,
          message: "Customer updated successfully.",
        });
      }
    );
  } catch (e) {
    return CommonErrorHandler(res);
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const deleteQuery = "DELETE FROM customers WHERE id=?";
    connection.query(deleteQuery, [req.params.id], (err, data) => {
      if (err || data.affectedRows == 0) {
        return CommonErrorHandler(
          APIError.BAD_REQUEST,
          ErrorMessages.CUSTOMER_DOES_NOT_EXISTS
        );
      }
      return res.send({
        data: data,
        message: "Customer deleted successfully",
      });
    });
  } catch (e) {
    return CommonErrorHandler(res);
  }
};
