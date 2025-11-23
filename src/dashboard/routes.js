const express = require('express');
const router = express.Router();

// الصفحة الرئيسية - الترحيب
router.get('/', (req, res) => {
  res.redirect('/dashboard');
});

// الصفحة الرئيسية
router.get('/dashboard', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>لوحة التحكم | Bot Dashboard</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          min-height: 100vh;
          color: #333;
        }
        .navbar {
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }
        .navbar h1 { font-size: 24px; }
        .navbar a { color: #fff; text-decoration: none; margin: 0 15px; transition: 0.3s; }
        .navbar a:hover { color: #5a9fd4; }
        .container {
          max-width: 1200px;
          margin: 30px auto;
          padding: 0 20px;
        }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .card {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3); }
        .card h3 { color: #2a5298; margin-bottom: 15px; border-bottom: 2px solid #2a5298; padding-bottom: 10px; }
        .stat-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-box .value { font-size: 32px; font-weight: bold; }
        .stat-box .label { font-size: 14px; opacity: 0.9; margin-top: 5px; }
        .button-group { display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap; }
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: 0.3s;
          font-size: 14px;
          font-weight: bold;
        }
        .btn-primary { background: #2a5298; color: white; }
        .btn-primary:hover { background: #1e3c72; }
        .btn-danger { background: #ff6b6b; color: white; }
        .btn-danger:hover { background: #ff5252; }
        .btn-success { background: #51cf66; color: white; }
        .btn-success:hover { background: #40c057; }
        .settings-form {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          margin-bottom: 30px;
        }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: bold; color: #333; }
        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-family: inherit;
          font-size: 14px;
        }
        .form-group textarea { min-height: 100px; resize: vertical; }
        .table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; }
        .table th { background: #2a5298; color: white; padding: 12px; text-align: right; }
        .table td { padding: 12px; border-bottom: 1px solid #eee; }
        .table tr:hover { background: #f5f5f5; }
      </style>
    </head>
    <body>
      <div class="navbar">
        <h1>🤖 لوحة التحكم</h1>
        <nav>
          <a href="/dashboard">الرئيسية</a>
          <a href="/servers">السيرفرات</a>
          <a href="/commands">الأوامر</a>
          <a href="/settings">الإعدادات</a>
        </nav>
      </div>

      <div class="container">
        <div class="grid">
          <div class="stat-box">
            <div class="value">42</div>
            <div class="label">السيرفرات النشطة</div>
          </div>
          <div class="stat-box">
            <div class="value">15K</div>
            <div class="label">إجمالي المستخدمين</div>
          </div>
          <div class="stat-box">
            <div class="value">23</div>
            <div class="label">الأوامر المتاحة</div>
          </div>
          <div class="stat-box">
            <div class="value">✅</div>
            <div class="label">حالة النظام</div>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <h3>📊 الإحصائيات السريعة</h3>
            <p>عدد الرسائل المعالجة: <strong>150K+</strong></p>
            <p>وقت التشغيل: <strong>45 يوم</strong></p>
            <p>معدل الأداء: <strong>99.9%</strong></p>
            <div class="button-group">
              <button class="btn btn-primary" onclick="loadStats()">تحديث</button>
            </div>
          </div>

          <div class="card">
            <h3>⚡ الأوامر الأخيرة</h3>
            <table class="table">
              <tr>
                <th>الأمر</th>
                <th>الوقت</th>
              </tr>
              <tr>
                <td>/ban</td>
                <td>منذ 2 دقيقة</td>
              </tr>
              <tr>
                <td>/mute</td>
                <td>منذ 5 دقائق</td>
              </tr>
              <tr>
                <td>/warn</td>
                <td>منذ 10 دقائق</td>
              </tr>
            </table>
          </div>

          <div class="card">
            <h3>🔧 الإجراءات السريعة</h3>
            <div class="button-group">
              <button class="btn btn-primary" onclick="alert('تم إعادة تشغيل البوت')">إعادة تشغيل</button>
              <button class="btn btn-danger" onclick="alert('تم إيقاف البوت')">إيقاف</button>
              <button class="btn btn-success" onclick="alert('تم إصلاح الأخطاء')">إصلاح</button>
            </div>
          </div>
        </div>
      </div>

      <script>
        function loadStats() {
          fetch('/api/bot/stats')
            .then(r => r.json())
            .then(d => console.log('Stats:', d));
        }
      </script>
    </body>
    </html>
  `);
});

// صفحة السيرفرات
router.get('/servers', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>السيرفرات | Bot Dashboard</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          min-height: 100vh;
          color: #333;
        }
        .navbar {
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }
        .navbar h1 { font-size: 24px; }
        .navbar a { color: #fff; text-decoration: none; margin: 0 15px; transition: 0.3s; }
        .navbar a:hover { color: #5a9fd4; }
        .container {
          max-width: 1200px;
          margin: 30px auto;
          padding: 0 20px;
        }
        .server-card {
          background: white;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .server-info h3 { color: #2a5298; margin-bottom: 10px; }
        .server-info p { color: #666; font-size: 14px; margin-bottom: 5px; }
        .server-buttons { display: flex; gap: 10px; }
        .btn {
          padding: 8px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: 0.3s;
          font-size: 13px;
          font-weight: bold;
        }
        .btn-primary { background: #2a5298; color: white; }
        .btn-primary:hover { background: #1e3c72; }
        .btn-settings { background: #667eea; color: white; }
        .btn-settings:hover { background: #5568d3; }
      </style>
    </head>
    <body>
      <div class="navbar">
        <h1>🤖 لوحة التحكم</h1>
        <nav>
          <a href="/dashboard">الرئيسية</a>
          <a href="/servers">السيرفرات</a>
          <a href="/commands">الأوامر</a>
          <a href="/settings">الإعدادات</a>
        </nav>
      </div>

      <div class="container">
        <h2 style="color: white; margin-bottom: 20px;">📋 السيرفرات المدارة</h2>
        
        <div class="server-card">
          <div class="server-info">
            <h3>🏰 Server 1</h3>
            <p>الأعضاء: 250</p>
            <p>الحالة: نشط ✅</p>
          </div>
          <div class="server-buttons">
            <button class="btn btn-primary">تفاصيل</button>
            <button class="btn btn-settings">إعدادات</button>
          </div>
        </div>

        <div class="server-card">
          <div class="server-info">
            <h3>🏰 Server 2</h3>
            <p>الأعضاء: 150</p>
            <p>الحالة: نشط ✅</p>
          </div>
          <div class="server-buttons">
            <button class="btn btn-primary">تفاصيل</button>
            <button class="btn btn-settings">إعدادات</button>
          </div>
        </div>

        <div class="server-card">
          <div class="server-info">
            <h3>🏰 Server 3</h3>
            <p>الأعضاء: 500</p>
            <p>الحالة: نشط ✅</p>
          </div>
          <div class="server-buttons">
            <button class="btn btn-primary">تفاصيل</button>
            <button class="btn btn-settings">إعدادات</button>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// صفحة الأوامر
router.get('/commands', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>الأوامر | Bot Dashboard</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          min-height: 100vh;
          color: #333;
        }
        .navbar {
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }
        .navbar h1 { font-size: 24px; }
        .navbar a { color: #fff; text-decoration: none; margin: 0 15px; transition: 0.3s; }
        .navbar a:hover { color: #5a9fd4; }
        .container {
          max-width: 1200px;
          margin: 30px auto;
          padding: 0 20px;
        }
        .filter-box {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        .filter-box input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
        }
        .commands-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .command-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          border-right: 4px solid #667eea;
        }
        .command-card h3 { color: #2a5298; margin-bottom: 10px; }
        .command-card p { color: #666; font-size: 14px; margin-bottom: 10px; }
        .category { display: inline-block; background: #e9ecef; color: #333; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .toggle-btn {
          width: 50px;
          height: 24px;
          background: #ddd;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          margin-top: 10px;
          transition: 0.3s;
        }
        .toggle-btn.active { background: #51cf66; }
      </style>
    </head>
    <body>
      <div class="navbar">
        <h1>🤖 لوحة التحكم</h1>
        <nav>
          <a href="/dashboard">الرئيسية</a>
          <a href="/servers">السيرفرات</a>
          <a href="/commands">الأوامر</a>
          <a href="/settings">الإعدادات</a>
        </nav>
      </div>

      <div class="container">
        <h2 style="color: white; margin-bottom: 20px;">⚡ الأوامر المتاحة</h2>
        
        <div class="filter-box">
          <input type="text" placeholder="🔍 ابحث عن أمر...">
        </div>

        <div class="commands-grid">
          <div class="command-card">
            <h3>/ban</h3>
            <p>حظر مستخدم من السيرفر</p>
            <span class="category">إدارة</span>
            <button class="toggle-btn active" onclick="this.classList.toggle('active')"></button>
          </div>

          <div class="command-card">
            <h3>/kick</h3>
            <p>طرد مستخدم من السيرفر</p>
            <span class="category">إدارة</span>
            <button class="toggle-btn active" onclick="this.classList.toggle('active')"></button>
          </div>

          <div class="command-card">
            <h3>/mute</h3>
            <p>إسكات مستخدم مؤقتاً</p>
            <span class="category">إدارة</span>
            <button class="toggle-btn active" onclick="this.classList.toggle('active')"></button>
          </div>

          <div class="command-card">
            <h3>/warn</h3>
            <p>تحذير مستخدم</p>
            <span class="category">إدارة</span>
            <button class="toggle-btn active" onclick="this.classList.toggle('active')"></button>
          </div>

          <div class="command-card">
            <h3>/credits</h3>
            <p>فحص رصيد الكريدت</p>
            <span class="category">اقتصادي</span>
            <button class="toggle-btn active" onclick="this.classList.toggle('active')"></button>
          </div>

          <div class="command-card">
            <h3>/balance</h3>
            <p>فحص الرصيد المالي</p>
            <span class="category">اقتصادي</span>
            <button class="toggle-btn active" onclick="this.classList.toggle('active')"></button>
          </div>

          <div class="command-card">
            <h3>/help</h3>
            <p>عرض المساعدة والأوامر</p>
            <span class="category">عام</span>
            <button class="toggle-btn active" onclick="this.classList.toggle('active')"></button>
          </div>

          <div class="command-card">
            <h3>/ping</h3>
            <p>فحص سرعة البوت</p>
            <span class="category">عام</span>
            <button class="toggle-btn active" onclick="this.classList.toggle('active')"></button>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// صفحة الإعدادات
router.get('/settings', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>الإعدادات | Bot Dashboard</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          min-height: 100vh;
          color: #333;
        }
        .navbar {
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }
        .navbar h1 { font-size: 24px; }
        .navbar a { color: #fff; text-decoration: none; margin: 0 15px; transition: 0.3s; }
        .navbar a:hover { color: #5a9fd4; }
        .container {
          max-width: 900px;
          margin: 30px auto;
          padding: 0 20px;
        }
        .settings-form {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        .form-group {
          margin-bottom: 25px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
          color: #2a5298;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-family: inherit;
          font-size: 14px;
        }
        .form-group textarea { min-height: 100px; }
        .button-group {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        .btn {
          padding: 12px 30px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: 0.3s;
          font-size: 14px;
        }
        .btn-save { background: #51cf66; color: white; }
        .btn-save:hover { background: #40c057; }
        .btn-reset { background: #adb5bd; color: white; }
        .btn-reset:hover { background: #868e96; }
      </style>
    </head>
    <body>
      <div class="navbar">
        <h1>🤖 لوحة التحكم</h1>
        <nav>
          <a href="/dashboard">الرئيسية</a>
          <a href="/servers">السيرفرات</a>
          <a href="/commands">الأوامر</a>
          <a href="/settings">الإعدادات</a>
        </nav>
      </div>

      <div class="container">
        <h2 style="color: white; margin-bottom: 20px;">⚙️ إعدادات البوت</h2>
        
        <form class="settings-form">
          <div class="form-group">
            <label>اسم البوت</label>
            <input type="text" value="Bot Name" readonly>
          </div>

          <div class="form-group">
            <label>البادئة (Prefix)</label>
            <input type="text" value="!" placeholder="أدخل البادئة">
          </div>

          <div class="form-group">
            <label>رسالة الترحيب</label>
            <textarea placeholder="أدخل رسالة الترحيب للأعضاء الجدد..."></textarea>
          </div>

          <div class="form-group">
            <label>قناة السجلات</label>
            <select>
              <option>اختر قناة</option>
              <option>#logs</option>
              <option>#admin-logs</option>
            </select>
          </div>

          <div class="form-group">
            <label>تفعيل الحماية</label>
            <select>
              <option>قيد التشغيل</option>
              <option>قيد الإيقاف</option>
            </select>
          </div>

          <div class="form-group">
            <label>الأدوار المحظورة</label>
            <textarea placeholder="أدخل أسماء الأدوار المحظورة..."></textarea>
          </div>

          <div class="button-group">
            <button type="submit" class="btn btn-save">💾 حفظ الإعدادات</button>
            <button type="reset" class="btn btn-reset">🔄 إعادة تعيين</button>
          </div>
        </form>
      </div>
    </body>
    </html>
  `);
});

module.exports = router;
