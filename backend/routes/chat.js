
const express = require("express");
const router = express.Router();
const { getAnswer } = require("../controllers/chatController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/", authenticate, getAnswer);

module.exports = router;
