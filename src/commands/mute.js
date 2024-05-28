// File: mute.js (JavaScript)

const { Client, Intents, Collection } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const { muteUser } = require('../utils/helpers');
const { logMute } = require('../features/moderationLogs');

client.once('ready', () => {
    console.log('Bot is ready');
});

client.on('messageCreate', async (message) => {
    if (message.content.startsWith('!mute')) {
        const member = message.mentions.members.first();
        if (member) {
            const duration = message.content.split(' ')[2];
            const reason = message.content.split(' ').slice(3).join(' ');

            try {
                await muteUser(member, duration, reason);
                logMute(member, message.author, duration, reason);
                message.reply(`${member} has been muted for ${duration} minutes`);
            } catch (error) {
                console.error(error);
                message.reply('There was an error muting the user');
            }
        } else {
            message.reply('Please mention a user to mute');
        }
    }
});

client.login('your-bot-token');

module.exports = client;