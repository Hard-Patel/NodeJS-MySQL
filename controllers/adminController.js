require("dotenv").config();
const connection = require("../connection");
const fs = require("fs");
const CommonErrorHandler = require("../utils/errors");
const { APIError, ErrorMessages } = require("../utils/constants");

exports.uploadImageController = async (req, res) => {
  console.log('req.file: ', req.file);
  if (!req.file) {
    return CommonErrorHandler(
      res,
      APIError.BAD_REQUEST,
      ErrorMessages.NO_FILE_PROVIDED
    );
  }
  const { filename, path } = req.file;
  const serverImageUrl = process.env.IMAGE_UPLOAD_BASE_PATH + path;

  try {
    const createQuery = `CREATE TABLE IF NOT EXISTS files (id int(11) AUTO_INCREMENT PRIMARY KEY, 
                        admin_id int(11) NOT NULL, 
                        filename varchar(1024) NOT NULL, 
                        path varchar(1024) NOT NULL)`;
    connection.query(createQuery, (err, data) => {
      if (err) {
        return CommonErrorHandler(res);
      }
      const insertQry =
        "INSERT INTO files (admin_id, filename, path) VALUES (?, ?, ?)";
      connection.query(
        insertQry,
        [req.user.id, filename, serverImageUrl],
        (err, data) => {
          if (err) {
            return CommonErrorHandler(res);
          }
          return res.send({
            message: "Image uploaded",
            filename,
            path: serverImageUrl,
          });
        }
      );
    });
  } catch (e) {
    return CommonErrorHandler(res);
  }
};

exports.retrieveImages = async (req, res) => {
  try {
    const fetchQuery = `SELECT files.*, users.name as 'uploaded by' FROM files INNER JOIN users WHERE files.admin_id = users.id`;
    connection.query(fetchQuery, (err, data) => {
      if (err) {
        return CommonErrorHandler(res);
      }
      res.send({ message: "List fetched successfully", data });
    });
  } catch (e) {
    return CommonErrorHandler(res);
  }
};

exports.downloadImage = async (req, res) => {
  try {
    const imagePath = `D:/NodeJS/NodeJS-MySQL/uploads/1695057256458-ups.png`; // Replace with the actual image filename

    // Set the response headers for the image download
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=1695057256458-ups.jpg"
    ); // Replace with the actual image filename
    res.setHeader("Content-Type", "image/jpeg");

    // Stream the image file to the response
    const fileStream = fs.createReadStream(imagePath);
    fileStream.pipe(res);
  } catch (e) {
    return CommonErrorHandler(res);
  }
};
