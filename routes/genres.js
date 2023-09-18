const express = require("express");
const router = express.Router();
const genre = require("../validation/genres");
const { auth } = require("../middleware/auth");
const { admin } = require("../middleware/admin");
const {
  getGenres,
  getOneGenre,
  createGenre,
  updateGenre,
  deleteGenre,
} = require("../controllers/genresController");

router.get("/", getGenres);

router.get("/:id", getOneGenre);

router.post("/", [genre, auth], createGenre);

router.put("/:id", [genre, auth], updateGenre);

router.delete("/:id", [auth, admin], deleteGenre);

module.exports = router;
