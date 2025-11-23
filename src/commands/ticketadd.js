const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketadd')
    .setDescription('إضافة عضو للتكت (Add member to ticket)')
    .addUserOption(option => option.setName('user').setDescription('المستخدم').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    
    if (!interaction.channel.name.startsWith('ticket-')) {
      return await interaction.reply({ content: '❌ هذه القناة ليست تكت!', ephemeral: true });
    }

    try {
      await interaction.channel.permissionOverwrites.create(user, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true
      });

      const embed = {
        color: 0x00ff00,
        title: '✅ تمت الإضافة',
        description: `تم إضافة ${user.tag} للتكت`
      };

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ خطأ في إضافة العضو!', ephemeral: true });
    }
  }
};
