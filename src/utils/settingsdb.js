const { pool } = require('./db');

const getServerSettings = async (guildId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM server_settings WHERE guild_id = $1`,
      [guildId]
    );
    
    if (result.rows.length > 0) {
      const row = result.rows[0];
      return {
        guildId: row.guild_id,
        prefix: row.prefix,
        language: row.language,
        modRoles: row.mod_roles || [],
        autoReplies: row.auto_replies || [],
        shortcuts: row.shortcuts || []
      };
    }
    
    // إعدادات افتراضية
    return {
      guildId,
      prefix: '!',
      language: 'ar',
      modRoles: [],
      autoReplies: [],
      shortcuts: []
    };
  } catch (error) {
    console.error('خطأ في الحصول على إعدادات السيرفر:', error);
    return {
      prefix: '!',
      language: 'ar',
      modRoles: [],
      autoReplies: [],
      shortcuts: []
    };
  }
};

const saveServerSettings = async (guildId, settings) => {
  try {
    await pool.query(
      `INSERT INTO server_settings (guild_id, prefix, language, mod_roles, auto_replies, shortcuts)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (guild_id) DO UPDATE SET 
       prefix = $2, language = $3, mod_roles = $4, auto_replies = $5, shortcuts = $6,
       updated_at = CURRENT_TIMESTAMP`,
      [guildId, settings.prefix, settings.language, settings.modRoles || [], JSON.stringify(settings.autoReplies || []), JSON.stringify(settings.shortcuts || [])]
    );
    return true;
  } catch (error) {
    console.error('خطأ في حفظ إعدادات السيرفر:', error);
    return false;
  }
};

const addAutoReply = async (guildId, trigger, response) => {
  try {
    const settings = await getServerSettings(guildId);
    const newAutoReply = {
      id: Date.now(),
      trigger,
      response,
      createdAt: new Date().toISOString()
    };
    settings.autoReplies.push(newAutoReply);
    await saveServerSettings(guildId, settings);
    return newAutoReply;
  } catch (error) {
    console.error('خطأ في إضافة رد تلقائي:', error);
    return null;
  }
};

const deleteAutoReply = async (guildId, id) => {
  try {
    const settings = await getServerSettings(guildId);
    settings.autoReplies = settings.autoReplies.filter(ar => ar.id !== id);
    await saveServerSettings(guildId, settings);
    return true;
  } catch (error) {
    console.error('خطأ في حذف الرد التلقائي:', error);
    return false;
  }
};

const addShortcut = async (guildId, name, command) => {
  try {
    const settings = await getServerSettings(guildId);
    const newShortcut = {
      id: Date.now(),
      name,
      command,
      createdAt: new Date().toISOString()
    };
    settings.shortcuts.push(newShortcut);
    await saveServerSettings(guildId, settings);
    return newShortcut;
  } catch (error) {
    console.error('خطأ في إضافة اختصار:', error);
    return null;
  }
};

const deleteShortcut = async (guildId, id) => {
  try {
    const settings = await getServerSettings(guildId);
    settings.shortcuts = settings.shortcuts.filter(s => s.id !== id);
    await saveServerSettings(guildId, settings);
    return true;
  } catch (error) {
    console.error('خطأ في حذف الاختصار:', error);
    return false;
  }
};

module.exports = {
  getServerSettings,
  saveServerSettings,
  addAutoReply,
  deleteAutoReply,
  addShortcut,
  deleteShortcut
};
