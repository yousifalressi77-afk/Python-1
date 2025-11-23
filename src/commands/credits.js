const { SlashCommandBuilder } = require('discord.js');
const db = require('../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('credits')
    .setDescription('فحص الكريدت (Check your credits balance)'),
  async execute(interaction) {
    const user = interaction.user;
    let userData = db.getUser(user.id);
    
    if (!userData) {
      userData = db.createUser(user.id, user.tag);
    }
    
    const creditsEmbed = {
      color: 0x00ff00,
      title: '💳 الكريديتات',
      description: `لديك **${userData.credits}** كريدت!`,
      fields: [
        {
          name: 'المستخدم',
          value: user.tag,
          inline: true
        },
        {
          name: 'الكريدت',
          value: `${userData.credits}`,
          inline: true
        }
      ],
      timestamp: new Date().toISOString()
    };

    await interaction.reply({ embeds: [creditsEmbed] });
  }
};
