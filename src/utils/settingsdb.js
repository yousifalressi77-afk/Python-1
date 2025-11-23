const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../data/settings.json');

const initDB = () => {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ servers: {} }, null, 2));
  }
};

const getDB = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { servers: {} };
  }
};

const saveDB = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('خطأ في حفظ قاعدة البيانات:', error);
  }
};

const getServerSettings = (guildId) => {
  const db = getDB();
  return db.servers[guildId] || {
    autoReplies: [],
    shortcuts: [],
    modRoles: [],
    prefix: '!',
    language: 'ar'
  };
};

const saveServerSettings = (guildId, settings) => {
  const db = getDB();
  db.servers[guildId] = settings;
  saveDB(db);
};

const addAutoReply = (guildId, trigger, response) => {
  const settings = getServerSettings(guildId);
  settings.autoReplies.push({
    id: Date.now(),
    trigger,
    response,
    createdAt: new Date().toISOString()
  });
  saveServerSettings(guildId, settings);
};

const deleteAutoReply = (guildId, id) => {
  const settings = getServerSettings(guildId);
  settings.autoReplies = settings.autoReplies.filter(ar => ar.id !== id);
  saveServerSettings(guildId, settings);
};

const addShortcut = (guildId, name, command) => {
  const settings = getServerSettings(guildId);
  settings.shortcuts.push({
    id: Date.now(),
    name,
    command,
    createdAt: new Date().toISOString()
  });
  saveServerSettings(guildId, settings);
};

const deleteShortcut = (guildId, id) => {
  const settings = getServerSettings(guildId);
  settings.shortcuts = settings.shortcuts.filter(s => s.id !== id);
  saveServerSettings(guildId, settings);
};

initDB();

module.exports = {
  getServerSettings,
  saveServerSettings,
  addAutoReply,
  deleteAutoReply,
  addShortcut,
  deleteShortcut
};
