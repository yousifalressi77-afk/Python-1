const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketclose')
    .setDescription('إغلاق التكت (Close a ticket)')
    .addStringOption(option => option.setName('reason').setDescription('سبب الإغلاق').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const reason = interaction.options.getString('reason') || 'بدون سبب';
    
    if (!interaction.channel.name.startsWith('ticket-')) {
      return await interaction.reply({ content: '❌ هذه القناة ليست تكت!', ephemeral: true });
    }
    
    await interaction.reply({ content: '🔄 جاري إغلاق التكت...' });
    
    setTimeout(async () => {
      const embed = {
        color: 0xff0000,
        title: '❌ تم إغلاق التكت',
        fields: [
          { name: 'أغلقه', value: interaction.user.tag, inline: true },
          { name: 'السبب', value: reason, inline: true }
        ]
      };
      
      await interaction.channel.send({ embeds: [embed] });
      await interaction.channel.delete().catch(() => {});
    }, 2000);
  }
};
