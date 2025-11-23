const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('flipcoin')
    .setDescription('رمي عملة (Flip a coin)'),
  async execute(interaction) {
    const result = Math.random() > 0.5 ? 'صورة 🪙' : 'كتابة 📄';
    
    const embed = {
      color: 0xffd700,
      title: '🪙 رمي العملة',
      description: `النتيجة: **${result}**`,
      timestamp: new Date().toISOString()
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
