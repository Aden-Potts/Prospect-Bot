const {Permissions} = require("discord.js");
const Logger = require("../../exports/logging");
const Prospect = require("../../exports/prospect-utils");

module.exports = {
    name: 'warnings',
    description: 'Gets the warnings for given user.',
    usage: '<@user>',
    category: 'Moderation',
    permission: Permissions.FLAGS.KICK_MEMBERS,
    reqargs: 1,
    execute(message, args){
        if(!message.mentions.users.size) return message.reply('You need to tag a user!');

        const taggedUser = message.mentions.users.first();
        const taggedMember = message.mentions.members.first();

        let warns = Prospect.GetUserWarnings(taggedMember.id);
        if(warns == false) {
            message.reply(`${taggedUser.username} does not have any warnings.`);

            return;
        } else if(warns == null) {
            message.reply("Oops! I did a fucky wucky and made an error, please alert the dev team.");

            return;
        }

        let msg = ``;

        warns.forEach((val, index) => {
            let id = index + 1; // more readable i guess
            let dateGiven = "";
            let dateExpires = "";
            let expired = "No";

            if(val.Expired == true)
                expired = "Yes";

            if(index == 0) {
                msg += `---[Warning ID #${id}]--\nDate Given: ${dateGiven}\nIs Expired: ${expired}\nReason: ${val.Reason}\nStaff Member: ${val.Admin[0]} (${val.Admin[1]})\nDate Expires: ${dateExpires}\n`;
            } else {
                msg += `\n---[Warning ID #${id}]--\nDate Given: ${dateGiven}\nIs Expired: ${expired}\nReason: ${val.Reason}\nStaff Member: ${val.Admin[0]} (${val.Admin[1]})\nDate Expires: ${dateExpires}\n`;
    
            }
        });
        message.reply(`${taggedUser.username} has ${warns.length} warning(s). Here's a list:\n\`\`\`${msg}\`\`\``);
    }
}