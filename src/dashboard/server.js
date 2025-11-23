const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*', credentials: true }));
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

// Static files
app.use(express.static('public'));

// Routes
app.use('/', routes);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'لوحة التحكم تعمل بشكل صحيح',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/bot/stats', (req, res) => {
  res.json({
    status: 'success',
    data: {
      guilds: 1,
      users: 50,
      commands: 23,
      uptime: process.uptime(),
      language: 'عربي'
    }
  });
});

app.get('/api/bot/commands', (req, res) => {
  res.json({
    status: 'success',
    commands: [
      { name: 'help', description: 'عرض المساعدة', category: 'عام' },
      { name: 'ping', description: 'فحص السرعة', category: 'عام' },
      { name: 'ban', description: 'حظر مستخدم', category: 'إدارة' },
      { name: 'kick', description: 'طرد مستخدم', category: 'إدارة' },
      { name: 'mute', description: 'إسكات', category: 'إدارة' },
      { name: 'warn', description: 'تحذير', category: 'إدارة' },
      { name: 'credits', description: 'فحص الكريدت', category: 'اقتصادي' },
      { name: 'balance', description: 'فحص الرصيد', category: 'اقتصادي' },
      { name: 'userinfo', description: 'معلومات المستخدم', category: 'معلومات' },
      { name: 'serverinfo', description: 'معلومات السيرفر', category: 'معلومات' },
      { name: 'clear', description: 'حذف الرسائل', category: 'إدارة' },
      { name: 'announce', description: 'إعلان', category: 'إدارة' },
      { name: 'addrole', description: 'إضافة دور', category: 'إدارة' },
      { name: 'removerole', description: 'إزالة دور', category: 'إدارة' },
      { name: 'stats', description: 'الإحصائيات', category: 'معلومات' },
      { name: 'giveaway', description: 'توزيع جوائز', category: 'أحداث' },
      { name: 'poll', description: 'استطلاع رأي', category: 'أحداث' },
      { name: 'report', description: 'الإبلاغ', category: 'أمان' },
      { name: 'unban', description: 'إلغاء الحظر', category: 'إدارة' },
      { name: 'avatar', description: 'عرض الصورة', category: 'معلومات' },
      { name: 'botinfo', description: 'معلومات البوت', category: 'معلومات' }
    ]
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Not Found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 لوحة التحكم تعمل | Dashboard running on: http://0.0.0.0:${PORT}`);
  console.log(`📊 الصفحات المتاحة:`);
  console.log(`   - الرئيسية: http://0.0.0.0:${PORT}/dashboard`);
  console.log(`   - السيرفرات: http://0.0.0.0:${PORT}/servers`);
  console.log(`   - الأوامر: http://0.0.0.0:${PORT}/commands`);
  console.log(`   - الإعدادات: http://0.0.0.0:${PORT}/settings`);
});

module.exports = app;
