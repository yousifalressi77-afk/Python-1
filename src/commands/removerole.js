const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removerole')
    .setDescription('إزالة دور (Remove role)')
    .addUserOption(option => option.setName('user').setDescription('المستخدم').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('الدور').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');
    const member = await interaction.guild.members.fetch(user.id);
    
    try {
      await member.roles.remove(role);
      const embed = {
        color: 0xff0000,
        title: '✅ تمت الإزالة',
        fields: [
          { name: 'المستخدم', value: user.tag, inline: true },
          { name: 'الدور', value: role.name, inline: true }
        ]
      };
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ خطأ', ephemeral: true });
    }
  }
};
