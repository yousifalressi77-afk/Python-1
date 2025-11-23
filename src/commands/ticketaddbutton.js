const { SlashCommandBuilder, PermissionFlagsBits, ButtonStyle } = require('discord.js');
const ticketDB = require('../utils/ticketdb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketaddbutton')
    .setDescription('إضافة زر جديد (Add new button)')
    .addStringOption(option => option.setName('button_name').setDescription('اسم الزر').setRequired(true))
    .addStringOption(option => option.setName('color').setDescription('لون الزر (Primary/Success/Danger)').setRequired(true).addChoices([
      { name: 'أزرق', value: 'Primary' },
      { name: 'أخضر', value: 'Success' },
      { name: 'أحمر', value: 'Danger' },
      { name: 'رمادي', value: 'Secondary' }
    ]))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const buttonName = interaction.options.getString('button_name');
    const color = interaction.options.getString('color');
    
    const config = ticketDB.getTicketConfig(interaction.guildId);
    if (!config) {
      return await interaction.reply({ content: '❌ لم يتم إعداد نظام التكاتة! استخدم /ticketsetup أولاً', ephemeral: true });
    }

    const buttonId = `open-ticket-${config.buttons.length + 1}`;
    config.buttons.push({
      id: buttonId,
      label: buttonName,
      color: ButtonStyle[color]
    });

    ticketDB.setupTicketSystem(interaction.guildId, config);

    const embed = {
      color: 0x00ff00,
      title: '✅ تمت إضافة الزر',
      fields: [
        { name: 'الاسم', value: buttonName, inline: true },
        { name: 'اللون', value: color, inline: true }
      ]
    };

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
