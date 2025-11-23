const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, ChannelType } = require('discord.js');
const ticketDB = require('../utils/ticketdb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketsetup')
    .setDescription('إعداد نظام التكاتة (Setup ticket system)')
    .addChannelOption(option => option.setName('category').setDescription('فئة التكاتة').setRequired(true).addChannelTypes(ChannelType.GuildCategory))
    .addChannelOption(option => option.setName('message_channel').setDescription('قناة الرسالة الثابتة').setRequired(true))
    .addChannelOption(option => option.setName('open_channel').setDescription('القناة المسؤولة عن فتح التكاتة').setRequired(true))
    .addRoleOption(option => option.setName('view_role').setDescription('رتبة رؤية التكاتة').setRequired(true))
    .addStringOption(option => option.setName('message').setDescription('نص الرسالة').setRequired(true))
    .addStringOption(option => option.setName('option_name').setDescription('اسم الخيار (الأول)').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const category = interaction.options.getChannel('category');
    const messageChannel = interaction.options.getChannel('message_channel');
    const openChannel = interaction.options.getChannel('open_channel');
    const viewRole = interaction.options.getRole('view_role');
    const message = interaction.options.getString('message');
    const optionName = interaction.options.getString('option_name');

    const config = {
      categoryId: category.id,
      messageChannelId: messageChannel.id,
      openChannelId: openChannel.id,
      viewRoleId: viewRole.id,
      message: message,
      messageId: null,
      options: [
        {
          value: 'ticket-option-1',
          label: optionName,
          description: 'فتح تكت جديد'
        }
      ]
    };

    ticketDB.setupTicketSystem(interaction.guildId, config);

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('ticket-menu')
        .setPlaceholder('اختر خيار...')
        .addOptions(
          {
            label: optionName,
            value: 'ticket-option-1',
            description: 'فتح تكت جديد'
          }
        )
    );

    try {
      const msg = await messageChannel.send({
        content: message,
        components: [row]
      });
      
      config.messageId = msg.id;
      ticketDB.setupTicketSystem(interaction.guildId, config);

      const embed = {
        color: 0x00ff00,
        title: '✅ تم إعداد نظام التكاتة',
        fields: [
          { name: 'الفئة', value: category.name, inline: true },
          { name: 'قناة الرسالة', value: messageChannel.name, inline: true },
          { name: 'قناة الفتح', value: openChannel.name, inline: true },
          { name: 'رتبة الرؤية', value: viewRole.name, inline: true },
          { name: 'الخيار', value: optionName, inline: true }
        ]
      };

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ خطأ في الإعداد!', ephemeral: true });
    }
  }
};
