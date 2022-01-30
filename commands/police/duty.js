const Discord = require("discord.js");
const API = require("../../exports/api-interface");
const Prospect = require("../../exports/prospect-utils");
const Logger = require("../../exports/logging");

module.exports = {
    name: 'duty',
    description: 'Get your duty time.',
    usage: '<NONE>',
    category: 'Utilities',
    policeperms: 'all',
    permission: 0,
    reqargs: 0,
    execute(message, args){

		var client = message.client;

        API.GET(`discord/getdutytime/${message.member.id}`, (data) => {
            if(data.Code != 200) {
                Prospect.TimedReply(message, `An error appeared. Message a developer this...\`\`\`${data}\`\`\``);

                return;
            } else if(data.Response.length == 0) {
                Prospect.TimedReply(message, "I didn't find any data for you. Try again later, or place a support ticket in.");

                return;
            }

            let res = data['Response'];

            let total = 0;
            let cname = '';
            let mostActiveChar = "";
            let mostActiveCharTime = 0;
            let fields = [];
            let time = 0;

            for(i = 0; i < res.length; i++){
                var c = res[i];
                
                cname = c.firstname + " " + c.lastname;
                time = parseFloat((c.dutyPlaytime / 3600)).toFixed(1);


                if(mostActiveCharTime == 0){
                    mostActiveChar = c.firstname + " " + c.lastname;
                    mostActiveCharTime = parseFloat((res[i].dutyPlaytime/3600)).toFixed(1);
                }

                if(!mostActiveCharTime == 0 && time > mostActiveCharTime){
                    mostActiveChar = c.firstname + " " + c.lastname;
                    mostActiveCharTime = parseFloat((res[i].dutyPlaytime/3600)).toFixed(1);
                }

                total += time;

                fields.push({name: cname, value: `\`\`${time}\`\` hours`, inline: true});
            }
            total = parseFloat(total).toFixed(1);

            fields.push({name: "Most Active Character", value: `${mostActiveChar} with \`\`${mostActiveCharTime}\`\` hours`});

            const msg = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle("Time on Duty")
            .setAuthor(client.user.username, client.user.avatarURL())
            .setDescription(`${message.member.user.username}'s duty time\n${total} hours clocked on duty.`)
            .setThumbnail(message.member.user.avatarURL())
            .addFields(
                fields,
            )
            .setTimestamp()
            .setFooter('Executed by ' + message.member.user.username, message.member.user.avatarURL());

            message.reply({embeds: [msg]}).catch(Logger.Error);
        });
    }
}