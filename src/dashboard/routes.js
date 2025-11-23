const express = require('express');
const router = express.Router();
const axios = require('axios');

try {
  const settingsDB = require('../utils/settingsdb');
} catch(e) {
  console.log('Warning: settingsDB not loaded');
}

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || 'http://localhost:5000/callback';

if (!CLIENT_ID) {
  console.error('⚠️ WARNING: DISCORD_CLIENT_ID not set!');
}

// Middleware: Check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

// Home redirect
router.get('/', (req, res) => {
  res.redirect('/login');
});

// Login page
router.get('/login', (req, res) => {
  const oauthURL = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify+guilds`;
  
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>تسجيل الدخول | Bot Dashboard</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .login-container {
          background: white;
          border-radius: 15px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          text-align: center;
          max-width: 400px;
          width: 90%;
        }
        .login-container h1 {
          color: #333;
          margin-bottom: 10px;
          font-size: 28px;
        }
        .login-container p {
          color: #666;
          margin-bottom: 30px;
          font-size: 14px;
        }
        .login-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 25px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
          text-decoration: none;
          display: inline-block;
        }
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        .info {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="login-container">
        <h1>🤖 PrimeBot</h1>
        <p>لوحة التحكم المتقدمة</p>
        <a href="${oauthURL}" class="login-btn">تسجيل الدخول عبر Discord</a>
        <div class="info">
          <p>سيتم نقلك إلى Discord للتحقق من هويتك</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// OAuth Callback
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.redirect('/login?error=no_code');
  }

  try {
    // Get access token
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        scope: 'identify guilds'
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const accessToken = tokenResponse.data.access_token;

    // Get user data
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const user = userResponse.data;

    // Get user guilds
    const guildsResponse = await axios.get('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const guilds = guildsResponse.data;

    // Store user in session
    req.session.user = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      accessToken
    };

    req.session.guilds = guilds;

    res.redirect('/dashboard');
  } catch (error) {
    console.error('OAuth error:', error);
    res.redirect('/login?error=auth_failed');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Dashboard main page
router.get('/dashboard', requireAuth, (req, res) => {
  const user = req.session.user;
  const guilds = req.session.guilds || [];
  
  const adminGuilds = guilds.filter(g => (g.permissions & 0x8) === 0x8); // Administrator permission

  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>لوحة التحكم | PrimeBot</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f5f5f5;
          color: #333;
        }
        .navbar {
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        .navbar h1 { font-size: 24px; }
        .nav-links {
          display: flex;
          gap: 20px;
          align-items: center;
        }
        .nav-links a {
          color: #fff;
          text-decoration: none;
          transition: 0.3s;
        }
        .nav-links a:hover { color: #667eea; }
        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
        }
        .logout-btn {
          background: #ff6b6b;
          padding: 8px 15px;
          border-radius: 5px;
          cursor: pointer;
          border: none;
          color: white;
          transition: 0.3s;
        }
        .logout-btn:hover { background: #ff5252; }
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #667eea;
        }
        .stat-label {
          font-size: 12px;
          color: #999;
          margin-top: 5px;
        }
        .guilds-title {
          font-size: 20px;
          margin-bottom: 20px;
          font-weight: bold;
        }
        .guilds-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .guild-card {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: 0.3s;
        }
        .guild-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        }
        .guild-name {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .guild-info {
          font-size: 12px;
          color: #666;
          margin-bottom: 15px;
        }
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: 0.3s;
          font-weight: bold;
          text-decoration: none;
          display: inline-block;
        }
        .btn-primary {
          background: #667eea;
          color: white;
        }
        .btn-primary:hover { background: #5568d3; }
        .btn-secondary {
          background: #e0e0e0;
          color: #333;
        }
        .btn-secondary:hover { background: #d0d0d0; }
        .btn-group {
          display: flex;
          gap: 10px;
        }
      </style>
    </head>
    <body>
      <div class="navbar">
        <h1>🤖 PrimeBot Dashboard</h1>
        <div class="nav-links">
          <a href="/dashboard">الرئيسية</a>
          <a href="/servers">السيرفرات</a>
          <a href="/commands">الأوامر</a>
          <div class="user-info">
            <span>${user.username}</span>
            <button class="logout-btn" onclick="location.href='/logout'">تسجيل الخروج</button>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="stats">
          <div class="stat-card">
            <div class="stat-value">${adminGuilds.length}</div>
            <div class="stat-label">السيرفرات المدارة</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">45</div>
            <div class="stat-label">الأوامر المتاحة</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">✅</div>
            <div class="stat-label">حالة البوت</div>
          </div>
        </div>

        <div class="guilds-title">🏰 السيرفرات التي أنت أدمن فيها</div>
        <div class="guilds-grid">
          ${adminGuilds.map(guild => `
            <div class="guild-card">
              <div class="guild-name">${guild.name}</div>
              <div class="guild-info">
                ID: ${guild.id}<br>
                صاحب: ${guild.owner ? '✅' : '❌'}
              </div>
              <div class="btn-group">
                <a href="/server/${guild.id}" class="btn btn-primary">إدارة</a>
                <a href="/server/${guild.id}/settings" class="btn btn-secondary">إعدادات</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </body>
    </html>
  `);
});

// Server management page
router.get('/server/:guildId', requireAuth, (req, res) => {
  const { guildId } = req.params;
  const guilds = req.session.guilds || [];
  const guild = guilds.find(g => g.id === guildId);

  if (!guild) {
    return res.status(404).send('السيرفر غير موجود');
  }

  const settings = settingsDB.getServerSettings(guildId);

  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>إدارة ${guild.name} | PrimeBot</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f5f5f5;
          color: #333;
        }
        .navbar {
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .navbar h1 { font-size: 20px; }
        .nav-links a {
          color: #fff;
          text-decoration: none;
          margin: 0 15px;
          transition: 0.3s;
        }
        .nav-links a:hover { color: #667eea; }
        .container {
          max-width: 1200px;
          margin: 20px auto;
          padding: 0 20px;
        }
        .sidebar {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .menu {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .menu a {
          display: block;
          padding: 10px 15px;
          border-radius: 5px;
          color: #333;
          text-decoration: none;
          margin-bottom: 10px;
          transition: 0.3s;
        }
        .menu a:hover {
          background: #667eea;
          color: white;
        }
        .content {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .section { margin-bottom: 30px; }
        .section h2 {
          color: #667eea;
          margin-bottom: 20px;
          border-bottom: 2px solid #667eea;
          padding-bottom: 10px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
        }
        .form-group input, .form-group textarea, .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-family: inherit;
        }
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: 0.3s;
        }
        .btn-primary { background: #667eea; color: white; }
        .btn-primary:hover { background: #5568d3; }
        .btn-danger { background: #ff6b6b; color: white; }
        .btn-danger:hover { background: #ff5252; }
        .list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: #f9f9f9;
          border-radius: 5px;
          margin-bottom: 10px;
        }
        .list-item .info {
          flex: 1;
        }
        .list-item .actions {
          display: flex;
          gap: 10px;
        }
        .list-item .btn {
          padding: 8px 15px;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="navbar">
        <h1>🏰 ${guild.name}</h1>
        <nav class="nav-links">
          <a href="/dashboard">الرئيسية</a>
          <a href="/logout">تسجيل الخروج</a>
        </nav>
      </div>

      <div class="container">
        <div class="sidebar">
          <div class="menu">
            <a href="/server/${guildId}">📊 نظرة عامة</a>
            <a href="/server/${guildId}/settings">⚙️ الإعدادات</a>
            <a href="/server/${guildId}/auto-replies">🔄 الردود التلقائية</a>
            <a href="/server/${guildId}/shortcuts">⌨️ الاختصارات</a>
            <a href="/server/${guildId}/logs">📋 السجلات</a>
          </div>

          <div class="content">
            <h2>📊 نظرة عامة</h2>
            <div class="section">
              <p><strong>اسم السيرفر:</strong> ${guild.name}</p>
              <p><strong>ID:</strong> ${guild.id}</p>
              <p><strong>حالة البوت:</strong> <span style="color: green;">✅ نشط</span></p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Auto-replies management
router.get('/server/:guildId/auto-replies', requireAuth, (req, res) => {
  const { guildId } = req.params;
  const settings = settingsDB.getServerSettings(guildId);

  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>الردود التلقائية | PrimeBot</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f5f5f5;
          color: #333;
        }
        .navbar {
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .container {
          max-width: 1000px;
          margin: 20px auto;
          padding: 0 20px;
        }
        .card {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }
        h2 { color: #667eea; margin-bottom: 20px; }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
        }
        .form-group input, .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-family: inherit;
        }
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }
        .btn-primary { background: #667eea; color: white; }
        .btn-danger { background: #ff6b6b; color: white; }
        .reply-item {
          background: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .reply-content {
          flex: 1;
        }
        .reply-content p {
          margin-bottom: 5px;
          font-size: 14px;
        }
        .reply-trigger {
          font-weight: bold;
          color: #667eea;
        }
      </style>
    </head>
    <body>
      <div class="navbar">
        <h1>🔄 الردود التلقائية</h1>
        <a href="/dashboard" style="color: white; text-decoration: none;">العودة</a>
      </div>

      <div class="container">
        <div class="card">
          <h2>إضافة رد تلقائي جديد</h2>
          <form id="addReplyForm">
            <div class="form-group">
              <label>النص المثير (Trigger):</label>
              <input type="text" name="trigger" placeholder="مثال: hello" required>
            </div>
            <div class="form-group">
              <label>الرد (Response):</label>
              <textarea name="response" placeholder="مثال: مرحباً!" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">إضافة</button>
          </form>
        </div>

        <div class="card">
          <h2>الردود التلقائية الموجودة (${settings.autoReplies.length})</h2>
          ${settings.autoReplies.map(reply => `
            <div class="reply-item">
              <div class="reply-content">
                <p class="reply-trigger">Trigger: ${reply.trigger}</p>
                <p>Response: ${reply.response}</p>
              </div>
              <button class="btn btn-danger" onclick="deleteReply(${reply.id})">حذف</button>
            </div>
          `).join('')}
        </div>
      </div>

      <script>
        const guildId = '${guildId}';
        document.getElementById('addReplyForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          await fetch(\`/api/server/\${guildId}/auto-replies\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData))
          });
          location.reload();
        });

        async function deleteReply(id) {
          if (confirm('هل تريد حذف هذا الرد؟')) {
            await fetch(\`/api/server/\${guildId}/auto-replies/\${id}\`, { method: 'DELETE' });
            location.reload();
          }
        }
      </script>
    </body>
    </html>
  `);
});

// API: Add auto-reply
router.post('/api/server/:guildId/auto-replies', (req, res) => {
  const { guildId } = req.params;
  const { trigger, response } = req.body;

  settingsDB.addAutoReply(guildId, trigger, response);
  res.json({ success: true });
});

// API: Delete auto-reply
router.delete('/api/server/:guildId/auto-replies/:id', (req, res) => {
  const { guildId, id } = req.params;
  settingsDB.deleteAutoReply(guildId, parseInt(id));
  res.json({ success: true });
});

// API: Add shortcut
router.post('/api/server/:guildId/shortcuts', (req, res) => {
  const { guildId } = req.params;
  const { name, command } = req.body;

  settingsDB.addShortcut(guildId, name, command);
  res.json({ success: true });
});

// API: Delete shortcut
router.delete('/api/server/:guildId/shortcuts/:id', (req, res) => {
  const { guildId, id } = req.params;
  settingsDB.deleteShortcut(guildId, parseInt(id));
  res.json({ success: true });
});

// Shortcuts page
router.get('/server/:guildId/shortcuts', requireAuth, (req, res) => {
  const { guildId } = req.params;
  const settings = settingsDB.getServerSettings(guildId);

  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>الاختصارات | PrimeBot</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f5f5f5;
          color: #333;
        }
        .navbar {
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .container {
          max-width: 1000px;
          margin: 20px auto;
          padding: 0 20px;
        }
        .card {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }
        h2 { color: #667eea; margin-bottom: 20px; }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
        }
        .form-group input, .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-family: inherit;
        }
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }
        .btn-primary { background: #667eea; color: white; }
        .btn-danger { background: #ff6b6b; color: white; }
        .shortcut-item {
          background: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .shortcut-content {
          flex: 1;
        }
        .shortcut-name {
          font-weight: bold;
          color: #667eea;
          font-size: 16px;
        }
        .shortcut-command {
          color: #666;
          font-size: 14px;
          margin-top: 5px;
        }
      </style>
    </head>
    <body>
      <div class="navbar">
        <h1>⌨️ الاختصارات</h1>
        <a href="/dashboard" style="color: white; text-decoration: none;">العودة</a>
      </div>

      <div class="container">
        <div class="card">
          <h2>إضافة اختصار جديد</h2>
          <form id="addShortcutForm">
            <div class="form-group">
              <label>اسم الاختصار:</label>
              <input type="text" name="name" placeholder="مثال: !hi" required>
            </div>
            <div class="form-group">
              <label>الأمر (Command):</label>
              <textarea name="command" placeholder="مثال: /help" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">إضافة</button>
          </form>
        </div>

        <div class="card">
          <h2>الاختصارات الموجودة (${settings.shortcuts.length})</h2>
          ${settings.shortcuts.map(shortcut => `
            <div class="shortcut-item">
              <div class="shortcut-content">
                <div class="shortcut-name">${shortcut.name}</div>
                <div class="shortcut-command">${shortcut.command}</div>
              </div>
              <button class="btn btn-danger" onclick="deleteShortcut(${shortcut.id})">حذف</button>
            </div>
          `).join('')}
        </div>
      </div>

      <script>
        const guildId = '${guildId}';
        document.getElementById('addShortcutForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          await fetch(\`/api/server/\${guildId}/shortcuts\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData))
          });
          location.reload();
        });

        async function deleteShortcut(id) {
          if (confirm('هل تريد حذف هذا الاختصار؟')) {
            await fetch(\`/api/server/\${guildId}/shortcuts/\${id}\`, { method: 'DELETE' });
            location.reload();
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Include dashboard routes
const dashboardRoutes = require('./dashboard-routes');
router.use('/', dashboardRoutes);

module.exports = router;
