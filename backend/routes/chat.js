// // routes/chat.js

// const express = require("express");
// const { getAnswer } = require("../controllers/chatController");

// const router = express.Router();

// // Don't add "/ask" here
// router.post("/", getAnswer);

// module.exports = router;
const express = require("express");
const router = express.Router();
const { getAnswer } = require("../controllers/chatController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/", authenticate, getAnswer);

module.exports = router;
