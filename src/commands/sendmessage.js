const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sendmessage')
    .setDescription('إرسال رسالة عادية (Send plain message)')
    .addChannelOption(option => option.setName('channel').setDescription('القناة').setRequired(true))
    .addStringOption(option => option.setName('message').setDescription('نص الرسالة').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const message = interaction.options.getString('message');

    try {
      await channel.send(message);
      
      const embed = {
        color: 0x00ff00,
        title: '✅ تم إرسال الرسالة',
        description: `تم الإرسال في <#${channel.id}>`,
        fields: [
          { name: 'المحتوى', value: message.substring(0, 100) + (message.length > 100 ? '...' : '') }
        ]
      };

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ خطأ في الإرسال!', ephemeral: true });
    }
  }
};
