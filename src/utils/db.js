const { Pool } = require('pg');

// إنشاء pool للاتصال بـ PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// الاتصال بـ PostgreSQL
pool.on('connect', () => {
  console.log('✅ متصل بـ PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ خطأ في الاتصال بـ PostgreSQL:', err);
});

// إنشء الجداول
const initDatabase = async () => {
  try {
    // جدول الإعدادات
    await pool.query(`
      CREATE TABLE IF NOT EXISTS server_settings (
        id SERIAL PRIMARY KEY,
        guild_id VARCHAR(255) UNIQUE NOT NULL,
        prefix VARCHAR(10) DEFAULT '!',
        language VARCHAR(10) DEFAULT 'ar',
        mod_roles TEXT[] DEFAULT '{}',
        auto_replies JSONB DEFAULT '[]',
        shortcuts JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // جدول نظام التكاتة
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ticket_config (
        id SERIAL PRIMARY KEY,
        guild_id VARCHAR(255) UNIQUE NOT NULL,
        channel_id VARCHAR(255),
        category_id VARCHAR(255),
        log_channel_id VARCHAR(255),
        support_role_id VARCHAR(255),
        options JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // جدول التكاتة
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        ticket_id VARCHAR(255) UNIQUE NOT NULL,
        guild_id VARCHAR(255) NOT NULL,
        channel_id VARCHAR(255),
        user_id VARCHAR(255),
        status VARCHAR(50) DEFAULT 'open',
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        closed_at TIMESTAMP,
        FOREIGN KEY (guild_id) REFERENCES ticket_config(guild_id) ON DELETE CASCADE
      )
    `);

    console.log('✅ تم إنشاء الجداول بنجاح');
  } catch (error) {
    console.error('❌ خطأ في إنشاء الجداول:', error);
  }
};

// استدعاء الدالة عند البدء
initDatabase().catch(console.error);

module.exports = { pool, initDatabase };
