const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, ChannelType } = require('discord.js');
const ticketDB = require('../utils/ticketdb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketaddoption')
    .setDescription('إضافة خيار جديد (Add new option)')
    .addStringOption(option => option.setName('option_name').setDescription('اسم الخيار').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const optionName = interaction.options.getString('option_name');
    
    const config = ticketDB.getTicketConfig(interaction.guildId);
    if (!config) {
      return await interaction.reply({ content: '❌ لم يتم إعداد نظام التكاتة! استخدم /ticketsetup أولاً', ephemeral: true });
    }

    const optionId = `ticket-option-${config.options.length + 1}`;
    config.options.push({
      value: optionId,
      label: optionName,
      description: 'فتح تكت جديد'
    });

    ticketDB.updateTicketConfig(interaction.guildId, config);

    // تحديث الرسالة في القناة
    try {
      const channel = await interaction.guild.channels.fetch(config.messageChannelId);
      const messages = await channel.messages.fetch({ limit: 10 });
      const msg = messages.find(m => m.id === config.messageId);

      if (msg) {
        const row = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('ticket-menu')
            .setPlaceholder('اختر خيار...')
            .addOptions(config.options)
        );

        await msg.edit({ components: [row] });
      }

      const embed = {
        color: 0x00ff00,
        title: '✅ تمت إضافة الخيار',
        description: `تم إضافة **${optionName}** للقائمة`,
        fields: [
          { name: 'إجمالي الخيارات', value: `${config.options.length}` }
        ]
      };

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ خطأ في تحديث القائمة!', ephemeral: true });
    }
  }
};
