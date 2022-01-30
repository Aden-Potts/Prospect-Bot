const {Permissions} = require("discord.js");
const Logger = require("../../exports/logging");
const Prospect = require("../../exports/prospect-utils");

module.exports = {
    name: 'kick',
    description: 'Kick a user.',
    usage: '<@user> <reason>',
    category: 'Moderation',
    permission: Permissions.FLAGS.KICK_MEMBERS,
    reqargs: 2,
    execute(message, args){

        let target = Prospect.GetTaggedMemberUser(message, args[0]);
        if(!target) {
            Prospect.TimedReply(message, "I couldn't find this user. Try tagging them.", 30);

            return;
        }

        const taggedUser = target[0];
        const taggedMember = target[1];

        if(taggedMember.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
            Prospect.TimedReply(message, "You cannot kick senior staff!");
            return;
        }
        let executeUser = message.member.user;
        args.splice(0, 1);

        let reason = args.join(" ");

        const msg = message.client.EmbedMessage("Message", {name: 'Success!', value: `Kicked ${taggedUser.username} for **${reason}**`}, executeUser, '');
        taggedUser.send("Ah shucks! You've been discarded from the FiveM Discord. That sucks!\nReason for *kick*: ```" + reason + "```").catch(Logger.Error);
        Prospect.ModerationLog("User Kicked", `${executeUser} kicked ${taggedMember.name} for reason ${reason}`, message.member.user);

        taggedMember.kick(reason).then(message.reply({embeds: [msg]})).catch((e) => {
            Logger.Error(e);

            message.reply(`This user was not kicked due to an error: ${e}`);
        });
    }
}