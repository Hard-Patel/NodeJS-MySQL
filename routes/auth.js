const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const login = require("../validation/auth");
const { validationResult } = require("express-validator");
const connection = require("../connection");
const jwt = require("jsonwebtoken");
const { loginUserController } = require("../controllers/authController");
const router = express.Router();

router.post("/", login, loginUserController);

module.exports = router;
