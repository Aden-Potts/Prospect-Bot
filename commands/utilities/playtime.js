require("dotenv").config();

const Discord = require("discord.js");
const { env } = require("process");
const API = require("../../exports/api-interface");

module.exports = {
    name: 'playtime',
    description: 'Checks your playtime',
    usage: '[@user]',
    category: 'Utilities',
    permission: 0,
    reqargs: 0,
    execute(message, args){
        var client = message.client;

        if(!client.hasRole(message.member, client.ranks.verified) && process.env.DEBUG != 1){
            message.reply("You must be FiveM Verified to run this!");

            return;
        }

        let playtimeMonthly = 0;
        let overallPlaytime = 0;
        let topplaytime = 0;
        let discordid = message.member.id;
        let memb = message.member;

        if(message.mentions.users.size){
            memb = message.mentions.members.first();

            discordid = memb.id
        }

        API.GET(`user/${discordid}/getplaytime`, (data, resCode) => {
            data = data["Response"];
            if(parseInt(resCode) != 200) {
                message.reply(`An API backend error appeared. Contact a developer and give them this code: ${resCode}`);

                return;
            }

            overallPlaytime = data["totalPlaytime"];
            playtimeMonthly = data["monthly"];

            let chars = data["characterData"];
            
            let currentTop = ["none", 0];
            chars.forEach((v, k) => {
                if(v["Playtime"] > currentTop[1]) {
                    currentTop = [`${v["firstname"]} ${v["lastname"]}`, v["Playtime"] / 3600];
                }
            })

            overallPlaytime = parseFloat(overallPlaytime).toFixed(1);
            playtimeMonthly = parseFloat(playtimeMonthly).toFixed(1);
            topplaytime = parseFloat(currentTop[1]).toFixed(1);
            let fields = [{name: "Overall Playtime", value:"``" + overallPlaytime + " hours``"}, {name: "Monthly Playtime", value: "``" + playtimeMonthly + " hours``"}, {name: "Top Played Character", value: currentTop[0] + " with " + topplaytime + " hours of playtime."}];
            const msg = client.EmbedMessage(memb.user.username + "'s Playtime", fields, memb.user, memb.user.avatarURL());

            message.reply({embeds: [msg]});

            return;
        });
    }
}