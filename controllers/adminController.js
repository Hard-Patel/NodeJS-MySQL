require("dotenv").config();
const connection = require("../connection");

exports.uploadImageController = async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file provided to upload." });
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
        return res.status(500).send({ message: "Something went wrong" });
      }
      const insertQry =
        "INSERT INTO files (admin_id, filename, path) VALUES (?, ?, ?)";
      connection.query(
        insertQry,
        [req.user.id, filename, serverImageUrl],
        (err, data) => {
          if (err) {
            return res.status(500).send({ message: "Something went wrong" });
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
    return res.status(500).send({ message: "Something went wrong" });
  }
};

exports.retrieveImages = async (req, res) => {
  try {
    const fetchQuery = `SELECT files.*, users.name as 'uploaded by' FROM files INNER JOIN users WHERE files.admin_id = users.id`;
    connection.query(fetchQuery, (err, data) => {
        if (err) {
        return res.status(500).send({ message: "Something went wrong" });
      }
      res.send({ message: "List fetched successfully", data });
    });
  } catch (e) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};
