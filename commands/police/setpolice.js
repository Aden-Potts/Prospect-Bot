const Discord = require("discord.js");

module.exports = {
    name: 'setpolice',
    description: 'Set Police',
    usage: '<NONE>',
    category: 'Police',
    policeperms: 'policecpl',
    permission: 0,
    reqargs: 0,
    execute(message, args){
        if(!message.mentions.users.size) return message.reply('You need to tag a user!');
        const client = message.client;

        const taggedUser = message.mentions.users.first();
        const taggedMember = message.guild.member(taggedUser);

        client.fivemQuery(`SELECT * FROM `)
    }
}