const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('إنشاء استطلاع (Create a poll)')
    .addStringOption(option => option.setName('question').setDescription('السؤال').setRequired(true))
    .addStringOption(option => option.setName('option1').setDescription('الخيار الأول').setRequired(true))
    .addStringOption(option => option.setName('option2').setDescription('الخيار الثاني').setRequired(true))
    .addStringOption(option => option.setName('option3').setDescription('الخيار الثالث').setRequired(false)),
  async execute(interaction) {
    const question = interaction.options.getString('question');
    const option1 = interaction.options.getString('option1');
    const option2 = interaction.options.getString('option2');
    const option3 = interaction.options.getString('option3');
    
    let options = `\n1️⃣ ${option1}\n2️⃣ ${option2}`;
    if (option3) options += `\n3️⃣ ${option3}`;
    
    const embed = {
      color: 0x00ff00,
      title: '📊 استطلاع رأي',
      description: `**${question}**${options}`,
      footer: { text: 'صوت باستخدام الرموز التعبيرية' }
    };
    
    const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
    await msg.react('1️⃣');
    await msg.react('2️⃣');
    if (option3) await msg.react('3️⃣');
  }
};
