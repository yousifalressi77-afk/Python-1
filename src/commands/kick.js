const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('طرد مستخدم (Kick a user)')
    .addUserOption(option => option.setName('user').setDescription('المستخدم').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('السبب').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(user.id);
    const reason = interaction.options.getString('reason') || 'بدون سبب';
    
    try {
      await member.kick(reason);
      const embed = {
        color: 0xff6600,
        title: '🚪 تم الطرد',
        fields: [
          { name: 'المستخدم', value: `${user.tag}`, inline: true },
          { name: 'السبب', value: reason, inline: true }
        ]
      };
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ خطأ في الطرد', ephemeral: true });
    }
  }
};
