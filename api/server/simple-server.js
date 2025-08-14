const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Gemini API Keys - rotate through them
const ALL_GEMINI_API_KEYS = process.env.ALL_GEMINI_API_KEYS?.split(',') || [];
let currentKeyIndex = 0;

// Base system rules in Persian
const BASE_RULES_FA = `تو یک دستیار هوشمند و مفید هستی. همیشه به زبان فارسی پاسخ می‌دهی مگر اینکه کاربر خواسته باشد به زبان دیگری پاسخ دهم. 
تو می‌توانی در زمینه‌های مختلف مانند برنامه‌نویسی، ریاضی، علوم، تاریخ، ادبیات و بسیاری موضوعات دیگر کمک کنی.
همیشه پاسخ‌های دقیق، مفید و دوستانه ارائه می‌دهی.`;

// Function to get next API key
function getNextApiKey() {
  if (ALL_GEMINI_API_KEYS.length === 0) {
    throw new Error('No Gemini API keys configured');
  }
  const key = ALL_GEMINI_API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % ALL_GEMINI_API_KEYS.length;
  return key;
}

// Initialize Gemini client
function getGeminiClient() {
  const apiKey = getNextApiKey();
  return new GoogleGenerativeAI(apiKey);
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], model = 'gemini-2.5-flash' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const genAI = getGeminiClient();
    const geminiModel = genAI.getGenerativeModel({ model });

    // Prepare conversation history
    const chat = geminiModel.startChat({
      history: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.7,
      },
    });

    // Send message with system prompt
    const result = await chat.sendMessage([
      { text: BASE_RULES_FA },
      { text: message }
    ]);

    const response = await result.response;
    const text = response.text();

    res.json({
      response: text,
      model: model
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Image generation endpoint
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, model = 'gemini-2.5-flash' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const genAI = getGeminiClient();
    const geminiModel = genAI.getGenerativeModel({ model });

    const result = await geminiModel.generateContent([
      { text: `Generate an image based on this description: ${prompt}` }
    ]);

    const response = await result.response;
    const image = response.candidates[0]?.content?.parts[0]?.inlineData;

    if (!image) {
      return res.status(500).json({ error: 'Failed to generate image' });
    }

    res.json({
      image: image.data,
      mimeType: image.mimeType
    });

  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Search endpoint (using Gemini's web search capability)
app.post('/api/search', async (req, res) => {
  try {
    const { query, model = 'gemini-2.5-flash' } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const genAI = getGeminiClient();
    const geminiModel = genAI.getGenerativeModel({ 
      model,
      tools: [{ webSearch: {} }]
    });

    const result = await geminiModel.generateContent([
      { text: `Search the web for: ${query}. Provide a comprehensive answer based on current information.` }
    ]);

    const response = await result.response;
    const text = response.text();

    res.json({
      response: text,
      model: model
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Simple Chat Server is running' });
});

// Serve static files for the frontend
app.use(express.static('client/dist'));

// Catch all route to serve the frontend
app.get('*', (req, res) => {
  res.sendFile('client/dist/index.html', { root: '.' });
});

app.listen(PORT, () => {
  console.log(`Simple Chat Server running on port ${PORT}`);
  console.log(`Available models: gemini-2.5-flash, gemini-2.5-pro`);
  console.log(`API Keys configured: ${ALL_GEMINI_API_KEYS.length}`);
});

module.exports = app;