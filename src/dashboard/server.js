const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'لوحة التحكم تعمل بشكل صحيح (Dashboard is running)',
    timestamp: new Date().toISOString()
  });
});

// Bot stats
app.get('/api/bot/stats', (req, res) => {
  res.json({
    status: 'success',
    data: {
      guilds: 42,
      users: 15000,
      commands: 15,
      uptime: process.uptime(),
      language: 'عربي (Arabic)'
    }
  });
});

// Commands list
app.get('/api/bot/commands', (req, res) => {
  res.json({
    status: 'success',
    commands: [
      {
        name: 'help',
        description: 'عرض المساعدة (Show help)',
        category: 'عام'
      },
      {
        name: 'credits',
        description: 'فحص الكريدت (Check credits)',
        category: 'اقتصادي'
      },
      {
        name: 'balance',
        description: 'فحص الرصيد (Check balance)',
        category: 'اقتصادي'
      }
    ]
  });
});

// Dashboard main page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>لوحة التحكم - Bot Dashboard</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
        }
        .container {
          background: white;
          border-radius: 10px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          padding: 40px;
          max-width: 600px;
          width: 90%;
        }
        h1 {
          text-align: center;
          color: #667eea;
          margin-bottom: 10px;
        }
        .subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 30px;
          font-size: 14px;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-box {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }
        .stat-box .value {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .stat-box .label {
          font-size: 12px;
          opacity: 0.9;
        }
        .commands-list {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .commands-list h3 {
          color: #667eea;
          margin-bottom: 15px;
        }
        .command-item {
          background: white;
          padding: 12px;
          margin-bottom: 10px;
          border-right: 4px solid #667eea;
          border-radius: 4px;
        }
        .command-item .name {
          font-weight: bold;
          color: #333;
        }
        .command-item .desc {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }
        button {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        button:hover {
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🤖 لوحة التحكم</h1>
        <p class="subtitle">Bot Dashboard - نظام عالمي آمن</p>
        
        <div class="stats" id="stats-container">
          <div class="stat-box">
            <div class="value">42</div>
            <div class="label">سيرفرات</div>
          </div>
          <div class="stat-box">
            <div class="value">15K</div>
            <div class="label">مستخدمين</div>
          </div>
          <div class="stat-box">
            <div class="value">15</div>
            <div class="label">أوامر</div>
          </div>
          <div class="stat-box">
            <div class="value">✅</div>
            <div class="label">نشط</div>
          </div>
        </div>

        <div class="commands-list">
          <h3>📋 الأوامر المتاحة</h3>
          <div class="command-item">
            <div class="name">/help</div>
            <div class="desc">عرض المساعدة والأوامر المتاحة</div>
          </div>
          <div class="command-item">
            <div class="name">/credits</div>
            <div class="desc">فحص رصيد الكريدت الخاص بك</div>
          </div>
          <div class="command-item">
            <div class="name">/balance</div>
            <div class="desc">فحص الرصيد المالي</div>
          </div>
        </div>

        <button onclick="alert('مرحبا! البوت يعمل بشكل صحيح ✨')">اختبر البوت</button>
      </div>

      <script>
        fetch('/api/bot/stats')
          .then(res => res.json())
          .then(data => console.log('Bot Stats:', data))
          .catch(err => console.error('Error:', err));
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 لوحة التحكم تعمل على | Dashboard running on: http://0.0.0.0:${PORT}`);
});

module.exports = app;
