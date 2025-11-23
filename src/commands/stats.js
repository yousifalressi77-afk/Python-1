const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('إحصائيات شاملة (Full statistics)'),
  async execute(interaction) {
    const guild = interaction.guild;
    const members = guild.members.cache;
    const bots = members.filter(m => m.user.bot).size;
    const humans = guild.memberCount - bots;
    
    const embed = {
      color: 0x0099ff,
      title: '📊 الإحصائيات',
      fields: [
        { name: 'إجمالي الأعضاء', value: guild.memberCount.toString(), inline: true },
        { name: 'البشر', value: humans.toString(), inline: true },
        { name: 'البوتات', value: bots.toString(), inline: true },
        { name: 'القنوات النصية', value: guild.channels.cache.filter(c => c.isTextBased()).size.toString(), inline: true },
        { name: 'قنوات الصوت', value: guild.channels.cache.filter(c => c.isVoiceBased()).size.toString(), inline: true },
        { name: 'الأدوار', value: guild.roles.cache.size.toString(), inline: true }
      ]
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
