
const fs = require("fs");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

const answerFromOpenAI = async (question, userId) => {
  const dir = path.join(__dirname, `../data/user_uploads/${userId}`);

  
  if (!fs.existsSync(dir)) {
    throw new Error("No uploads found for this user.");
  }

  
  const files = fs.readdirSync(dir);
  const chunkFiles = files.filter((f) => f.endsWith("-chunks.json"));
  if (chunkFiles.length === 0) {
    throw new Error("No parsed chunks found for this user.");
  }

  const lastChunkFile = chunkFiles
    .map((f) => ({
      name: f,
      time: fs.statSync(path.join(dir, f)).mtime,
    }))
    .sort((a, b) => b.time - a.time)[0]?.name;

  const parsed = JSON.parse(fs.readFileSync(path.join(dir, lastChunkFile), "utf8"));


  const prompt = `Use the notes below to answer the question:\n\n${parsed.content}\n\nQuestion: ${question}`;

 
  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1024,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.data.choices[0].message.content.trim();
  } catch (error) {
    console.error(" GROQ API Error:", error.response?.data || error.message);
    throw new Error(" Failed to get answer from Groq.");
  }
};

module.exports = { answerFromOpenAI };
