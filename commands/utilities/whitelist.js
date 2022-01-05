const Discord = require("discord.js");

module.exports = {
    name: 'whitelist',
    description: 'Whitelists a user. User must have discord linked to their FiveM.',
    usage: '<@user>',
    category: 'Utilities',
    permission: 0,
    reqargs: 1,
    execute(message, args){
        if(!message.mentions.users.size) return message.reply('You need to tag a user!');
        const client = message.client;

        const taggedUser = message.mentions.users.first();
        const taggedMember = message.mentions.members.first();

        if(!client.hasRole(message.member, client.ranks.support) && !message.member.permissionsIn(message.channel).has("KICK_MEMBERS")){
            message.reply("You are not authorized to run this command!");
            return;
        }

        if(client.hasRole(taggedMember, client.ranks.verified)){
            client.fivemQuery(`UPDATE \`users\` SET \`permission_level\` = 1 WHERE \`discord\` = 'discord:${message.member.id}' AND \`permission_level\` = 0`, function(success, res){
                if(!success){
                    message.reply("Uh oh! an error appeared!");
                    return;
                }

                message.reply(`Successfully whitelisted "${taggedMember.nickname}"`);
                taggedUser.send("You have been added to Whitelist! Congratulations!");
                taggedMember.roles.add("723859050814636042");
            });
        }else{
            message.reply("This user does not have discord linked to the FiveM server.");
            return;
        }
    }
}