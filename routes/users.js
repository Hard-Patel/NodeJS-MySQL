const express = require("express");
const _ = require("lodash");
const checkUser = require("../validation/user");
const { createUser } = require("../controllers/userController");
const router = express.Router();

router.post("/", checkUser, createUser);

module.exports = router;
