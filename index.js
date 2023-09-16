const express = require("express");
const morgan = require("morgan");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const users = require("./routes/users");
const auth = require("./routes/auth");
const bodyParser = require('body-parser');

const app = express();

// MiddleWares
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}))
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

app.listen(3000, () => {
  console.log("Server started on port 3000...");
});
