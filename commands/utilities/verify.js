const Discord = require("discord.js");
const api = require("../../exports/api-interface");

module.exports = {
    name: 'verify',
    description: 'Link your FiveM with our discord.',
    usage: '<code>',
    category: 'Utilities',
    permission: 0,
    reqargs: 1,
    execute(message, args){
        const client = message.client;
        var member = message.member;
        let code = args[0];



        code = parseInt(code);
        if(code.type == "string"){
            client.SendMessage(message.member.user, "This code isn't a valid number. Try agian.");
            message.delete()

            return;
        }

        api.GET(`discord/verification/${code}/${message.member.user.id}`, (data) => {
            let resData = data;

            if(resData["Response"] == "No result" || resData["Code"] != 200) {
                client.SendMessage(message.member.user, "This code is not valid!");
            } else {
                if(resData["Response"] == "Code already used") {
                    client.SendMessage(message.member.user, "This code was already used!");
                    message.delete();

                    return;
                }

                if(data["Response"]== "Verified") {
                    client.SendMessage(message.member.user, "Success! You've been verified!");
                    client.AddRole(message.member, '735631264153075814');

                } else {
                    client.SendMessage(message.member.user, resData["Response"]);
                }
            }
        });
        
        message.delete();
    }
}