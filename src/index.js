const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bot Dashboard API is running' });
});

app.get('/api/bot/stats', (req, res) => {
  res.json({
    status: 'ok',
    guilds: 0,
    users: 0,
    commands: 0,
    uptime: process.uptime()
  });
});

app.get('/api/bot/commands', (req, res) => {
  res.json({
    status: 'ok',
    commands: [
      { name: 'help', description: 'Show help information' },
      { name: 'credits', description: 'Check your credits' },
      { name: 'balance', description: 'Check balance' }
    ]
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Dashboard running on http://0.0.0.0:${PORT}`);
});
