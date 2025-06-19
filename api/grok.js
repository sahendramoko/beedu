const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metode tidak diizinkan' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Pesan diperlukan' });
  }

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'Kamu BeEduAI, asisten AI yang membantu siswa BeEdu.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        model: 'grok-3-latest',
        stream: false,
        temperature: 0,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Permintaan ke API Grok gagal');
    }

    const reply = data.choices[0]?.message?.content || 'Tidak ada respons dari Grok';
    res.status(200).json({ reply });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Kesalahan server' });
  }
};
