const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../data/dashboard.json');

const initDB = () => {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ guilds: {} }, null, 2));
  }
};

const getDB = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { guilds: {} };
  }
};

const saveDB = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('خطأ:', error);
  }
};

const getGuildSettings = (guildId) => {
  const db = getDB();
  return db.guilds[guildId] || {
    welcome: { enabled: false, channel: '', message: '', image: '' },
    leave: { enabled: false, channel: '', message: '' },
    autoRoles: { enabled: false, roles: [] },
    moderation: { logChannel: '', warnings: true, muteRole: '' },
    tickets: { enabled: false, category: '', adminRole: '' },
    logs: { enabled: false, channels: {} },
    antiSpam: { enabled: false, messages: 5, time: 10 },
    customCommands: [],
    generalSettings: { prefix: '!', language: 'ar' },
    botStats: {}
  };
};

const saveGuildSettings = (guildId, settings) => {
  const db = getDB();
  db.guilds[guildId] = settings;
  saveDB(db);
};

initDB();

module.exports = {
  getGuildSettings,
  saveGuildSettings
};
