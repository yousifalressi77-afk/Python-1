const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('ميم عشوائي (Random meme)'),
  async execute(interaction) {
    const memes = [
      'أنت: أدرس غداً\nغداً: أدرس بعد غداً 📚',
      'أمي: لا تأكل الحلويات\nأنا بسرعة: 🍫🍬',
      'الامتحان سهل\nالامتحان الفعلي: 💀',
      'الإجازة: 3 أيام\nالدراسة: سنة كاملة 😭',
      'تويتر والواتس: مجاني\nالانترنت: فقط 1 GB 😤'
    ];
    
    const meme = memes[Math.floor(Math.random() * memes.length)];
    
    const embed = {
      color: 0xff1493,
      title: '😂 ميم عشوائي',
      description: meme
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
