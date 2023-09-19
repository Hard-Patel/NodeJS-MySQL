const express = require("express");
const customerValidator = require("../validation/customer");
const { admin } = require("../middleware/admin");
const {
  getCustomer,
  getOneCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/", getCustomer);

router.get("/:id", getOneCustomer);

router.post("/", [customerValidator, auth], createCustomer);

router.put("/:id", [customerValidator, auth], updateCustomer);

router.delete("/:id", [auth, admin], deleteCustomer);

module.exports = router;
