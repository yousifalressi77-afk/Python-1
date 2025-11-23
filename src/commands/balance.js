const { SlashCommandBuilder } = require('discord.js');
const db = require('../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('فحص الرصيد (Check your account balance)'),
  async execute(interaction) {
    const user = interaction.user;
    let userData = db.getUser(user.id);
    
    if (!userData) {
      userData = db.createUser(user.id, user.tag);
    }
    
    const balanceEmbed = {
      color: 0x0099ff,
      title: '💰 رصيدك',
      fields: [
        {
          name: 'المستخدم',
          value: user.tag,
          inline: true
        },
        {
          name: 'الرصيد',
          value: `$${userData.balance}`,
          inline: true
        }
      ],
      thumbnail: {
        url: user.displayAvatarURL()
      },
      timestamp: new Date().toISOString()
    };

    await interaction.reply({ embeds: [balanceEmbed] });
  }
};
