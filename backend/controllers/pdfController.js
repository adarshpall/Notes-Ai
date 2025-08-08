
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

 
    const userDir = path.join(__dirname, "..", "data", "user_uploads", req.user.id);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    
   const timestamp = Date.now();
const chunkPath = path.join(userDir, `${timestamp}-chunks.json`);
fs.writeFileSync(chunkPath, JSON.stringify({ content: text }, null, 2));

    res.json({ message: " PDF parsed and saved successfully" });
  } catch (err) {
    console.error(" Error parsing PDF:", err);
    res.status(500).json({ error: "Failed to parse PDF" });
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

module.exports = { parsePDF };
