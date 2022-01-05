const Discord = require("discord.js");

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
             console.log('passed string for discord auth: ' + code);
             message.member.user.send("Oops, that code isn't a valid number. Try again.");
             message.delete()
            return;
         }

            client.fivemQuery(`SELECT * FROM discord_verification WHERE authentication = ${code}`, function(success, res2){
                if(!success){
                    message.member.user.send(`Uh oh! An error occured!`);
                    message.delete()
                    return;
                }else if(!res2[0]){
                    message.member.user.send("Uh oh! The provided code is invalid.");
                    message.delete()
                    return;
                }

                client.fivemQuery(`UPDATE discord_verification SET active = 1, discord_id = ${message.member.id} WHERE authentication = ${code}`, function(success, res3){
                    if(!success){
                        message.member.user.send("Uh oh! An error occured!");
                        message.delete()
                        return;
                    }else{

                        client.fivemQuery(``)
                        message.member.user.send("Success! You've linked! Go ingame and type /claim to get your reward!");
                        message.member.roles.add('735631264153075814');

                        message.delete()
                        return;
                    }
                });
            });
    }
}