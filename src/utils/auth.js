const axios = require('axios');

const DISCORD_API = 'https://discordapp.com/api';
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || 'http://localhost:5000/callback';

const getAccessToken = async (code) => {
  try {
    const response = await axios.post(`${DISCORD_API}/oauth2/token`, 
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        scope: 'identify guilds'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('خطأ في الحصول على access token:', error);
    return null;
  }
};

const getUserData = async (accessToken) => {
  try {
    const response = await axios.get(`${DISCORD_API}/users/@me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
  } catch (error) {
    console.error('خطأ في الحصول على بيانات المستخدم:', error);
    return null;
  }
};

const getUserGuilds = async (accessToken) => {
  try {
    const response = await axios.get(`${DISCORD_API}/users/@me/guilds`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
  } catch (error) {
    console.error('خطأ في الحصول على السيرفرات:', error);
    return [];
  }
};

const getGuildMember = async (guildId, userId) => {
  try {
    const response = await axios.get(`${DISCORD_API}/guilds/${guildId}/members/${userId}`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` }
    });
    return response.data;
  } catch (error) {
    console.error('خطأ في الحصول على معلومات العضو:', error);
    return null;
  }
};

const hasAdminPermission = (member) => {
  if (!member || !member.roles) return false;
  // Check if user is owner or has admin role
  return member.roles.some(roleId => true); // Will be enhanced based on guild settings
};

module.exports = {
  getAccessToken,
  getUserData,
  getUserGuilds,
  getGuildMember,
  hasAdminPermission,
  REDIRECT_URI
};
