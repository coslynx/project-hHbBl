// ban.js

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

require('dotenv').config();
const { prefix, token } = process.env;

client.once('ready', () => {
  console.log('Ready!');
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'ban') {
    if (!message.member.permissions.has('BAN_MEMBERS')) {
      return message.reply('You do not have permission to use this command.');
    }
    
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.members.resolve(user);
      if (member) {
        try {
          await member.ban();
          message.channel.send(`${user.tag} has been banned.`);
        } catch (error) {
          console.error(error);
          message.channel.send('There was an error trying to ban that user.');
        }
      } else {
        message.reply('That user is not in this server.');
      }
    } else {
      message.reply('You need to mention a user to ban.');
    }
  }
});

client.login(token);