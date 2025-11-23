const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('رمي نرد (Roll a dice)')
    .addIntegerOption(option => option.setName('sides').setDescription('عدد الأوجه').setRequired(false).setMinValue(2).setMaxValue(1000)),
  async execute(interaction) {
    const sides = interaction.options.getInteger('sides') || 6;
    const result = Math.floor(Math.random() * sides) + 1;
    
    const embed = {
      color: 0x00ff00,
      title: '🎲 رمي النرد',
      fields: [
        { name: 'عدد الأوجه', value: `${sides}`, inline: true },
        { name: 'النتيجة', value: `${result}`, inline: true }
      ]
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
