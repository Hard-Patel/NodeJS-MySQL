require('dotenv').config()
const express = require("express");
const morgan = require("morgan");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const users = require("./routes/users");
const auth = require("./routes/auth");
const admin = require("./routes/admin.js");
const bodyParser = require("body-parser");
const handleErrors = require('./utils/errors');

const app = express();

// MiddleWares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("tiny"));

//Routes
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/admin", admin);

app.use(handleErrors)

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
