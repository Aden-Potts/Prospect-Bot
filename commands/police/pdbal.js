const Discord = require("discord.js");
const API = require("../../exports/api-interface");
const Prospect = require("../../exports/prospect-utils");

module.exports = {
    name: 'pdbal',
    description: 'Get PD Balance.',
    usage: '<NONE>',
    category: 'Police',
    policeperms: 'command',
    permission: "pdc",
    reqargs: 0,
    execute(message, args){
        API.GET("discord/getpdbal", (data) => {
            if(data['Code'] != 200) {
                Prospect.TimedReply(message, `An error appeared. Please send this to a Developer: \`\`\`${JSON.stringify(data)}\`\`\``);

                return;
            }

            let names = {
                "LSCSO": "Los Santos County Sheriff's Office",
                "SAST": "San Andreas State Police",
                "GW": "Game Warden"
            }

            let fields = [];
            let balance = Number(data['Response'][0].balance).toLocaleString();
            data['Response'].forEach((v, k) => {
                let bal = Number(v.balance).toLocaleString();
                fields.push({name: names[v.name], value: `$${bal}`});
            });

            const msg = message.client.EmbedMessage("San Andreas Department of Public Safety Budget", fields, message.member.user, message.member.user.avatarURL());
            
            message.reply({embeds: [msg]});
        })
    }
}