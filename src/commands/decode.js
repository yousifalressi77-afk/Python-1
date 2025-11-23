const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('decode')
    .setDescription('فك ترميز Base64')
    .addStringOption(option => option.setName('text').setDescription('النص المشفر').setRequired(true)),
  async execute(interaction) {
    const text = interaction.options.getString('text');
    
    try {
      const decoded = Buffer.from(text, 'base64').toString('utf8');
      
      const embed = {
        color: 0x0099ff,
        title: '🔓 فك الترميز',
        fields: [
          { name: 'المشفر', value: `\`${text}\`` },
          { name: 'المفك', value: `\`${decoded}\`` }
        ]
      };
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ خطأ في فك الترميز!', ephemeral: true });
    }
  }
};
