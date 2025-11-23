const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('سؤال الكرة الثمانية (Magic 8 Ball)')
    .addStringOption(option => option.setName('question').setDescription('سؤالك').setRequired(true)),
  async execute(interaction) {
    const answers = [
      'نعم بالتأكيد! ✅',
      'لا، بالتأكيد لا! ❌',
      'ربما... 🤔',
      'الفرصة سانحة 💫',
      'اسأل لاحقاً 🔮',
      'بدون شك! 💯',
      'لا تعتمد عليه! ⚠️',
      'لا أستطيع أن أتنبأ 🌫️'
    ];
    
    const answer = answers[Math.floor(Math.random() * answers.length)];
    
    const embed = {
      color: 0x9400d3,
      title: '🔮 الكرة الثمانية',
      fields: [
        { name: 'سؤالك', value: interaction.options.getString('question'), inline: false },
        { name: 'الإجابة', value: answer, inline: false }
      ]
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
