const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../data/tickets.json');

const initTicketDB = () => {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ servers: {} }, null, 2));
  }
};

const getTicketDB = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { servers: {} };
  }
};

const saveTicketDB = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('خطأ في حفظ قاعدة البيانات:', error);
  }
};

const setupTicketSystem = (guildId, config) => {
  const db = getTicketDB();
  db.servers[guildId] = config;
  saveTicketDB(db);
  return config;
};

const getTicketConfig = (guildId) => {
  const db = getTicketDB();
  return db.servers[guildId] || null;
};

const createTicket = (guildId, ticketData) => {
  const db = getTicketDB();
  if (!db.servers[guildId]) {
    db.servers[guildId] = {};
  }
  if (!db.servers[guildId].tickets) {
    db.servers[guildId].tickets = [];
  }
  db.servers[guildId].tickets.push(ticketData);
  saveTicketDB(db);
};

const closeTicket = (guildId, ticketId) => {
  const db = getTicketDB();
  if (db.servers[guildId] && db.servers[guildId].tickets) {
    db.servers[guildId].tickets = db.servers[guildId].tickets.filter(t => t.id !== ticketId);
    saveTicketDB(db);
  }
};

initTicketDB();

module.exports = {
  setupTicketSystem,
  getTicketConfig,
  createTicket,
  closeTicket
};
