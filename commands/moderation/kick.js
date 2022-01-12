const {Permissions} = require("discord.js");
const Logger = require("../../exports/logging");

module.exports = {
    name: 'kick',
    description: 'Kick a user.',
    usage: '<@user> <reason>',
    category: 'Moderation',
    permission: Permissions.FLAGS.KICK_MEMBERS,
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

        const msg = message.client.EmbedMessage("Message", {name: 'Success!', value: `Kicked ${taggedUser.username} for **${reason}**`}, executeUser, '');
        taggedUser.send("Ah shucks! You've been discarded from the FiveM Discord. That sucks!\nReason for *kick*: ```" + reason + "```").catch(Logger.Error);
        taggedMember.kick(reason).then(message.reply({embeds: [msg]})).catch((e) => {
            Logger.Error(e);

            message.reply(`This user was not kicked due to an error: ${e}`);
        });
    }
}