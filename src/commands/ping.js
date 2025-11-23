const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('فحص سرعة البوت (Check bot ping)'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: '🏓 جاري الفحص...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);
    
    const embed = {
      color: 0x00ff00,
      title: '🏓 Ping',
      fields: [
        { name: 'رد البوت (Bot Latency)', value: `${latency}ms`, inline: true },
        { name: 'API Latency', value: `${apiLatency}ms`, inline: true }
      ]
    };
    
    await interaction.editReply({ content: '', embeds: [embed] });
  }
};
