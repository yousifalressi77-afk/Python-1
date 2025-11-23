const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remind')
    .setDescription('تذكير (Set a reminder)')
    .addStringOption(option => option.setName('message').setDescription('الرسالة').setRequired(true))
    .addIntegerOption(option => option.setName('seconds').setDescription('الوقت بالثواني').setRequired(true).setMinValue(1)),
  async execute(interaction) {
    const message = interaction.options.getString('message');
    const seconds = interaction.options.getInteger('seconds');
    
    const embed = {
      color: 0x00ff00,
      title: '✅ تم تعيين التذكير',
      fields: [
        { name: 'الرسالة', value: message },
        { name: 'بعد', value: `${seconds} ثانية` }
      ]
    };
    
    await interaction.reply({ embeds: [embed] });
    
    setTimeout(() => {
      const remindEmbed = {
        color: 0xffff00,
        title: '🔔 تذكير',
        description: message,
        footer: { text: 'تم التذكير' }
      };
      
      interaction.user.send({ embeds: [remindEmbed] }).catch(() => {});
    }, seconds * 1000);
  }
};
