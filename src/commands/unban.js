const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('إلغاء الحظر (Unban user)')
    .addUserOption(option => option.setName('user').setDescription('المستخدم').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    
    try {
      await interaction.guild.bans.remove(user);
      const embed = {
        color: 0x00ff00,
        title: '✅ تم إلغاء الحظر',
        fields: [
          { name: 'المستخدم', value: user.tag, inline: true }
        ]
      };
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ خطأ', ephemeral: true });
    }
  }
};
