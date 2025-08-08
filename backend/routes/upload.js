// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const { parsePDF } = require("../controllers/pdfController");

// // Ensure 'uploads' folder exists
// const uploadDir = "uploads";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Configure Multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     cb(null, Date.now() + ext);
//   },
// });

// const upload = multer({ storage });

// // POST route
// router.post("/", upload.single("file"), parsePDF);

// module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { parsePDF } = require("../controllers/pdfController");
const { authenticate } = require("../middleware/authMiddleware");

// Dynamic upload path per user
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
   const userFolder = path.join(__dirname, "../data/user_uploads", req.user.id);

    if (!fs.existsSync(userFolder)) fs.mkdirSync(userFolder, { recursive: true });
    cb(null, userFolder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

router.post("/", authenticate, upload.single("file"), parsePDF);

module.exports = router;
