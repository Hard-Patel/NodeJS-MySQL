const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "testdb",
});

connection.connect(function (err) {
  if (err) console.log(err);
});

module.exports = connection;
