const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketopen')
    .setDescription('فتح تكت جديد (Open a new ticket)')
    .addStringOption(option => option.setName('reason').setDescription('سبب التكت').setRequired(true)),
  async execute(interaction) {
    const reason = interaction.options.getString('reason');
    const user = interaction.user;
    
    try {
      const channel = await interaction.guild.channels.create({
        name: `ticket-${user.username}`,
        type: 0,
        parent: null,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: ['ViewChannel']
          },
          {
            id: user.id,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
          }
        ]
      });
      
      const embed = {
        color: 0x00ff00,
        title: '✅ تم فتح التكت',
        fields: [
          { name: 'رقم التكت', value: channel.id, inline: true },
          { name: 'القناة', value: `<#${channel.id}>`, inline: true },
          { name: 'السبب', value: reason, inline: false }
        ]
      };
      
      await channel.send({ embeds: [embed] });
      await interaction.reply({ content: `✅ تم فتح التكت في <#${channel.id}>`, ephemeral: false });
    } catch (error) {
      await interaction.reply({ content: '❌ خطأ في فتح التكت!', ephemeral: true });
    }
  }
};
