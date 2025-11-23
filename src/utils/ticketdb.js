const { pool } = require('./db');

const setupTicketSystem = async (guildId, config) => {
  try {
    const result = await pool.query(
      `INSERT INTO ticket_config (guild_id, channel_id, category_id, log_channel_id, support_role_id, options)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (guild_id) DO UPDATE SET 
       channel_id = $2, category_id = $3, log_channel_id = $4, support_role_id = $5, options = $6,
       updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [guildId, config.channelId, config.categoryId, config.logChannelId, config.supportRoleId, JSON.stringify(config.options || [])]
    );
    return result.rows[0];
  } catch (error) {
    console.error('خطأ في إعداد نظام التكاتة:', error);
    return null;
  }
};

const updateTicketConfig = async (guildId, newConfig) => {
  try {
    const result = await pool.query(
      `UPDATE ticket_config SET 
       channel_id = COALESCE($2, channel_id),
       category_id = COALESCE($3, category_id),
       log_channel_id = COALESCE($4, log_channel_id),
       support_role_id = COALESCE($5, support_role_id),
       options = COALESCE($6, options),
       updated_at = CURRENT_TIMESTAMP
       WHERE guild_id = $1
       RETURNING *`,
      [guildId, newConfig.channelId, newConfig.categoryId, newConfig.logChannelId, newConfig.supportRoleId, JSON.stringify(newConfig.options)]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('خطأ في تحديث إعدادات التكاتة:', error);
    return null;
  }
};

const getTicketConfig = async (guildId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM ticket_config WHERE guild_id = $1`,
      [guildId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('خطأ في الحصول على إعدادات التكاتة:', error);
    return null;
  }
};

const createTicket = async (guildId, ticketData) => {
  try {
    const result = await pool.query(
      `INSERT INTO tickets (ticket_id, guild_id, channel_id, user_id, status, category)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [ticketData.id, guildId, ticketData.channelId, ticketData.userId, 'open', ticketData.category]
    );
    return result.rows[0];
  } catch (error) {
    console.error('خطأ في إنشاء تكتة:', error);
    return null;
  }
};

const closeTicket = async (guildId, ticketId) => {
  try {
    await pool.query(
      `UPDATE tickets SET status = 'closed', closed_at = CURRENT_TIMESTAMP
       WHERE ticket_id = $1 AND guild_id = $2`,
      [ticketId, guildId]
    );
    return true;
  } catch (error) {
    console.error('خطأ في إغلاق التكتة:', error);
    return false;
  }
};

const getTickets = async (guildId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tickets WHERE guild_id = $1 AND status = 'open'`,
      [guildId]
    );
    return result.rows;
  } catch (error) {
    console.error('خطأ في الحصول على التكاتة:', error);
    return [];
  }
};

module.exports = {
  setupTicketSystem,
  updateTicketConfig,
  getTicketConfig,
  createTicket,
  closeTicket,
  getTickets
};
