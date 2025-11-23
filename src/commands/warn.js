const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('تحذير مستخدم (Warn a user)')
    .addUserOption(option => option.setName('user').setDescription('المستخدم').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('السبب').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    
    try {
      // إرسال رسالة بالخاص للمستخدم
      const dmEmbed = {
        color: 0xffaa00,
        title: '⚠️ تحذير من الإدارة',
        description: `تم تحذيرك من قبل **${interaction.user.tag}**`,
        fields: [
          { name: 'السبب', value: reason, inline: false }
        ],
        timestamp: new Date().toISOString()
      };
      
      await user.send({ embeds: [dmEmbed] });
    } catch (error) {
      console.log(`تعذر إرسال رسالة خاصة للمستخدم ${user.tag}`);
    }
    
    const embed = {
      color: 0xffaa00,
      title: '⚠️ تحذير',
      fields: [
        { name: 'المستخدم', value: `${user.tag}`, inline: true },
        { name: 'السبب', value: reason, inline: true },
        { name: 'من', value: `${interaction.user.tag}`, inline: true }
      ],
      timestamp: new Date().toISOString()
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
