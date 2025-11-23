const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ticketDB = require('../utils/ticketdb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketinfo')
    .setDescription('معلومات نظام التكاتة')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const config = await ticketDB.getTicketConfig(interaction.guildId);
    
    if (!config) {
      return await interaction.reply({ content: '❌ لم يتم إعداد نظام التكاتة!', ephemeral: true });
    }

    let optionsText = '';
    if (config.options && Array.isArray(config.options)) {
      config.options.forEach((opt, index) => {
        optionsText += `${index + 1}. **${opt.label}**\n`;
      });
    }

    const embed = {
      color: 0x0099ff,
      title: '📋 معلومات نظام التكاتة',
      fields: [
        { name: 'فئة التكاتة', value: `<#${config.category_id}>`, inline: false },
        { name: 'قناة الرسالة', value: `<#${config.channel_id}>`, inline: false },
        { name: 'رتبة الرؤية', value: `<@&${config.support_role_id}>`, inline: false },
        { name: 'الخيارات', value: optionsText || 'لا توجد خيارات', inline: false }
      ]
    };

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
