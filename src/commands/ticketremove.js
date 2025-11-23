const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketremove')
    .setDescription('إزالة مستخدم من التكت (Remove user from ticket)')
    .addUserOption(option => option.setName('user').setDescription('المستخدم').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    
    if (!interaction.channel.name.startsWith('ticket-')) {
      return await interaction.reply({ content: '❌ هذه القناة ليست تكت!', ephemeral: true });
    }
    
    try {
      await interaction.channel.permissionOverwrites.delete(user);
      
      const embed = {
        color: 0xff0000,
        title: '✅ تمت الإزالة',
        description: `تم إزالة ${user.tag} من التكت`
      };
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ خطأ في إزالة المستخدم!', ephemeral: true });
    }
  }
};
