const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sendembed')
    .setDescription('إرسال رسالة بـ embed (Send embed message)')
    .addChannelOption(option => option.setName('channel').setDescription('القناة').setRequired(true))
    .addStringOption(option => option.setName('title').setDescription('العنوان').setRequired(true))
    .addStringOption(option => option.setName('description').setDescription('الوصف').setRequired(true))
    .addStringOption(option => option.setName('color').setDescription('اللون (أحمر/أخضر/أزرق/ذهبي)').setRequired(false).addChoices([
      { name: 'أحمر', value: 'ff0000' },
      { name: 'أخضر', value: '00ff00' },
      { name: 'أزرق', value: '0000ff' },
      { name: 'ذهبي', value: 'ffd700' },
      { name: 'بنفسجي', value: '800080' },
      { name: 'سماوي', value: '00bfff' }
    ]))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const colorStr = interaction.options.getString('color') || '0000ff';
    const color = parseInt(colorStr, 16);

    try {
      const embed = {
        color: color,
        title: title,
        description: description,
        timestamp: new Date().toISOString()
      };

      await channel.send({ embeds: [embed] });
      
      const confirmEmbed = {
        color: 0x00ff00,
        title: '✅ تم إرسال الـ Embed',
        description: `تم الإرسال في <#${channel.id}>`,
        fields: [
          { name: 'العنوان', value: title },
          { name: 'الوصف', value: description.substring(0, 100) + (description.length > 100 ? '...' : '') }
        ]
      };

      await interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ خطأ في الإرسال!', ephemeral: true });
    }
  }
};
