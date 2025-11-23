const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('نكتة عشوائية (Random joke)'),
  async execute(interaction) {
    const jokes = [
      'ليش الكمبيوتر حزين؟ لأنه فقد ملفاته! 😅',
      'كم يزن البطريق؟ بقدر كفايته! 🐧',
      'ليش البيضة حمراء؟ لأنها تخجل! 🔴',
      'مين أسرع - الشمس أو القمر؟ الشمس، لأن القمر يطلع بالليل! 🌙',
      'كيف تعتذر البطاطس؟ بـ "سوري"! 🍟'
    ];
    
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    
    const embed = {
      color: 0xffff00,
      title: '😂 نكتة',
      description: joke
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
