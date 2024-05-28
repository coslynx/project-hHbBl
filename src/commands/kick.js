// File: kick.js (JavaScript)

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

require('dotenv').config();
const { prefix, token } = process.env;

client.once('ready', () => {
  console.log('Bot is ready to kick users!');
});

client.on('messageCreate', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'kick') {
    if (!message.member.permissions.has('KICK_MEMBERS')) {
      return message.reply('You do not have permission to kick users!');
    }
    
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.members.resolve(user);
      if (member) {
        try {
          await member.kick();
          message.channel.send(`${user.tag} has been kicked!`);
        } catch (error) {
          console.error(error);
          message.channel.send('There was an error kicking the user.');
        }
      } else {
        message.channel.send('That user is not in the server.');
      }
    } else {
      message.channel.send('You need to mention a user to kick.');
    }
  }
});

client.login(token);