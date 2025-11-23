const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('دعوة البوت (Invite bot)'),
  async execute(interaction) {
    const botId = interaction.client.user.id;
    const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${botId}&permissions=8&scope=bot%20applications.commands`;
    
    const embed = {
      color: 0x0099ff,
      title: '🔗 دعوة البوت',
      description: `[اضغط هنا لدعوة البوت](${inviteUrl})`,
      fields: [
        { name: 'الصلاحيات', value: 'مسؤول كامل', inline: true }
      ]
    };
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
