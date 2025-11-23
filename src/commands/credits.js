const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('credits')
    .setDescription('Check your credits balance'),
  async execute(interaction) {
    const credits = Math.floor(Math.random() * 1000);
    
    const creditsEmbed = {
      color: 0x00ff00,
      title: '💳 Your Credits',
      description: `You have **${credits}** credits!`,
      fields: [
        {
          name: 'User',
          value: `<@${interaction.user.id}>`,
          inline: true
        },
        {
          name: 'Credits',
          value: `${credits}`,
          inline: true
        }
      ],
      timestamp: new Date().toISOString()
    };

    await interaction.reply({ embeds: [creditsEmbed] });
  }
};
