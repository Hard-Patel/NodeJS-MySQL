const { validationResult } = require("express-validator");
const connection = require("../connection");
const { ErrorMessages, StatusCodes, APIError } = require("../utils/constants");
const { buildError } = require("../utils/errorBuilder");

exports.getGenres = async (req, res, next) => {
  const query = "SELECT * FROM genres";
  try {
    // throw new Error(APIError.NOT_FOUND)
    connection.query(query, (err, data) => {
      if (err) {
        return buildError(
          res,
          APIError.NOT_FOUND,
          ErrorMessages.NOT_FOUND,
          StatusCodes.BAD_REQUEST,
          { fields: "Error in validation" }
        );
      }
      res.send({ message: "Genres fetched successfully", data: data });
    });
  } catch (e) {
    console.log("e: ", e);
    res.send({ message: "Something went wrong" });
  }
};

exports.getOneGenre = async (req, res) => {
  try {
    const findQuery = `SELECT * FROM genres WHERE id=?`;
    connection.query(findQuery, [req.params.id], (err, data) => {
      if (err || data.length == 0) {
        return res.status(404).send({ message: "Genre doesn't exist" });
      }
      res.send({ message: "Genre found successfully", data: data[0] });
    });
  } catch (e) {
    return res.status(404).send({ message: "Genre doesn't exists", error: e });
  }
};

exports.createGenre = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty())
    return res
      .status(401)
      .send({ message: "Not found", errors: error.array() });

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
        return res.status(400).send({ message: "Something went wrong" });
      } else {
        const insertDataQuery = `
            INSERT INTO ${tableName} (genre) VALUES ('${req.body.genre}')`;

        connection.query(insertDataQuery, (err, data) => {
          if (err) {
            return res.status(400).send({ message: "Something went wrong" });
          }
          res.send({ message: "Genre added successfully", data });
        });
      }
    });
  } catch (e) {
    res.status(500).send({ message: "Something went wrong" });
  }
};

exports.updateGenre = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty())
    return res
      .status(401)
      .send({ message: "Invalid Request", errors: error.array() });

  try {
    const tableName = "genres";
    const insertDataQuery = `
            UPDATE ${tableName} SET genre = ? WHERE id = ?`;

    connection.query(
      insertDataQuery,
      [req.body.genre, req.params.id],
      (err, data) => {
        if (err) {
          return res.status(400).send({ message: "Something went wrong" });
        }

        if (data.affectedRows == 0) {
          return res.send({ message: "Genre doesn't exist" });
        }
        return res.send({ message: "Genre updated successfully", data });
      }
    );
  } catch (e) {
    return res.status(404).send({ message: "Genre doesn't exists" });
  }
};

exports.deleteGenre = async (req, res) => {
  try {
    const deleteQuery = "DELETE FROM genres WHERE id = ?";
    connection.query(deleteQuery, [req.params.id], (err, data) => {
      if (err || data.affectedRows == 0) {
        return res.send({
          message: "Genre doesn't exist",
        });
      }
      return res.send({ data: data, message: "Genre deleted successfully" });
    });
  } catch (e) {
    return res.status(404).send({ message: `Genre doesn't exists` });
  }
};
