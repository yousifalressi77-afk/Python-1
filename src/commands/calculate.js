const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calculate')
    .setDescription('حساب رياضي (Math calculation)')
    .addStringOption(option => option.setName('expression').setDescription('التعبير (مثال: 5+3*2)').setRequired(true)),
  async execute(interaction) {
    const expression = interaction.options.getString('expression');
    
    try {
      const result = eval(expression);
      
      const embed = {
        color: 0x0099ff,
        title: '🧮 الحساب',
        fields: [
          { name: 'التعبير', value: `${expression}`, inline: true },
          { name: 'النتيجة', value: `${result}`, inline: true }
        ]
      };
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ خطأ في التعبير الرياضي!', ephemeral: true });
    }
  }
};
