const Discord = require("discord.js");

module.exports = {
    name: 'kick',
    description: 'Kick a user.',
    usage: '<@user> <reason>',
    category: 'Moderation',
    permission: 'KICK_MEMBERS',
    reqargs: 2,
    execute(message, args){
        if(!message.mentions.users.size) return message.reply('You need to tag a user!');

        const taggedUser = message.mentions.users.first();
        const taggedMember = message.guild.member(taggedUser);
        if(taggedMember.hasPermission('ADMINISTRATOR')){
            message.reply("You cannot kick senior staff!");
            return;
        }
        let executeUser = message.member.user;
        args.splice(0, 1);

        let reason = args.join(" ");

        /*const msg = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle("Message")
        .setAuthor(message.client.user.username, message.client.user.avatarURL())
        .addFields(
            { name: 'Success!', value: `Kicked ${taggedUser.username} for **${reason}**`},
         )
        .setTimestamp()
        .setFooter('Executed by ' + message.member.user.username, message.member.user.avatarURL());*/

        const msg = message.client.EmbedMessage("Message", {name: 'Success!', value: `Kicked ${taggedUser.username} for **${reason}**`}, executeUser, '');
        message.channel.send({embeds: [msg]});
        taggedUser.send("Ah shucks! You've been discarded from the FiveM Discord. That sucks!\nReason for kick: ```" + reason + "```");
        taggedMember.kick(reason);
    }
}