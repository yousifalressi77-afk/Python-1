const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reverse')
    .setDescription('عكس النص (Reverse text)')
    .addStringOption(option => option.setName('text').setDescription('النص').setRequired(true)),
  async execute(interaction) {
    const text = interaction.options.getString('text');
    const reversed = text.split('').reverse().join('');
    
    const embed = {
      color: 0x0099ff,
      title: '🔄 عكس النص',
      fields: [
        { name: 'الأصلي', value: `\`${text}\`` },
        { name: 'المعكوس', value: `\`${reversed}\`` }
      ]
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
