const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../data/users.json');

// إنشاء مجلد data إذا لم يكن موجوداً
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// تحميل أو إنشاء قاعدة البيانات
const initDatabase = () => {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ users: [] }, null, 2));
  }
};

// قراءة قاعدة البيانات
const getDatabase = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('خطأ في قراءة قاعدة البيانات:', error);
    return { users: [] };
  }
};

// حفظ قاعدة البيانات
const saveDatabase = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('خطأ في حفظ قاعدة البيانات:', error);
  }
};

// الحصول على بيانات مستخدم
const getUser = (userId) => {
  const db = getDatabase();
  return db.users.find(u => u.userId === userId);
};

// إنشاء مستخدم جديد
const createUser = (userId, username) => {
  const db = getDatabase();
  const user = {
    userId,
    username,
    credits: 0,
    balance: 0,
    warnings: 0,
    createdAt: new Date().toISOString()
  };
  db.users.push(user);
  saveDatabase(db);
  return user;
};

// إضافة كريدت
const addCredits = (userId, username, amount) => {
  let user = getUser(userId);
  if (!user) {
    user = createUser(userId, username);
  }
  
  user.credits += amount;
  
  const db = getDatabase();
  const index = db.users.findIndex(u => u.userId === userId);
  db.users[index] = user;
  saveDatabase(db);
  
  return user;
};

// إضافة رصيد مالي
const addBalance = (userId, username, amount) => {
  let user = getUser(userId);
  if (!user) {
    user = createUser(userId, username);
  }
  
  user.balance += amount;
  
  const db = getDatabase();
  const index = db.users.findIndex(u => u.userId === userId);
  db.users[index] = user;
  saveDatabase(db);
  
  return user;
};

// إضافة تحذير
const addWarning = (userId, username) => {
  let user = getUser(userId);
  if (!user) {
    user = createUser(userId, username);
  }
  
  user.warnings += 1;
  
  const db = getDatabase();
  const index = db.users.findIndex(u => u.userId === userId);
  db.users[index] = user;
  saveDatabase(db);
  
  return user;
};

// جميع المستخدمين
const getAllUsers = () => {
  const db = getDatabase();
  return db.users;
};

initDatabase();

module.exports = {
  getUser,
  createUser,
  addCredits,
  addBalance,
  addWarning,
  getAllUsers
};
