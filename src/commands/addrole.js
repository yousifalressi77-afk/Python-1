const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('إضافة دور (Add role)')
    .addUserOption(option => option.setName('user').setDescription('المستخدم').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('الدور').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');
    const member = await interaction.guild.members.fetch(user.id);
    
    try {
      await member.roles.add(role);
      const embed = {
        color: 0x00ff00,
        title: '✅ تمت الإضافة',
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
