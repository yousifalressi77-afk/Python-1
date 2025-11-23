const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addcredit')
    .setDescription('إضافة كريدت لمستخدم (Add credits to user)')
    .addUserOption(option => option.setName('user').setDescription('المستخدم').setRequired(true))
    .addIntegerOption(option => option.setName('amount').setDescription('المبلغ').setRequired(true).setMinValue(1))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    
    const userData = db.addCredits(user.id, user.tag, amount);
    
    const embed = {
      color: 0x00ff00,
      title: '✅ تمت الإضافة',
      fields: [
        { name: 'المستخدم', value: `${user.tag}`, inline: true },
        { name: 'المبلغ المضاف', value: `${amount}`, inline: true },
        { name: 'الكريدت الكلي', value: `${userData.credits}`, inline: true },
        { name: 'أضافه', value: `${interaction.user.tag}`, inline: true }
      ],
      timestamp: new Date().toISOString()
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
