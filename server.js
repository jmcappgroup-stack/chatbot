const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const API_KEY = process.env.ANTHROPIC_API_KEY;

app.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: 'You are a helpful assistant for a local business.',
        messages: [...history, { role: 'user', content: message }]
      })
    });
    const data = await response.json();
    if (data.content && data.content[0]) {
      res.json({ reply: data.content[0].text });
    } else {
      res.json({ reply: 'Error: ' + JSON.stringify(data) });
    }
  } catch (err) {
    res.json({ reply: 'Error: ' + err.message });
  }
});

app.listen(3000, () => console.log('Server running!'));