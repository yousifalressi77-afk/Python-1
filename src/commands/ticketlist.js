const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketlist')
    .setDescription('عرض جميع التكاتة (List all tickets)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const tickets = interaction.guild.channels.cache.filter(ch => ch.name.startsWith('ticket-'));
    
    if (tickets.size === 0) {
      return await interaction.reply({ content: '❌ لا توجد تكاتة مفتوحة!', ephemeral: true });
    }
    
    let ticketList = '';
    tickets.forEach((ticket, index) => {
      ticketList += `${index + 1}. <#${ticket.id}>\n`;
    });
    
    const embed = {
      color: 0x0099ff,
      title: '📋 قائمة التكاتة',
      description: ticketList,
      footer: { text: `إجمالي: ${tickets.size}` }
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
