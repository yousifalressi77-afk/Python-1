export const BOT_NAME = "PrimeBot";
export const BOT_DEVELOPER = "ALSHARQI";
export const APP_LOGO = "https://cdn.discordapp.com/avatars/1234567890/avatar.png";
export const APP_BANNER = "https://via.placeholder.com/600x400?text=PrimeBot+Dashboard";

export const getLoginUrl = () => {
  // Change this to your actual Discord Client ID
  const clientId = process.env.REACT_APP_DISCORD_CLIENT_ID || "YOUR_CLIENT_ID";
  const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
  return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify+guilds`;
};
