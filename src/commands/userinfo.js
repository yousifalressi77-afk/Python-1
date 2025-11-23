const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('معلومات المستخدم (User information)')
    .addUserOption(option => option.setName('user').setDescription('المستخدم').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);
    
    const embed = {
      color: 0x0099ff,
      title: '👤 معلومات المستخدم',
      thumbnail: { url: user.displayAvatarURL() },
      fields: [
        { name: 'المستخدم', value: user.tag, inline: true },
        { name: 'الـ ID', value: user.id, inline: true },
        { name: 'تاريخ التسجيل', value: user.createdAt.toLocaleDateString('ar-SA'), inline: true },
        { name: 'تاريخ الانضمام', value: member.joinedAt.toLocaleDateString('ar-SA'), inline: true },
        { name: 'عدد الأدوار', value: member.roles.cache.size.toString(), inline: true },
        { name: 'Moderator', value: member.permissions.has('ModerateMembers') ? '✅ نعم' : '❌ لا', inline: true }
      ]
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
