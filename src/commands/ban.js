const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('حظر مستخدم (Ban a user)')
    .addUserOption(option => option.setName('user').setDescription('المستخدم').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('السبب').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'بدون سبب';
    
    try {
      await interaction.guild.bans.create(user, { reason });
      const embed = {
        color: 0xff0000,
        title: '🚫 تم الحظر',
        fields: [
          { name: 'المستخدم', value: `${user.tag}`, inline: true },
          { name: 'السبب', value: reason, inline: true }
        ]
      };
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ خطأ في الحظر', ephemeral: true });
    }
  }
};
