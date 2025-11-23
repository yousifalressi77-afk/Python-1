const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('إسكات مستخدم (Mute a user)')
    .addUserOption(option => option.setName('user').setDescription('المستخدم').setRequired(true))
    .addIntegerOption(option => option.setName('duration').setDescription('المدة (دقائق)').setRequired(false))
    .addStringOption(option => option.setName('reason').setDescription('السبب').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(user.id);
    const duration = interaction.options.getInteger('duration') || 10;
    const reason = interaction.options.getString('reason') || 'بدون سبب';
    
    try {
      await member.timeout(duration * 60 * 1000, reason);
      const embed = {
        color: 0xffff00,
        title: '🔇 تم الإسكات',
        fields: [
          { name: 'المستخدم', value: `${user.tag}`, inline: true },
          { name: 'المدة', value: `${duration} دقيقة`, inline: true },
          { name: 'السبب', value: reason, inline: true }
        ]
      };
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ خطأ في الإسكات', ephemeral: true });
    }
  }
};
