const Discord = require("discord.js");
const http = require("http");

module.exports = {
    name: 'setloadingmusic',
    description: 'Sets your loading screen music. Supporter required.',
    usage: '<youtube link>',
    category: 'Utilities',
    permission: 0,
    reqargs: 1,
    execute(message, args){
        const client = message.client;

        if(!message.member.permissionsIn(message.channel).has("KICK_MEMBERS")) {
            message.reply("This command will become available upon the release of v2.");
            return;
        }

        if(!client.hasRole(message.member, client.ranks.supporter) || !message.member.permissionsIn(message.channel).has("KICK_MEMBERS")){
            message.reply("Only supporters and staff are allowed to run this command.");
            return;
        }

        if(client.hasRole(message.member, client.ranks.verified)){
            message.reply("You must have discord verified on the FiveM server to use this.");
            return;
        }

        console.log(args[0]);

        var options = {
            host: 'https://api.prospectroleplay.net',
            path: `/user/discord:${message.member.id}/loadingscreen`,
            method: 'POST',
            port: '443',
            headers: {
                'X-Api-Key': client.APIKey
            }
        }

        var req = http.request(options, (res) => {
            var str = '';

            res.on('data', (chunk) => {
                str += chunk;
            });

            res.on('end', () => {
                var data = JSON.parse(str);                
                console.log(data);
                if(data.Code == 200) {
                    message.reply("Success! You should now hear your own music when loading in game!");
                } else {
                    message.reply("Uh oh, an error appeared. Report this to a developer with error code " + data.Code);
                    return;
                }
            });
        });

        req.on('error', function(e) {
            console.log(e);
        });

        req.write(args[0]);
        req.end();
    }
}