const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('درجة الحرارة والطقس (Weather)')
    .addStringOption(option => option.setName('city').setDescription('المدينة').setRequired(true)),
  async execute(interaction) {
    const city = interaction.options.getString('city');
    
    const embed = {
      color: 0x0099ff,
      title: `🌡️ الطقس في ${city}`,
      fields: [
        { name: 'درجة الحرارة', value: '25°C', inline: true },
        { name: 'الحالة', value: 'مشمس ☀️', inline: true },
        { name: 'الرياح', value: '10 km/h', inline: true },
        { name: 'الرطوبة', value: '65%', inline: true }
      ]
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
