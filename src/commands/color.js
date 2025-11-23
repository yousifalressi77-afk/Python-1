const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('color')
    .setDescription('لون عشوائي (Random color)')
    .addStringOption(option => option.setName('hex').setDescription('كود HEX (اختياري)').setRequired(false)),
  async execute(interaction) {
    let hexColor = interaction.options.getString('hex') || '#' + Math.floor(Math.random()*16777215).toString(16);
    
    const embed = {
      color: parseInt(hexColor.replace('#', ''), 16),
      title: '🎨 اللون',
      fields: [
        { name: 'HEX', value: hexColor },
        { name: 'RGB', value: `rgb(${parseInt(hexColor.substr(1,2),16)}, ${parseInt(hexColor.substr(3,2),16)}, ${parseInt(hexColor.substr(5,2),16)})` }
      ]
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
