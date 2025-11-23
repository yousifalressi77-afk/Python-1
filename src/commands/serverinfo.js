const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('معلومات السيرفر (Server information)'),
  async execute(interaction) {
    const guild = interaction.guild;
    
    const embed = {
      color: 0x0099ff,
      title: `🏰 معلومات السيرفر - ${guild.name}`,
      thumbnail: { url: guild.iconURL() },
      fields: [
        { name: 'الـ ID', value: guild.id, inline: true },
        { name: 'المالك', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'عدد الأعضاء', value: guild.memberCount.toString(), inline: true },
        { name: 'عدد القنوات', value: guild.channels.cache.size.toString(), inline: true },
        { name: 'عدد الأدوار', value: guild.roles.cache.size.toString(), inline: true },
        { name: 'تاريخ الإنشاء', value: guild.createdAt.toLocaleDateString('ar-SA'), inline: true },
        { name: 'الحماية', value: guild.verificationLevel.toString(), inline: true },
        { name: 'البوستات', value: guild.premiumSubscriptionCount.toString(), inline: true }
      ]
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
