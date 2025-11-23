module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Bot logged in as ${client.user.tag}`);
    client.user.setActivity('your commands', { type: 'LISTENING' });
  }
};
