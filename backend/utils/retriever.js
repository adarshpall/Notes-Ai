// // const fs = require("fs");
// // const path = require("path");
// // const axios = require("axios");
// // const dotenv = require("dotenv");

// // dotenv.config(); // ✅ Load .env variables

// // const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// // const answerFromGemini = async (question) => {
// //   try {
// //     const filePath = path.join(__dirname, "../data/chunks.json");
// //     if (!fs.existsSync(filePath)) {
// //       throw new Error("Chunks file not found. Upload a PDF first.");
// //     }

// //     const file = fs.readFileSync(filePath, "utf8");
// //     const parsed = JSON.parse(file);
// //     const context = parsed.content;

// //     const prompt = `You are a helpful assistant. Use the notes below to answer the question.\n\nNotes:\n${context}\n\nQuestion: ${question}`;

// //     const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

// //     const response = await axios.post(apiUrl, {
// //       contents: [
// //         {
// //           parts: [{ text: prompt }],
// //         },
// //       ],
// //     });

// //     const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
// //     return result || "No response from Gemini.";
// //   } catch (error) {
// //     console.error("❌ Error from Gemini:", error.response?.data || error.message);
// //     throw new Error("Gemini failed to respond");
// //   }
// // };

// // module.exports = { answerFromGemini };
// const fs = require("fs");
// const path = require("path");
// const axios = require("axios");
// const dotenv = require("dotenv");

// dotenv.config();

// const GROQ_API_KEY = process.env.GROQ_API_KEY;

// const answerFromOpenAI = async (question) => {
//   const filePath = path.join(__dirname, "../data/chunks.json");
//   if (!fs.existsSync(filePath)) {
//     throw new Error("Chunks file not found. Upload a PDF first.");
//   }

//   const file = fs.readFileSync(filePath, "utf8");
//   const parsed = JSON.parse(file);
//   const context = parsed.content;

//   const prompt = `You are a helpful assistant. Use the notes below to answer the question.\n\nNotes:\n${context}\n\nQuestion: ${question}`;

//   const response = await axios.post(
//     "https://api.groq.com/openai/v1/chat/completions",
//     {
//       model: "llama3-70b-8192",
//       messages: [
//         {
//           role: "system",
//           content: "You are a helpful assistant.",
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//     },
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${GROQ_API_KEY}`,
//       },
//     }
//   );

//   const reply = response.data.choices?.[0]?.message?.content;
//   return reply || "No response from Groq.";
// };

// module.exports = { answerFromOpenAI };
const fs = require("fs");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

const answerFromOpenAI = async (question, userId) => {
  const dir = path.join(__dirname, `../data/user_uploads/${userId}`);

  // ✅ Check if user's directory exists
  if (!fs.existsSync(dir)) {
    throw new Error("No uploads found for this user.");
  }

  // ✅ Look for parsed chunk files
  const files = fs.readdirSync(dir);
  const chunkFiles = files.filter((f) => f.endsWith("-chunks.json"));
  if (chunkFiles.length === 0) {
    throw new Error("No parsed chunks found for this user.");
  }

  // ✅ Pick the latest chunk file
  const lastChunkFile = chunkFiles
    .map((f) => ({
      name: f,
      time: fs.statSync(path.join(dir, f)).mtime,
    }))
    .sort((a, b) => b.time - a.time)[0]?.name;

  const parsed = JSON.parse(fs.readFileSync(path.join(dir, lastChunkFile), "utf8"));

  // ✅ Construct prompt from parsed content and user question
  const prompt = `Use the notes below to answer the question:\n\n${parsed.content}\n\nQuestion: ${question}`;

  // ✅ Call Groq API with llama3-70b-8192 model
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

    // ✅ Return the assistant's response
    return res.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("❌ GROQ API Error:", error.response?.data || error.message);
    throw new Error("🔴 Failed to get answer from Groq.");
  }
};

module.exports = { answerFromOpenAI };
