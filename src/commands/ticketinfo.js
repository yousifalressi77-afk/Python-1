const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ticketDB = require('../utils/ticketdb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketinfo')
    .setDescription('معلومات نظام التكاتة')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const config = ticketDB.getTicketConfig(interaction.guildId);
    
    if (!config) {
      return await interaction.reply({ content: '❌ لم يتم إعداد نظام التكاتة!', ephemeral: true });
    }

    let buttonsText = '';
    config.buttons.forEach((btn, index) => {
      buttonsText += `${index + 1}. **${btn.label}**\n`;
    });

    const embed = {
      color: 0x0099ff,
      title: '📋 معلومات نظام التكاتة',
      fields: [
        { name: 'فئة التكاتة', value: `<#${config.categoryId}>`, inline: false },
        { name: 'قناة الرسالة', value: `<#${config.messageChannelId}>`, inline: false },
        { name: 'رتبة الرؤية', value: `<@&${config.viewRoleId}>`, inline: false },
        { name: 'الأزرار', value: buttonsText || 'لا توجد أزرار', inline: false }
      ]
    };

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
