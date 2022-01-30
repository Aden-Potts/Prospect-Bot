const {Permissions} = require("discord.js");
const Prospect = require("../../exports/prospect-utils");

module.exports = {
    name: 'fuck',
    description: 'Shit',
    usage: 'none',
    category: 'Fun',
    permission: Permissions.FLAGS.KICK_MEMBERS,
    reqargs: 0,
    execute(message, args){
        message.reply("ur a fuckstick");
      
        let target = Prospect.GetTaggedMemberUser(message, args[0]);
        if(!target) {
            message.reply("This user was not found. Try tagging them instead.");

            return;
        }

        let member = target[1];

        message.reply(`User: ${target[0].username} | Member ID: ${member.id}`);
    }
}