const {Permissions} = require("discord.js");
const Logger = require("../../exports/logging");
const Prospect = require("../../exports/prospect-utils");

module.exports = {
    name: 'removewarn',
    description: 'Removes a warning for the specified user. Note, this cannot be reversed.',
    usage: '<@user> <id>',
    category: 'Moderation',
    permission: Permissions.FLAGS.KICK_MEMBERS,
    reqargs: 2,
    execute(message, args){
        let target = Prospect.GetTaggedMemberUser(message, args[0]);
        if(!target) {
            Prospect.TimedReply(message, "I couldn't find this user. Try tagging them.", 30);

            return;
        }

        let id = args[1];
        if(!id) {
            Prospect.TimedReply(message, "You must provide an ID to ")
        }

        const taggedUser = target[0];
        const taggedMember = target[1];

        let success = Prospect.RemoveUserWarning(taggedMember.id, id);

        if(!success) {
            Prospect.TimedReply(message, "An error occured while executing this command. Talk to a Developer.");

            return;
        }

        Prospect.TimedReply(message, `Success! Removed warning for ${taggedMember.nickname}`, 30);
    }
}