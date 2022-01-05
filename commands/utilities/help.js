const {MessageEmbed, Message} = require("discord.js");

module.exports = {
    name: 'help',
    description: 'Lists commands',
    usage: 'none',
    category: 'Utilities',
    permission: 0,
    reqargs: 0,
    execute(message, args){
        let category;
        if(args[0]){
            category = args[0];
        }

        let fields = [];
        let count = 0;

        const msg = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle("Prospect Bot Commands")
        .setAuthor(message.client.user.username, message.client.user.avatarURL())
        .setTimestamp()
        .setFooter('Executed by ' + message.member.user.username, message.member.user.avatarURL());

        message.client.commands.forEach(function(cmd, index, array){
            if(category){
                if(cmd.category.toLowerCase() == category.toLowerCase()){
                    let perms = cmd.permission;
                    if(perms == 0){
                        perms = 'Everyone';
                    }

                    msg.addField(`Command: !${cmd.name}`, `${cmd.description}\nUsage: ${cmd.usage}\nPermission: ${perms}\nCategory:${cmd.category}`);
                    count++;

                    if(count >= 5) {
                        message.channel.send({embeds: [msg]});

                        msg.fields = [];
                        count = 0;
                    }
                }
            }else{
                let perms = cmd.permission;
                if(perms == 0){
                    perms = 'Everyone';
                }

                msg.addField(`Command: !${cmd.name}`, `${cmd.description}\nUsage: ${cmd.usage}\nPermission: ${perms}\nCategory:${cmd.category}`);
                count++;

                if(count >= 5) {
                    message.channel.send({embeds: [msg]});

                    msg.fields = [];
                    count = 0;
                }
            }
        });

        //const msg = message.client.EmbedMessage("Message", fields, message.member.user, '');

        
        message.channel.send({embeds: [msg]});
    }
}