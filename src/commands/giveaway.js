const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('إنشاء توزيع (Create giveaway)')
    .addStringOption(option => option.setName('prize').setDescription('الجائزة').setRequired(true))
    .addIntegerOption(option => option.setName('duration').setDescription('المدة (دقائق)').setRequired(true))
    .addIntegerOption(option => option.setName('winners').setDescription('عدد الفائزين').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const prize = interaction.options.getString('prize');
    const duration = interaction.options.getInteger('duration');
    const winners = interaction.options.getInteger('winners');
    
    const embed = {
      color: 0xffd700,
      title: '🎉 توزيع جوائز',
      description: `**الجائزة:** ${prize}\n**عدد الفائزين:** ${winners}\n**المدة:** ${duration} دقيقة`,
      footer: { text: 'اضغط ✅ للمشاركة' }
    };
    
    const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
    await msg.react('✅');
  }
};
