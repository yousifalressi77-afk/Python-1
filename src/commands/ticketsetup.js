const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const ticketDB = require('../utils/ticketdb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketsetup')
    .setDescription('إعداد نظام التكاتة (Setup ticket system)')
    .addChannelOption(option => option.setName('category').setDescription('فئة التكاتة').setRequired(true).addChannelTypes(ChannelType.GuildCategory))
    .addChannelOption(option => option.setName('message_channel').setDescription('قناة الرسالة الثابتة').setRequired(true))
    .addRoleOption(option => option.setName('view_role').setDescription('رتبة رؤية التكاتة').setRequired(true))
    .addStringOption(option => option.setName('message').setDescription('نص الرسالة').setRequired(true))
    .addStringOption(option => option.setName('button_name').setDescription('اسم الزر (الأول)').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const category = interaction.options.getChannel('category');
    const messageChannel = interaction.options.getChannel('message_channel');
    const viewRole = interaction.options.getRole('view_role');
    const message = interaction.options.getString('message');
    const buttonName = interaction.options.getString('button_name');

    const config = {
      categoryId: category.id,
      messageChannelId: messageChannel.id,
      viewRoleId: viewRole.id,
      message: message,
      buttons: [
        {
          id: 'open-ticket-1',
          label: buttonName,
          color: ButtonStyle.Primary
        }
      ]
    };

    ticketDB.setupTicketSystem(interaction.guildId, config);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('open-ticket-1')
        .setLabel(buttonName)
        .setStyle(ButtonStyle.Primary)
    );

    try {
      await messageChannel.send({
        content: message,
        components: [row]
      });

      const embed = {
        color: 0x00ff00,
        title: '✅ تم إعداد نظام التكاتة',
        fields: [
          { name: 'الفئة', value: category.name, inline: true },
          { name: 'قناة الرسالة', value: messageChannel.name, inline: true },
          { name: 'رتبة الرؤية', value: viewRole.name, inline: true },
          { name: 'الزر', value: buttonName, inline: true }
        ]
      };

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      await interaction.reply({ content: '❌ خطأ في الإعداد!', ephemeral: true });
    }
  }
};
