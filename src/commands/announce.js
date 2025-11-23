const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('إرسال إعلان (Send announcement)')
    .addStringOption(option => option.setName('message').setDescription('الرسالة').setRequired(true))
    .addChannelOption(option => option.setName('channel').setDescription('القناة').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const message = interaction.options.getString('message');
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    
    const embed = {
      color: 0xff0000,
      title: '📢 إعلان هام',
      description: message,
      timestamp: new Date().toISOString()
    };
    
    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ تم إرسال الإعلان', ephemeral: true });
  }
};
