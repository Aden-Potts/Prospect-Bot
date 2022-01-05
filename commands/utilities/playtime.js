const Discord = require("discord.js");

module.exports = {
    name: 'playtime',
    description: 'Checks your playtime',
    usage: '[@user]',
    category: 'Utilities',
    permission: 0,
    reqargs: 0,
    execute(message, args){
        var client = message.client;

        if(!client.hasRole(message.member, client.ranks.verified)){
            message.reply("You must be FiveM Verified to run this!");
            return;
        }
        var db = client.getDB();

        if(!message.mentions.users.size){
            let playtimeMonthly = 0;
            let overallPlaytime = 0;
            let identifier;
            let topplaytime = 0;
            let topplaytimecharacter;

            client.fivemQuery('SELECT `identifier`, `monthlyPlaytime` FROM `users` WHERE `discord` = \'discord:' + message.member.id + '\'', function(success, res){
                if(!success){
                    console.log(err);
                    message.channel.send(`Uh oh! An error occured!`);
                    return;
                }else if(!res[0]){
                    message.channel.send("Uh oh! No database results were found for you. Ensure you have discord linked!");
                    return;
                }

                res = res[0];

                identifier = res.identifier;
                playtimeMonthly = res.monthlyPlaytime/3600;

                client.fivemQuery(`SELECT * FROM characters WHERE identifier = '${identifier}'`, function(success, res){
                    if(!success){
                        message.channel.send(`Uh oh! An error occured!`);
                        return;
                    }else if(!res[0]){
                        message.channel.send("Uh oh! No database results were found for this user.");
                        return;
                    }

                    for(i = 0; i < res.length; i++){
                        if(i == 0){
                            topplaytime = res[i].playtime / 3600;
                            topplaytimecharacter = res[i].firstname + " " + res[i].lastname;
                        }
    
                        if((res[i].playtime/3600) > topplaytime){
                            topplaytime = res[i].playtime / 3600;
                            topplaytimecharacter = res[i].firstname + " " + res[i].lastname;
                        }
    
                        overallPlaytime += (res[i].playtime / 3600);
                    }
                    overallPlaytime = parseFloat(overallPlaytime).toFixed(1);
                    playtimeMonthly = parseFloat(playtimeMonthly).toFixed(1);
                    topplaytime = parseFloat(topplaytime).toFixed(1);
                    let fields = [{name: "Overall Playtime", value:"``" + overallPlaytime + " hours``"}, {name: "Monthly Playtime", value: "``" + playtimeMonthly + " hours``"}, {name: "Top Played Character", value: topplaytimecharacter + " with " + topplaytime + " hours of playtime."}];
                    const msg = client.EmbedMessage(message.member.user.username + "'s Playtime", fields, message.member.user, message.member.user.avatarURL());

                    //message.reply(`your overall playtime is \`\`${overallPlaytime} hours\`\`. You've played a total of \`\`${playtimeMonthly} hours\`\` this month.`);
                    message.channel.send({embeds: [msg]});

                });
            });
            return;
        }

        const taggedUser = message.mentions.users.first();
        const taggedMember = message.guild.member(taggedUser);

        let playtimeMonthly = 0;
        let overallPlaytime = 0;
        let identifier;
        let topplaytime = 0;
        let topplaytimecharacter;

        client.fivemQuery('SELECT `identifier`, `monthlyPlaytime` FROM `users` WHERE `discord` = \'discord:' + taggedMember.id + '\'', function(success, res){
            if(!success){
                console.log(err);
                message.channel.send(`Uh oh! An error occured!`);
                return;
            }else if(!res[0]){
                message.channel.send("Uh oh! No database results were found for this user. Ensure they have discord linked!");
                return;
            }

            res = res[0];

            identifier = res.identifier;
            playtimeMonthly = res.monthlyPlaytime/3600;

            client.fivemQuery(`SELECT * FROM characters WHERE identifier = '${identifier}'`, function(succewss, res){
                if(!success){
                    message.channel.send(`Uh oh! An error occured!`);
                    return;
                }else if(!res[0]){
                    message.channel.send("Uh oh! No database results were found for this user. They must not have any characters.");
                    return;
                }

                for(i = 0; i < res.length; i++){
                    if(i == 0){
                        topplaytime = res[i].playtime / 3600;
                        topplaytimecharacter = res[i].firstname + " " + res[i].lastname;
                    }

                    if((res[i].playtime/3600) > topplaytime){
                        topplaytime = res[i].playtime / 3600;
                        topplaytimecharacter = res[i].firstname + " " + res[i].lastname;
                    }

                    overallPlaytime += (res[i].playtime / 3600);
                }
                overallPlaytime = parseFloat(overallPlaytime).toFixed(1);
                playtimeMonthly = parseFloat(playtimeMonthly).toFixed(1);
                topplaytime = parseFloat(topplaytime).toFixed(1);

                let fields = [{name: "Overall Playtime", value:"``" + overallPlaytime + " hours``"}, {name: "Monthly Playtime", value: "``" + playtimeMonthly + " hours``"}, {name: "Top Played Character", value: topplaytimecharacter + " with " + topplaytime + " hours of playtime."}];
                const msg = client.EmbedMessage(taggedUser.username + "'s Playtime", fields, message.member.user, taggedUser.avatarURL());

                //message.reply(`your overall playtime is \`\`${overallPlaytime} hours\`\`. You've played a total of \`\`${playtimeMonthly} hours\`\` this month.`);
                message.channel.send({embeds: [msg]});

            });
        });
    }
}