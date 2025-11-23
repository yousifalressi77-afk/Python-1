const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('حذف الرسائل (Delete messages)')
    .addIntegerOption(option => option.setName('amount').setDescription('عدد الرسائل').setRequired(true).setMinValue(1).setMaxValue(100))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    
    try {
      await interaction.channel.bulkDelete(amount);
      const embed = {
        color: 0x00ff00,
        title: '✅ تم الحذف',
        description: `تم حذف **${amount}** رسالة من القناة`
      };
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      await interaction.reply({ content: '❌ خطأ في حذف الرسائل', ephemeral: true });
    }
  }
};
