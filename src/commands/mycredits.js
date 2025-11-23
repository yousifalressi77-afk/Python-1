const { SlashCommandBuilder } = require('discord.js');
const db = require('../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mycredits')
    .setDescription('عرض كريدتك (Show your credits)'),
  async execute(interaction) {
    const user = interaction.user;
    let userData = db.getUser(user.id);
    
    if (!userData) {
      userData = db.createUser(user.id, user.tag);
    }
    
    const embed = {
      color: 0x0099ff,
      title: '💳 كريديتاتك',
      thumbnail: { url: user.displayAvatarURL() },
      fields: [
        { name: 'المستخدم', value: user.tag, inline: true },
        { name: 'الكريدت', value: `${userData.credits}`, inline: true },
        { name: 'الرصيد', value: `$${userData.balance}`, inline: true },
        { name: 'التحذيرات', value: `${userData.warnings}`, inline: true }
      ],
      footer: { text: `تم الانضمام: ${userData.createdAt.split('T')[0]}` }
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
