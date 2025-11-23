const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('choice')
    .setDescription('اختيار عشوائي من خيارات (Random choice)')
    .addStringOption(option => option.setName('options').setDescription('الخيارات (افصل بفاصلة)').setRequired(true)),
  async execute(interaction) {
    const options = interaction.options.getString('options').split(',').map(o => o.trim());
    const choice = options[Math.floor(Math.random() * options.length)];
    
    const embed = {
      color: 0x0099ff,
      title: '🎯 الخيار المختار',
      description: `**${choice}**`,
      fields: [
        { name: 'عدد الخيارات', value: `${options.length}` }
      ]
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
