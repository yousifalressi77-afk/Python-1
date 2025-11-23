const { ChannelType } = require('discord.js');
const ticketDB = require('../utils/ticketdb');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    // Slash Commands
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
          await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
      }
    }

    // Select Menu
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'ticket-menu') {
        const config = ticketDB.getTicketConfig(interaction.guildId);
        
        if (!config) {
          return await interaction.reply({ content: '❌ نظام التكاتة غير مُعد!', ephemeral: true });
        }

        try {
          const ticketNumber = Math.floor(Math.random() * 10000);
          const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}-${ticketNumber}`,
            type: ChannelType.GuildText,
            parent: config.categoryId,
            permissionOverwrites: [
              {
                id: interaction.guildId,
                deny: ['ViewChannel']
              },
              {
                id: interaction.user.id,
                allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
              },
              {
                id: config.viewRoleId,
                allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
              }
            ]
          });

          const ticketEmbed = {
            color: 0x00ff00,
            title: '🎫 تكت جديد',
            description: `مرحباً **${interaction.user.tag}**!\n\nشكراً لتواصلك معنا، سنقوم بمساعدتك قريباً.`,
            fields: [
              { name: '👤 الفاتح', value: `${interaction.user}`, inline: true },
              { name: '⏰ الوقت', value: `<t:${Math.floor(Date.now() / 1000)}:f>`, inline: true },
              { name: '📝 الخيار', value: interaction.values[0] || 'تكت عام', inline: false },
              { name: '✅ الحالة', value: 'مفتوح', inline: true }
            ],
            footer: { text: 'الرجاء انتظار رد الفريق' },
            timestamp: new Date().toISOString()
          };

          const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('ticket-claim').setLabel('استقبال').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('ticket-add').setLabel('إضافة عضو').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('ticket-close').setLabel('إغلاق').setStyle(ButtonStyle.Danger)
          );

          await channel.send({ embeds: [ticketEmbed], components: [row] });

          await interaction.reply({ content: `✅ تم فتح التكت في <#${channel.id}>`, ephemeral: true });
        } catch (error) {
          console.error(error);
          await interaction.reply({ content: '❌ خطأ في فتح التكت!', ephemeral: true });
        }
      }
    }

    // Buttons
    if (interaction.isButton()) {
      // Ticket actions
      if (interaction.customId === 'ticket-claim') {
        const embed = {
          color: 0x00ff00,
          title: '✅ تم استقبال التكت',
          description: `${interaction.user} تولى هذا التكت`,
          timestamp: new Date().toISOString()
        };
        await interaction.reply({ embeds: [embed] });
      }

      if (interaction.customId === 'ticket-add') {
        await interaction.reply({ content: 'استخدم: `/ticketadd @user`', ephemeral: true });
      }

      if (interaction.customId === 'ticket-close') {
        await interaction.reply({ content: '🔄 جاري إغلاق التكت...' });
        
        setTimeout(async () => {
          try {
            await interaction.channel.delete();
          } catch (error) {
            console.error(error);
          }
        }, 2000);
      }
    }
  }
};
