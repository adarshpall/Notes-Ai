// const fs = require("fs");
// const pdf = require("pdf-parse");
// const path = require("path");

// const parsePDF = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   const filePath = req.file.path;

//   try {
//     const dataBuffer = fs.readFileSync(filePath);
//     const data = await pdf(dataBuffer);
//     const text = data.text;

//     // Ensure the "data" directory exists
//     const dataDir = path.join(__dirname, "..", "data");
//     if (!fs.existsSync(dataDir)) {
//       fs.mkdirSync(dataDir);
//     }

//     // Save extracted text in chunks.json
//     const chunksPath = path.join(dataDir, "chunks.json");
//     fs.writeFileSync(chunksPath, JSON.stringify({ content: text }, null, 2));

//     res.json({ message: "✅ PDF parsed and saved successfully" });
//   } catch (err) {
//     console.error("❌ Error parsing PDF:", err);
//     res.status(500).json({ error: "Failed to parse PDF" });
//   } finally {
//     // Delete uploaded file to avoid storage clutter
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }
//   }
// };

// module.exports = { parsePDF };
const fs = require("fs");
const pdf = require("pdf-parse");
const path = require("path");

const parsePDF = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;

  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    const text = data.text;

    // 🟢 Create user-specific directory
    const userDir = path.join(__dirname, "..", "data", "user_uploads", req.user.id);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    // 🔵 Save extracted text to chunks.json in user's folder
   const timestamp = Date.now();
const chunkPath = path.join(userDir, `${timestamp}-chunks.json`);
fs.writeFileSync(chunkPath, JSON.stringify({ content: text }, null, 2));

    res.json({ message: "✅ PDF parsed and saved successfully" });
  } catch (err) {
    console.error("❌ Error parsing PDF:", err);
    res.status(500).json({ error: "Failed to parse PDF" });
  } finally {
    // 🧹 Delete uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

module.exports = { parsePDF };
