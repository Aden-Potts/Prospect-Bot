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

            let balance = Number(data['Response'][0].balance).toLocaleString();

            const msg = message.client.EmbedMessage("Los Santos County Sheriffs Office", {name: "Account Balance", value: `$${balance}`}, message.member.user, message.member.user.avatarURL());
            
            message.reply({embeds: [msg]});
        })
    }
}