const express = require('express');
const router = express.Router();
const dashboardDB = require('../utils/dashboarddb');

const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

// Welcome System
router.get('/server/:guildId/welcome', requireAuth, (req, res) => {
  const { guildId } = req.params;
  const settings = dashboardDB.getGuildSettings(guildId);
  const welcome = settings.welcome;

  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>نظام الترحيب | PrimeBot</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Arial;
          background: #f5f5f5;
          color: #333;
        }
        .navbar {
          background: #1a1a2e;
          color: white;
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .container {
          max-width: 1200px;
          margin: 20px auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 20px;
        }
        .sidebar {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          height: fit-content;
        }
        .sidebar a {
          display: block;
          padding: 12px 15px;
          margin-bottom: 10px;
          border-radius: 5px;
          color: #333;
          text-decoration: none;
          transition: 0.3s;
          font-size: 14px;
        }
        .sidebar a:hover, .sidebar a.active {
          background: #667eea;
          color: white;
        }
        .content {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h2 {
          color: #667eea;
          margin-bottom: 25px;
          border-bottom: 2px solid #667eea;
          padding-bottom: 15px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
          color: #333;
        }
        .form-group input, .form-group textarea, .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-family: inherit;
          font-size: 14px;
        }
        .toggle {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .toggle input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
        .btn {
          padding: 12px 25px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: 0.3s;
          font-size: 14px;
        }
        .btn-save {
          background: #51cf66;
          color: white;
        }
        .btn-save:hover {
          background: #40c057;
        }
      </style>
    </head>
    <body>
      <div class="navbar">
        <h1>🤖 PrimeBot Dashboard</h1>
        <a href="/logout" style="color: white; text-decoration: none;">تسجيل الخروج</a>
      </div>

      <div class="container">
        <div class="sidebar">
          <a href="/server/${guildId}/welcome" class="active">✉️ نظام الترحيب</a>
          <a href="/server/${guildId}/leave">👋 نظام المغادرة</a>
          <a href="/server/${guildId}/autoroles">🎭 الأدوار التلقائية</a>
          <a href="/server/${guildId}/moderation">🛡️ الإدارة</a>
          <a href="/server/${guildId}/tickets">🎫 نظام التكاتة</a>
          <a href="/server/${guildId}/logs">📋 السجلات</a>
          <a href="/server/${guildId}/antispam">🚫 مكافحة الإساءة</a>
          <a href="/server/${guildId}/commands">⌨️ الأوامر المخصصة</a>
          <a href="/server/${guildId}/settings">⚙️ الإعدادات العامة</a>
          <a href="/server/${guildId}/stats">📊 إحصائيات البوت</a>
        </div>

        <div class="content">
          <h2>✉️ نظام الترحيب</h2>
          
          <form id="welcomeForm">
            <div class="form-group">
              <label class="toggle">
                <input type="checkbox" name="enabled" ${welcome.enabled ? 'checked' : ''}>
                <span>تفعيل نظام الترحيب</span>
              </label>
            </div>

            <div class="form-group">
              <label>قناة الترحيب:</label>
              <input type="text" name="channel" placeholder="#welcome" value="${welcome.channel || ''}" required>
            </div>

            <div class="form-group">
              <label>رسالة الترحيب:</label>
              <textarea name="message" placeholder="مثال: مرحباً {user}! أهلاً بك في السيرفر" required>${welcome.message || ''}</textarea>
            </div>

            <div class="form-group">
              <label>صورة الترحيب (رابط):</label>
              <input type="text" name="image" placeholder="https://..." value="${welcome.image || ''}">
            </div>

            <button type="submit" class="btn btn-save">💾 حفظ الإعدادات</button>
          </form>
        </div>
      </div>

      <script>
        document.getElementById('welcomeForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          await fetch(\`/api/server/${guildId}/welcome\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData))
          });
          alert('تم الحفظ بنجاح ✅');
        });
      </script>
    </body>
    </html>
  `);
});

// Leave System
router.get('/server/:guildId/leave', requireAuth, (req, res) => {
  const { guildId } = req.params;
  const settings = dashboardDB.getGuildSettings(guildId);
  const leave = settings.leave;

  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>نظام المغادرة | PrimeBot</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Arial;
          background: #f5f5f5;
          color: #333;
        }
        .navbar {
          background: #1a1a2e;
          color: white;
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
        }
        .container {
          max-width: 1200px;
          margin: 20px auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 20px;
        }
        .sidebar {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          height: fit-content;
        }
        .sidebar a {
          display: block;
          padding: 12px 15px;
          margin-bottom: 10px;
          border-radius: 5px;
          color: #333;
          text-decoration: none;
          transition: 0.3s;
          font-size: 14px;
        }
        .sidebar a:hover, .sidebar a.active {
          background: #667eea;
          color: white;
        }
        .content {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h2 {
          color: #667eea;
          margin-bottom: 25px;
          border-bottom: 2px solid #667eea;
          padding-bottom: 15px;
        }
        .form-group {
          margin-bottom: 20px;
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
        .toggle {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .toggle input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
        .btn {
          padding: 12px 25px;
          background: #51cf66;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }
        .btn:hover { background: #40c057; }
      </style>
    </head>
    <body>
      <div class="navbar">
        <h1>🤖 PrimeBot Dashboard</h1>
        <a href="/logout" style="color: white; text-decoration: none;">تسجيل الخروج</a>
      </div>

      <div class="container">
        <div class="sidebar">
          <a href="/server/${guildId}/welcome">✉️ نظام الترحيب</a>
          <a href="/server/${guildId}/leave" class="active">👋 نظام المغادرة</a>
          <a href="/server/${guildId}/autoroles">🎭 الأدوار التلقائية</a>
          <a href="/server/${guildId}/moderation">🛡️ الإدارة</a>
          <a href="/server/${guildId}/tickets">🎫 نظام التكاتة</a>
          <a href="/server/${guildId}/logs">📋 السجلات</a>
          <a href="/server/${guildId}/antispam">🚫 مكافحة الإساءة</a>
          <a href="/server/${guildId}/commands">⌨️ الأوامر المخصصة</a>
          <a href="/server/${guildId}/settings">⚙️ الإعدادات العامة</a>
          <a href="/server/${guildId}/stats">📊 إحصائيات البوت</a>
        </div>

        <div class="content">
          <h2>👋 نظام المغادرة</h2>
          
          <form id="leaveForm">
            <div class="form-group">
              <label class="toggle">
                <input type="checkbox" name="enabled" ${leave.enabled ? 'checked' : ''}>
                <span>تفعيل نظام المغادرة</span>
              </label>
            </div>

            <div class="form-group">
              <label>قناة المغادرة:</label>
              <input type="text" name="channel" placeholder="#goodbye" value="${leave.channel || ''}" required>
            </div>

            <div class="form-group">
              <label>رسالة المغادرة:</label>
              <textarea name="message" placeholder="مثال: وداعاً {user}! حتى نلتقي قريباً" required>${leave.message || ''}</textarea>
            </div>

            <button type="submit" class="btn">💾 حفظ الإعدادات</button>
          </form>
        </div>
      </div>

      <script>
        document.getElementById('leaveForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          await fetch(\`/api/server/${guildId}/leave\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData))
          });
          alert('تم الحفظ بنجاح ✅');
        });
      </script>
    </body>
    </html>
  `);
});

// Moderation
router.get('/server/:guildId/moderation', requireAuth, (req, res) => {
  const { guildId } = req.params;
  const settings = dashboardDB.getGuildSettings(guildId);
  const mod = settings.moderation;

  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>الإدارة | PrimeBot</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Arial;
          background: #f5f5f5;
        }
        .navbar {
          background: #1a1a2e;
          color: white;
          padding: 15px 30px;
        }
        .container {
          max-width: 1200px;
          margin: 20px auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 20px;
        }
        .sidebar {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          height: fit-content;
        }
        .sidebar a {
          display: block;
          padding: 12px 15px;
          margin-bottom: 10px;
          border-radius: 5px;
          color: #333;
          text-decoration: none;
          transition: 0.3s;
        }
        .sidebar a.active {
          background: #667eea;
          color: white;
        }
        .content {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h2 {
          color: #667eea;
          margin-bottom: 25px;
          border-bottom: 2px solid #667eea;
          padding-bottom: 15px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
        }
        .form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .btn {
          padding: 12px 25px;
          background: #51cf66;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="navbar">
        <h1>🤖 PrimeBot Dashboard</h1>
      </div>

      <div class="container">
        <div class="sidebar">
          <a href="/server/${guildId}/welcome">✉️ نظام الترحيب</a>
          <a href="/server/${guildId}/leave">👋 نظام المغادرة</a>
          <a href="/server/${guildId}/moderation" class="active">🛡️ الإدارة</a>
        </div>

        <div class="content">
          <h2>🛡️ الإدارة</h2>
          <form id="modForm">
            <div class="form-group">
              <label>قناة السجلات:</label>
              <input type="text" name="logChannel" placeholder="#logs" value="${mod.logChannel || ''}">
            </div>
            <div class="form-group">
              <label>رتبة الميوت:</label>
              <input type="text" name="muteRole" placeholder="Muted" value="${mod.muteRole || ''}">
            </div>
            <button type="submit" class="btn">💾 حفظ</button>
          </form>
        </div>
      </div>

      <script>
        document.getElementById('modForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          await fetch(\`/api/server/${guildId}/moderation\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData))
          });
          alert('تم الحفظ ✅');
        });
      </script>
    </body>
    </html>
  `);
});

// API Endpoints
router.post('/api/server/:guildId/welcome', (req, res) => {
  const { guildId } = req.params;
  const settings = dashboardDB.getGuildSettings(guildId);
  settings.welcome = req.body;
  dashboardDB.saveGuildSettings(guildId, settings);
  res.json({ success: true });
});

router.post('/api/server/:guildId/leave', (req, res) => {
  const { guildId } = req.params;
  const settings = dashboardDB.getGuildSettings(guildId);
  settings.leave = req.body;
  dashboardDB.saveGuildSettings(guildId, settings);
  res.json({ success: true });
});

router.post('/api/server/:guildId/moderation', (req, res) => {
  const { guildId } = req.params;
  const settings = dashboardDB.getGuildSettings(guildId);
  settings.moderation = req.body;
  dashboardDB.saveGuildSettings(guildId, settings);
  res.json({ success: true });
});

// Auto Roles
router.get('/server/:guildId/autoroles', requireAuth, (req, res) => {
  const { guildId } = req.params;
  const settings = dashboardDB.getGuildSettings(guildId);
  
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>الأدوار التلقائية | PrimeBot</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial; background: #f5f5f5; }
        .navbar { background: #1a1a2e; color: white; padding: 15px 30px; }
        .container { max-width: 1200px; margin: 20px auto; padding: 0 20px; display: grid; grid-template-columns: 250px 1fr; gap: 20px; }
        .sidebar { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); height: fit-content; }
        .sidebar a { display: block; padding: 12px 15px; margin-bottom: 10px; border-radius: 5px; color: #333; text-decoration: none; transition: 0.3s; }
        .sidebar a.active { background: #667eea; color: white; }
        .content { background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h2 { color: #667eea; margin-bottom: 25px; border-bottom: 2px solid #667eea; padding-bottom: 15px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: bold; }
        .form-group input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        .btn { padding: 12px 25px; background: #51cf66; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="navbar"><h1>🤖 PrimeBot Dashboard</h1></div>
      <div class="container">
        <div class="sidebar">
          <a href="/server/${guildId}/welcome">✉️ نظام الترحيب</a>
          <a href="/server/${guildId}/leave">👋 نظام المغادرة</a>
          <a href="/server/${guildId}/autoroles" class="active">🎭 الأدوار التلقائية</a>
          <a href="/server/${guildId}/moderation">🛡️ الإدارة</a>
          <a href="/server/${guildId}/tickets">🎫 نظام التكاتة</a>
          <a href="/server/${guildId}/logs">📋 السجلات</a>
          <a href="/server/${guildId}/antispam">🚫 مكافحة الإساءة</a>
          <a href="/server/${guildId}/commands">⌨️ الأوامر المخصصة</a>
          <a href="/server/${guildId}/settings">⚙️ الإعدادات العامة</a>
          <a href="/server/${guildId}/stats">📊 إحصائيات البوت</a>
        </div>
        <div class="content">
          <h2>🎭 الأدوار التلقائية</h2>
          <form id="autoRolesForm">
            <div class="form-group">
              <label>رول عند الدخول:</label>
              <input type="text" name="joinRole" placeholder="Member" value="">
            </div>
            <div class="form-group">
              <label>رول للبوتات:</label>
              <input type="text" name="botRole" placeholder="Bot" value="">
            </div>
            <button type="submit" class="btn">💾 حفظ</button>
          </form>
        </div>
      </div>
      <script>
        document.getElementById('autoRolesForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          await fetch(\`/api/server/${guildId}/autoroles\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData))
          });
          alert('تم الحفظ ✅');
        });
      </script>
    </body>
    </html>
  `);
});

// Tickets
router.get('/server/:guildId/tickets', requireAuth, (req, res) => {
  const { guildId } = req.params;
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>نظام التكاتة | PrimeBot</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial; background: #f5f5f5; }
        .navbar { background: #1a1a2e; color: white; padding: 15px 30px; }
        .container { max-width: 1200px; margin: 20px auto; padding: 0 20px; display: grid; grid-template-columns: 250px 1fr; gap: 20px; }
        .sidebar { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); height: fit-content; }
        .sidebar a { display: block; padding: 12px 15px; margin-bottom: 10px; border-radius: 5px; color: #333; text-decoration: none; }
        .sidebar a.active { background: #667eea; color: white; }
        .content { background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h2 { color: #667eea; margin-bottom: 25px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: bold; }
        .form-group input, .form-group select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        .btn { padding: 12px 25px; background: #51cf66; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="navbar"><h1>🎫 نظام التكاتة</h1></div>
      <div class="container">
        <div class="sidebar">
          <a href="/server/${guildId}/welcome">✉️ نظام الترحيب</a>
          <a href="/server/${guildId}/tickets" class="active">🎫 نظام التكاتة</a>
          <a href="/server/${guildId}/logs">📋 السجلات</a>
          <a href="/server/${guildId}/antispam">🚫 مكافحة الإساءة</a>
          <a href="/server/${guildId}/commands">⌨️ الأوامر المخصصة</a>
          <a href="/server/${guildId}/settings">⚙️ الإعدادات العامة</a>
        </div>
        <div class="content">
          <h2>🎫 إعدادات نظام التكاتة</h2>
          <form id="ticketsForm">
            <div class="form-group">
              <label>تفعيل النظام:</label>
              <select name="enabled">
                <option value="true">مفعل</option>
                <option value="false">معطل</option>
              </select>
            </div>
            <div class="form-group">
              <label>فئة التكاتة:</label>
              <input type="text" name="category" placeholder="Tickets">
            </div>
            <button type="submit" class="btn">💾 حفظ</button>
          </form>
        </div>
      </div>
      <script>
        document.getElementById('ticketsForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          await fetch(\`/api/server/${guildId}/tickets\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData))
          });
          alert('تم الحفظ ✅');
        });
      </script>
    </body>
    </html>
  `);
});

// Logs
router.get('/server/:guildId/logs', requireAuth, (req, res) => {
  const { guildId } = req.params;
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>السجلات | PrimeBot</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial; background: #f5f5f5; }
        .navbar { background: #1a1a2e; color: white; padding: 15px 30px; }
        .container { max-width: 1200px; margin: 20px auto; padding: 0 20px; display: grid; grid-template-columns: 250px 1fr; gap: 20px; }
        .sidebar { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); height: fit-content; }
        .sidebar a { display: block; padding: 12px 15px; margin-bottom: 10px; border-radius: 5px; color: #333; text-decoration: none; }
        .sidebar a.active { background: #667eea; color: white; }
        .content { background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h2 { color: #667eea; margin-bottom: 25px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: bold; }
        .form-group input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        .btn { padding: 12px 25px; background: #51cf66; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="navbar"><h1>📋 السجلات</h1></div>
      <div class="container">
        <div class="sidebar">
          <a href="/server/${guildId}/logs" class="active">📋 السجلات</a>
          <a href="/server/${guildId}/antispam">🚫 مكافحة الإساءة</a>
          <a href="/server/${guildId}/commands">⌨️ الأوامر المخصصة</a>
          <a href="/server/${guildId}/settings">⚙️ الإعدادات العامة</a>
        </div>
        <div class="content">
          <h2>📋 إعدادات السجلات</h2>
          <form id="logsForm">
            <div class="form-group">
              <label>قناة السجلات:</label>
              <input type="text" name="logChannel" placeholder="#logs">
            </div>
            <button type="submit" class="btn">💾 حفظ</button>
          </form>
        </div>
      </div>
      <script>
        document.getElementById('logsForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          await fetch(\`/api/server/${guildId}/logs\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData))
          });
          alert('تم الحفظ ✅');
        });
      </script>
    </body>
    </html>
  `);
});

// Anti-Spam
router.get('/server/:guildId/antispam', requireAuth, (req, res) => {
  const { guildId } = req.params;
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>مكافحة الإساءة | PrimeBot</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial; background: #f5f5f5; }
        .navbar { background: #1a1a2e; color: white; padding: 15px 30px; }
        .container { max-width: 1200px; margin: 20px auto; padding: 0 20px; display: grid; grid-template-columns: 250px 1fr; gap: 20px; }
        .sidebar { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); height: fit-content; }
        .sidebar a { display: block; padding: 12px 15px; margin-bottom: 10px; border-radius: 5px; color: #333; text-decoration: none; }
        .sidebar a.active { background: #667eea; color: white; }
        .content { background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h2 { color: #667eea; margin-bottom: 25px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: bold; }
        .form-group input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        .btn { padding: 12px 25px; background: #51cf66; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="navbar"><h1>🚫 مكافحة الإساءة</h1></div>
      <div class="container">
        <div class="sidebar">
          <a href="/server/${guildId}/antispam" class="active">🚫 مكافحة الإساءة</a>
          <a href="/server/${guildId}/commands">⌨️ الأوامر المخصصة</a>
          <a href="/server/${guildId}/settings">⚙️ الإعدادات العامة</a>
        </div>
        <div class="content">
          <h2>🚫 إعدادات مكافحة الإساءة</h2>
          <form id="antiSpamForm">
            <div class="form-group">
              <label>عدد الرسائل المسموحة:</label>
              <input type="number" name="messages" value="5">
            </div>
            <div class="form-group">
              <label>الفترة الزمنية (بالثواني):</label>
              <input type="number" name="time" value="10">
            </div>
            <button type="submit" class="btn">💾 حفظ</button>
          </form>
        </div>
      </div>
      <script>
        document.getElementById('antiSpamForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          await fetch(\`/api/server/${guildId}/antispam\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData))
          });
          alert('تم الحفظ ✅');
        });
      </script>
    </body>
    </html>
  `);
});

// Custom Commands
router.get('/server/:guildId/commands', requireAuth, (req, res) => {
  const { guildId } = req.params;
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>الأوامر المخصصة | PrimeBot</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial; background: #f5f5f5; }
        .navbar { background: #1a1a2e; color: white; padding: 15px 30px; }
        .container { max-width: 1200px; margin: 20px auto; padding: 0 20px; display: grid; grid-template-columns: 250px 1fr; gap: 20px; }
        .sidebar { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); height: fit-content; }
        .sidebar a { display: block; padding: 12px 15px; margin-bottom: 10px; border-radius: 5px; color: #333; text-decoration: none; }
        .sidebar a.active { background: #667eea; color: white; }
        .content { background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h2 { color: #667eea; margin-bottom: 25px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: bold; }
        .form-group input, .form-group textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        .btn { padding: 12px 25px; background: #51cf66; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="navbar"><h1>⌨️ الأوامر المخصصة</h1></div>
      <div class="container">
        <div class="sidebar">
          <a href="/server/${guildId}/commands" class="active">⌨️ الأوامر المخصصة</a>
          <a href="/server/${guildId}/settings">⚙️ الإعدادات العامة</a>
        </div>
        <div class="content">
          <h2>⌨️ إضافة أمر مخصص</h2>
          <form id="commandForm">
            <div class="form-group">
              <label>اسم الأمر:</label>
              <input type="text" name="name" placeholder="greet" required>
            </div>
            <div class="form-group">
              <label>الرد:</label>
              <textarea name="response" placeholder="مرحباً!" required></textarea>
            </div>
            <button type="submit" class="btn">➕ إضافة</button>
          </form>
        </div>
      </div>
      <script>
        document.getElementById('commandForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          await fetch(\`/api/server/${guildId}/commands\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData))
          });
          alert('تم الإضافة ✅');
          e.target.reset();
        });
      </script>
    </body>
    </html>
  `);
});

// General Settings
router.get('/server/:guildId/settings', requireAuth, (req, res) => {
  const { guildId } = req.params;
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>الإعدادات العامة | PrimeBot</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial; background: #f5f5f5; }
        .navbar { background: #1a1a2e; color: white; padding: 15px 30px; }
        .container { max-width: 1200px; margin: 20px auto; padding: 0 20px; display: grid; grid-template-columns: 250px 1fr; gap: 20px; }
        .sidebar { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); height: fit-content; }
        .sidebar a { display: block; padding: 12px 15px; margin-bottom: 10px; border-radius: 5px; color: #333; text-decoration: none; }
        .sidebar a.active { background: #667eea; color: white; }
        .content { background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h2 { color: #667eea; margin-bottom: 25px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: bold; }
        .form-group input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        .btn { padding: 12px 25px; background: #51cf66; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="navbar"><h1>⚙️ الإعدادات العامة</h1></div>
      <div class="container">
        <div class="sidebar">
          <a href="/server/${guildId}/settings" class="active">⚙️ الإعدادات العامة</a>
        </div>
        <div class="content">
          <h2>⚙️ الإعدادات العامة</h2>
          <form id="settingsForm">
            <div class="form-group">
              <label>البادئة (Prefix):</label>
              <input type="text" name="prefix" value="!" required>
            </div>
            <div class="form-group">
              <label>اللغة:</label>
              <input type="text" name="language" value="عربي" required>
            </div>
            <button type="submit" class="btn">💾 حفظ</button>
          </form>
        </div>
      </div>
      <script>
        document.getElementById('settingsForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          await fetch(\`/api/server/${guildId}/settings\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData))
          });
          alert('تم الحفظ ✅');
        });
      </script>
    </body>
    </html>
  `);
});

// Bot Stats
router.get('/server/:guildId/stats', requireAuth, (req, res) => {
  const { guildId } = req.params;
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>إحصائيات البوت | PrimeBot</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial; background: #f5f5f5; }
        .navbar { background: #1a1a2e; color: white; padding: 15px 30px; }
        .container { max-width: 1200px; margin: 20px auto; padding: 0 20px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        .stat-card { background: white; border-radius: 10px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
        .stat-value { font-size: 32px; font-weight: bold; color: #667eea; }
        .stat-label { font-size: 14px; color: #666; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="navbar"><h1>📊 إحصائيات البوت</h1></div>
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">45</div>
            <div class="stat-label">الأوامر الكلية</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">✅</div>
            <div class="stat-label">حالة البوت</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">24h</div>
            <div class="stat-label">Uptime</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">v1.0</div>
            <div class="stat-label">النسخة</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// API: Save autoroles
router.post('/api/server/:guildId/autoroles', (req, res) => {
  const { guildId } = req.params;
  const settings = dashboardDB.getGuildSettings(guildId);
  settings.autoRoles = req.body;
  dashboardDB.saveGuildSettings(guildId, settings);
  res.json({ success: true });
});

// API: Save tickets
router.post('/api/server/:guildId/tickets', (req, res) => {
  const { guildId } = req.params;
  const settings = dashboardDB.getGuildSettings(guildId);
  settings.tickets = req.body;
  dashboardDB.saveGuildSettings(guildId, settings);
  res.json({ success: true });
});

// API: Save logs
router.post('/api/server/:guildId/logs', (req, res) => {
  const { guildId } = req.params;
  const settings = dashboardDB.getGuildSettings(guildId);
  settings.logs = req.body;
  dashboardDB.saveGuildSettings(guildId, settings);
  res.json({ success: true });
});

// API: Save antispam
router.post('/api/server/:guildId/antispam', (req, res) => {
  const { guildId } = req.params;
  const settings = dashboardDB.getGuildSettings(guildId);
  settings.antiSpam = req.body;
  dashboardDB.saveGuildSettings(guildId, settings);
  res.json({ success: true });
});

// API: Save commands
router.post('/api/server/:guildId/commands', (req, res) => {
  const { guildId } = req.params;
  const settings = dashboardDB.getGuildSettings(guildId);
  if (!settings.customCommands) settings.customCommands = [];
  settings.customCommands.push(req.body);
  dashboardDB.saveGuildSettings(guildId, settings);
  res.json({ success: true });
});

// API: Save general settings
router.post('/api/server/:guildId/settings', (req, res) => {
  const { guildId } = req.params;
  const settings = dashboardDB.getGuildSettings(guildId);
  settings.generalSettings = req.body;
  dashboardDB.saveGuildSettings(guildId, settings);
  res.json({ success: true });
});

module.exports = router;
