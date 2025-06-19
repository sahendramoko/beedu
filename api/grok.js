const axios = require('axios');
const getRawBody = require('raw-body');

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://beedu-six.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const raw = await getRawBody(req);
    const body = JSON.parse(raw.toString());

    const { prompt } = body || {};
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await axios.post('https://api.x.ai/v1/chat/completions', {
      messages: [
        { role: "system", content: "You are a concise assistant." },
        { role: "user", content: prompt }
      ],
      model: "grok-3",
      stream: false,
      temperature: 0
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json(response.data);
  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};
