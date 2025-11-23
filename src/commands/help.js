const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show available commands'),
  async execute(interaction) {
    const helpEmbed = {
      color: 0x0099ff,
      title: '📖 Bot Help',
      description: 'Here are the available commands:',
      fields: [
        {
          name: '/help',
          value: 'Show this help message',
          inline: false
        },
        {
          name: '/credits',
          value: 'Check your current credits balance',
          inline: false
        },
        {
          name: '/balance',
          value: 'Check your account balance',
          inline: false
        }
      ],
      timestamp: new Date().toISOString()
    };

    await interaction.reply({ embeds: [helpEmbed] });
  }
};
