const { SlashCommandBuilder } = require('discord.js');
const db = require('../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('givecredits')
    .setDescription('إعطاء كريدت لمستخدم آخر (Give credits to another user)')
    .addUserOption(option => option.setName('user').setDescription('المستخدم').setRequired(true))
    .addIntegerOption(option => option.setName('amount').setDescription('المبلغ').setRequired(true).setMinValue(1)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    const sender = interaction.user;
    
    // التحقق من كريدت المرسل
    let senderData = db.getUser(sender.id);
    if (!senderData) {
      return await interaction.reply({ content: '❌ ليس لديك كريدت!', ephemeral: true });
    }
    
    if (senderData.credits < amount) {
      return await interaction.reply({ content: `❌ ليس لديك ${amount} كريدت! لديك فقط ${senderData.credits}`, ephemeral: true });
    }
    
    // طرح من المرسل وإضافة للمتلقي
    const updatedSender = db.addCredits(sender.id, sender.tag, -amount);
    const updatedReceiver = db.addCredits(user.id, user.tag, amount);
    
    const embed = {
      color: 0x00ff00,
      title: '✅ تم التحويل',
      fields: [
        { name: 'من', value: sender.tag, inline: true },
        { name: 'إلى', value: user.tag, inline: true },
        { name: 'المبلغ', value: `${amount}`, inline: true },
        { name: 'كريدتك الجديد', value: `${updatedSender.credits}`, inline: true },
        { name: 'كريدت المتلقي', value: `${updatedReceiver.credits}`, inline: true }
      ]
    };
    
    await interaction.reply({ embeds: [embed] });
  }
};
