const Discord = require("discord.js");
const Logger = require("../../exports/logging");

module.exports = {
    name: 'ban',
    description: 'Bans a user.',
    usage: '<@user> <reason>',
    category: 'Moderation',
    permission: 'BAN_MEMBERS',
    reqargs: 2,
    execute(message, args){
        if(!message.mentions.users.size) return message.reply('You need to tag a user!');

        const taggedUser = message.mentions.users.first();
        const taggedMember = message.mentions.members.first();

        if(taggedMember.hasPermission('ADMINISTRATOR')){
            message.reply("You cannot ban senior staff!");
            return;
        }
        let executeUser = message.member.user;
        args.splice(0, 1);

        let reason = args.join(" ");

        const msg = message.client.EmbedMessage("Message", {name: 'Success!', value: `Kicked ${taggedUser.username} for **${reason}**`}, executeUser, '');
        message.reply({embeds: [msg]});
        taggedUser.send("Ah shucks! You've been discarded from the FiveM Discord. That sucks!\nReason for *ban*: ```" + reason + "```");
        taggedMember.ban({days: 1, reason: reason}).catch(Logger.Error);
    }
}