
const { answerFromOpenAI } = require("../utils/retriever");

const getAnswer = async (req, res) => {
  const { question } = req.body;
  const userId = req.user.id;

  try {
    const answer = await answerFromOpenAI(question, userId);
    res.json({ answer });
  } catch (err) {
    console.error(" Error from OpenAI:", err.message);
    res.status(500).json({ error: "OpenAI failed to respond" });
  }
};

module.exports = { getAnswer };
