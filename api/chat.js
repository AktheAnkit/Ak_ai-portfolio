// Vercel serverless function — this is the ONLY place your Groq API key is
// used. It never reaches the browser. Set GROQ_API_KEY in your Vercel
// project's Environment Variables before deploying.
//
// Groq (groq.com) offers a genuinely free tier — no credit card needed —
// for open-source models like Llama. That's what this function uses, so
// your AI assistant costs $0 for normal portfolio-level traffic. Get a free
// key at console.groq.com/keys.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, system } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  // Groq's API is OpenAI-compatible: the system prompt is just the first
  // message in the array, rather than a separate top-level field.
  const groqMessages = [{ role: 'system', content: system || '' }, ...messages];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        // A strong free-tier model. Check console.groq.com/docs/models for
        // the current lineup before deploying — model names occasionally change.
        model: 'openai/gpt-oss-120b',
        max_tokens: 500,
        messages: groqMessages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Groq API error' });
    }

    // Normalized into the same shape the frontend already expects, so
    // src/App.jsx doesn't need to know which provider is behind this route.
    const text = data.choices?.[0]?.message?.content || '';
    res.status(200).json({ content: [{ type: 'text', text }] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reach AI service' });
  }
}
