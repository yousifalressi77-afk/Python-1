const { SlashCommandBuilder, version } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('معلومات البوت (Bot information)'),
  async execute(interaction) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    
    const embed = {
      color: 0x0099ff,
      title: '🤖 معلومات البوت',
      thumbnail: { url: interaction.client.user.displayAvatarURL() },
      fields: [
        { name: 'اسم البوت', value: interaction.client.user.username, inline: true },
        { name: 'الـ ID', value: interaction.client.user.id, inline: true },
        { name: 'Discord.js Version', value: version, inline: true },
        { name: 'Node.js Version', value: process.version, inline: true },
        { name: 'وقت التشغيل', value: `${hours}h ${minutes}m`, inline: true },
        { name: 'عدد السيرفرات', value: interaction.client.guilds.cache.size.toString(), inline: true }
      ]
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
