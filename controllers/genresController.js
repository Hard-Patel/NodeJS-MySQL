const { validationResult } = require("express-validator");
const connection = require("../connection");
const { ErrorMessages, StatusCodes, APIError } = require("../utils/constants");
const { buildError } = require("../utils/errorBuilder");
const CommonErrorHandler = require("../utils/errors");

exports.getGenres = async (req, res, next) => {
  const query = "SELECT * FROM genres";
  try {
    connection.query(query, (err, data) => {
      if (err) {
        return CommonErrorHandler(
          res,
          APIError.NOT_FOUND,
          undefined,
          undefined,
          { fields: "Error in validation" }
        );
      }
      res.send({ message: "Genres fetched successfully", data: data });
    });
  } catch (e) {
    return CommonErrorHandler(res, APIError.INTERNAL_SERVER_ERROR);
  }
};

exports.getOneGenre = async (req, res) => {
  try {
    const findQuery = `SELECT * FROM genres WHERE id=?`;
    connection.query(findQuery, [req.params.id], (err, data) => {
      if (err || data.length == 0) {
        return CommonErrorHandler(
          res,
          APIError.NOT_FOUND,
          ErrorMessages.GENRE_DOES_NOT_EXISTS
        );
      }
      res.send({ message: "Genre found successfully", data: data[0] });
    });
  } catch (e) {
    return CommonErrorHandler(res, APIError.INTERNAL_SERVER_ERROR);
  }
};

exports.createGenre = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty())
    return CommonErrorHandler(
      res,
      APIError.BAD_REQUEST,
      ErrorMessages.BAD_REQUEST,
      StatusCodes.BAD_REQUEST,
      { errors: error.array() }
    );

  try {
    const tableName = "genres";
    const createTableQuery = `
              CREATE TABLE IF NOT EXISTS ${tableName} (
                id INT AUTO_INCREMENT PRIMARY KEY,
                genre VARCHAR(255) NOT NULL
              )
            `;

    connection.query(createTableQuery, (err) => {
      if (err) {
        return CommonErrorHandler(res, APIError.INTERNAL_SERVER_ERROR);
      } else {
        const insertDataQuery = `
            INSERT INTO ${tableName} (genre) VALUES ('${req.body.genre}')`;

        connection.query(insertDataQuery, (err, data) => {
          if (err) {
            return CommonErrorHandler(res, APIError.INTERNAL_SERVER_ERROR);
          }
          res.send({ message: "Genre added successfully", data });
        });
      }
    });
  } catch (e) {
    return CommonErrorHandler(res, APIError.INTERNAL_SERVER_ERROR);
  }
};

exports.updateGenre = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty())
    return CommonErrorHandler(
      res,
      APIError.BAD_REQUEST,
      undefined,
      undefined,
      { errors: error.array() }
    );

  try {
    const tableName = "genres";
    const insertDataQuery = `
            UPDATE ${tableName} SET genre = ? WHERE id = ?`;

    connection.query(
      insertDataQuery,
      [req.body.genre, req.params.id],
      (err, data) => {
        if (err) {
          return CommonErrorHandler(res, APIError.INTERNAL_SERVER_ERROR);
        }

        if (data.affectedRows == 0) {
          return CommonErrorHandler(res, APIError.NOT_FOUND, ErrorMessages.GENRE_DOES_NOT_EXISTS);
        }
        return res.send({ message: "Genre updated successfully", data });
      }
    );
  } catch (e) {
    return CommonErrorHandler(res, APIError.INTERNAL_SERVER_ERROR);
  }
};

exports.deleteGenre = async (req, res) => {
  try {
    const deleteQuery = "DELETE FROM genres WHERE id = ?";
    connection.query(deleteQuery, [req.params.id], (err, data) => {
      if (err || data.affectedRows == 0) {
        return CommonErrorHandler(res, APIError.NOT_FOUND, ErrorMessages.GENRE_DOES_NOT_EXISTS);
      }
      return res.send({ data: data, message: "Genre deleted successfully" });
    });
  } catch (e) {
    return CommonErrorHandler(res, APIError.INTERNAL_SERVER_ERROR);
  }
};
