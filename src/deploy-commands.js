const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`🔄 جاري تحديث ${commands.length} أوامر...`);

    const data = await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID || '1234567890'),
      { body: commands },
    );

    console.log(`✅ تم تحديث ${data.length} أوامر بنجاح!`);
  } catch (error) {
    console.error('❌ خطأ في تحديث الأوامر:', error);
  }
})();
