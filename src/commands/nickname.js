const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nickname')
    .setDescription('تغيير الاسم المستعار (Change nickname)')
    .addUserOption(option => option.setName('user').setDescription('المستخدم').setRequired(true))
    .addStringOption(option => option.setName('name').setDescription('الاسم الجديد').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const name = interaction.options.getString('name');
    const member = await interaction.guild.members.fetch(user.id);
    
    try {
      await member.setNickname(name);
      const embed = {
        color: 0x00ff00,
        title: '✅ تم التعديل',
        fields: [
          { name: 'المستخدم', value: user.tag, inline: true },
          { name: 'الاسم الجديد', value: name, inline: true }
        ]
      };
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ خطأ', ephemeral: true });
    }
  }
};
