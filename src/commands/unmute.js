const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('إلغاء الإسكات (Unmute a user)')
    .addUserOption(option => option.setName('user').setDescription('المستخدم').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(user.id);
    
    try {
      await member.timeout(null);
      const embed = {
        color: 0x00ff00,
        title: '🔊 تم إلغاء الإسكات',
        fields: [
          { name: 'المستخدم', value: `${user.tag}`, inline: true }
        ]
      };
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ خطأ', ephemeral: true });
    }
  }
};
