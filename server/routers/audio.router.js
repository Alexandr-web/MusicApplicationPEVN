const express = require("express");
const router = express.Router();
const AudioController = require("../controllers/Audio.controller");

router.get("/", AudioController.getAll);
router.get("/:id", AudioController.getOne);

module.exports = router;