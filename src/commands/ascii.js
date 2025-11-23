const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ascii')
    .setDescription('تحويل النص إلى كود ASCII (Text to ASCII)')
    .addStringOption(option => option.setName('text').setDescription('النص').setRequired(true)),
  async execute(interaction) {
    const text = interaction.options.getString('text');
    let ascii = '';
    
    for (let char of text) {
      ascii += `${char} = ${char.charCodeAt(0)}\n`;
    }
    
    const embed = {
      color: 0x0099ff,
      title: '🔤 ASCII Code',
      description: `\`\`\`${ascii}\`\`\``
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
