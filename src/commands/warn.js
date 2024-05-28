// File: src/commands/warn.js (JavaScript)

const { Client, Message, MessageEmbed } = require('discord.js');
const { logWarn } = require('../utils/logger');

/**
 * Warns a user for a minor infraction.
 * @param {Client} client - The Discord client
 * @param {Message} message - The message that triggered the command
 * @param {Array} args - The arguments provided with the command
 */
const warnCommand = async (client, message, args) => {
    if (!message.member.hasPermission('KICK_MEMBERS')) {
        return message.reply('You do not have permission to use this command.');
    }

    const user = message.mentions.users.first();
    if (!user) {
        return message.reply('Please mention the user to warn.');
    }

    const reason = args.slice(1).join(' ');
    if (!reason) {
        return message.reply('Please provide a reason for the warning.');
    }

    const warnEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('User Warned')
        .setAuthor(user.tag, user.displayAvatarURL())
        .addField('Moderator', message.author.tag)
        .addField('Reason', reason)
        .setTimestamp();

    try {
        await user.send(`You have been warned in ${message.guild.name} for: ${reason}`);
    } catch (error) {
        console.error(`Failed to send warning DM to ${user.tag}. Error: ${error}`);
    }

    logWarn(message.author, user, reason);

    return message.channel.send({ embeds: [warnEmbed] });
};

module.exports = {
    name: 'warn',
    description: 'Warn a user for a minor infraction',
    execute: warnCommand,
};