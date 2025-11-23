const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('عرض صورة المستخدم (Show user avatar)')
    .addUserOption(option => option.setName('user').setDescription('المستخدم').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const avatarUrl = user.displayAvatarURL({ size: 1024 });
    
    const embed = {
      color: 0x0099ff,
      title: `صورة ${user.username}`,
      image: { url: avatarUrl },
      url: avatarUrl
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
