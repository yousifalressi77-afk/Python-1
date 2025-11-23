const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('اقتباس ملهم (Inspiring quote)'),
  async execute(interaction) {
    const quotes = [
      { text: 'النجاح هو الذهاب من فشل إلى فشل دون فقدان الحماس', author: 'تشرشل' },
      { text: 'الطريقة الوحيدة للقيام بعمل عظيم هي أن تحب ما تفعله', author: 'ستيف جوبز' },
      { text: 'لا تيأس، فكل ليل وله فجر', author: 'مثل شعبي' },
      { text: 'من يرم بنفسه للمخاطر يموت نتيجة لذلك', author: 'شكسبير' },
      { text: 'الحياة جميلة إذا كنت تعرف كيفية عيشها', author: 'مثل صيني' }
    ];
    
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    
    const embed = {
      color: 0x00ff00,
      title: '💎 اقتباس',
      description: `"${quote.text}"\n\n— ${quote.author}`,
      footer: { text: 'اقتباس يومي' }
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
