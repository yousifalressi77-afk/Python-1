const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setprefix')
    .setDescription('تعيين البادئة (Set prefix)')
    .addStringOption(option => option.setName('prefix').setDescription('البادئة الجديدة').setRequired(true).setMaxLength(5))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const prefix = interaction.options.getString('prefix');
    
    const embed = {
      color: 0x00ff00,
      title: '✅ تم التعديل',
      description: `تم تعديل البادئة إلى: \`${prefix}\``
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
