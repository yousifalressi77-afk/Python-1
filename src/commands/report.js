const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('الإبلاغ عن مستخدم (Report user)')
    .addUserOption(option => option.setName('user').setDescription('المستخدم').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('السبب').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    
    const embed = {
      color: 0xff0000,
      title: '📋 تقرير جديد',
      fields: [
        { name: 'المُبلِّغ', value: interaction.user.tag, inline: true },
        { name: 'المُبلَّغ عنه', value: user.tag, inline: true },
        { name: 'السبب', value: reason, inline: false }
      ],
      timestamp: new Date().toISOString()
    };
    
    await interaction.reply({ content: '✅ تم إرسال التقرير', ephemeral: true });
  }
};
