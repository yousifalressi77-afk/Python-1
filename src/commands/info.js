const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('معلومات البوت (Bot information)'),
  async execute(interaction) {
    const embed = {
      color: 0x0099ff,
      title: '🤖 معلومات البوت',
      thumbnail: { url: interaction.client.user.displayAvatarURL() },
      fields: [
        { name: 'اسم البوت', value: interaction.client.user.username, inline: true },
        { name: 'المبرمج', value: '**ALSHARQI** 💻', inline: true },
        { name: 'الأونر', value: '**ALSHARQI** 👑', inline: true },
        { name: 'الـ ID', value: interaction.client.user.id, inline: true },
        { name: 'عدد السيرفرات', value: interaction.client.guilds.cache.size.toString(), inline: true },
        { name: 'وقت التشغيل', value: `${Math.floor(interaction.client.uptime / 1000 / 60)} دقيقة`, inline: true },
        { name: 'الحالة', value: '✅ أونلاين', inline: true },
        { name: 'الأوامر المتاحة', value: '26+', inline: true }
      ],
      footer: { text: 'مطور بواسطة ALSHARQI' }
    };

    await interaction.reply({ embeds: [embed] });
  }
};
