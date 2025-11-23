const { SlashCommandBuilder } = require('discord.js');
const db = require('../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('لوحة الترتيب (Leaderboard)'),
  async execute(interaction) {
    const users = db.getAllUsers()
      .sort((a, b) => b.credits - a.credits)
      .slice(0, 10);
    
    let leaderboardText = '';
    users.forEach((user, index) => {
      leaderboardText += `**${index + 1}.** ${user.username} - ${user.credits} كريدت\n`;
    });
    
    const embed = {
      color: 0xffd700,
      title: '🏆 لوحة الترتيب',
      description: leaderboardText || 'لا توجد بيانات',
      footer: { text: 'أكثر 10 لاعبين كريديتاً' }
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
