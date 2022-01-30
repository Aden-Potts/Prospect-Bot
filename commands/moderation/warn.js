const {Permissions} = require("discord.js");
const Logger = require("../../exports/logging");
const Prospect = require("../../exports/prospect-utils");

module.exports = {
    name: 'warn',
    description: 'Gives the user a warning. If they have more than 5 active warnings, they\'ll be banned. Warnings expire after a week.',
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

        args.splice(0, 1);
        let reason = args.join(" ");

        taggedMember.send(`You've been given a warning.\`\`\`Reason: ${reason}\nIf you feel this was a mistake, open up a support ticket.\nReminder, warnings are active for 1 week. If you have more than 5 active warnings, you will be banned.\`\`\``)

        Prospect.GiveUserWarning(taggedMember.id, reason, message.member);
        Prospect.ModerationLog("Warning Given", `${message.member.user.tag} gave ${taggedUser.tag} a warning. Reason: ${reason}`, message.member.user)

        Prospect.TimedReply(message, `${taggedUser.username} has been warned.`, 30);
    }
}