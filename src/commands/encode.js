const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('encode')
    .setDescription('ترميز Base64')
    .addStringOption(option => option.setName('text').setDescription('النص').setRequired(true)),
  async execute(interaction) {
    const text = interaction.options.getString('text');
    const encoded = Buffer.from(text).toString('base64');
    
    const embed = {
      color: 0x0099ff,
      title: '🔐 ترميز',
      fields: [
        { name: 'الأصلي', value: `\`${text}\`` },
        { name: 'المشفر', value: `\`${encoded}\`` }
      ]
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
