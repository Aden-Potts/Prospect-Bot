const {Permissions} = require("discord.js");
const Logger = require("../../exports/logging");

module.exports = {
    name: 'ban',
    description: 'Bans a user.',
    usage: '<@user> <reason>',
    category: 'Moderation',
    permission: Permissions.FLAGS.BAN_MEMBERS,
    reqargs: 2,
    execute(message, args){
        if(!message.mentions.users.size) return message.reply('You need to tag a user!');

        const taggedUser = message.mentions.users.first();
        const taggedMember = message.mentions.members.first();

        if(taggedMember.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
            message.reply("You cannot kick senior staff!");
            return;
        }
        let executeUser = message.member.user;
        args.splice(0, 1);

        let reason = args.join(" ");
        reason = `${reason} -${executeUser.tag}`;

        const msg = message.client.EmbedMessage("Message", {name: 'Success!', value: `Banned ${taggedUser.username} for **${reason}**`}, executeUser, '');
        message.reply({embeds: [msg]});
        taggedUser.send("Ah shucks! You've been discarded from the FiveM Discord. That sucks!\nReason for *ban*: ```" + reason + "```").catch(Logger.Error);
        
        taggedMember.ban({days: 1, reason: reason}).catch((e) => {
            Logger.Error(e);

            message.reply(`User was not banned due to this error: ${e}`);
        });
    }
}