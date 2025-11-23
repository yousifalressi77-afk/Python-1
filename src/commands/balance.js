const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your account balance'),
  async execute(interaction) {
    const balance = Math.floor(Math.random() * 5000) + 100;
    
    const balanceEmbed = {
      color: 0x0099ff,
      title: '💰 رصيدك (Your Balance)',
      fields: [
        {
          name: 'المستخدم (User)',
          value: `<@${interaction.user.id}>`,
          inline: true
        },
        {
          name: 'الرصيد (Balance)',
          value: `$${balance}`,
          inline: true
        }
      ],
      thumbnail: {
        url: interaction.user.displayAvatarURL()
      },
      timestamp: new Date().toISOString()
    };

    await interaction.reply({ embeds: [balanceEmbed] });
  }
};
