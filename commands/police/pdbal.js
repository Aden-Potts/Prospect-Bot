const Discord = require("discord.js");

module.exports = {
    name: 'pdbal',
    description: 'Get PD Balance.',
    usage: '<NONE>',
    category: 'Police',
    policeperms: 'command',
    permission: 0,
    reqargs: 0,
    execute(message, args){
    	var db = message.client.getDB();

		var client = message.client;

        client.fivemQuery("SELECT * FROM `shared_banking` WHERE `account` = 80325792", (success, res) => {
            if(!success){
                message.reply("Uh oh, a backend error appeared! Try again later, if this issue does not resolve, contact a developer.");
                return;
            }

            if(!res){
                message.reply("Uh oh, an error occured. Please try again later.");
                return;
            }

            let balance = Number(res[0].balance).toLocaleString();

            const msg = client.EmbedMessage("Los Santos Police Department", {name: "Account Balance", value: `$${balance}`}, message.member.user, message.member.user.avatarURL())
            message.channel.send({embeds: [msg]});
        });

    	/*db.query('SELECT * FROM `shared_banking` WHERE `account` = 80325792', (err, res) => {
            if(err){
            	console.log(console.error, err);
            	message.channel.send(`Uh oh! An error occured! \`\`\`${err.message}\`\`\``);
            	return;
        	}else if(!res[0]){
           		message.channel.send("Uh oh! No database results were found for this user.");
            	return;
        	}
            let balance = Number(res[0].balance).toLocaleString();

            const msg = client.EmbedMessage("Los Santos Police Department", {name: "Account Balance", value: `$${balance}`}, message.member.user, message.member.user.avatarURL())
            message.channel.send(msg);
        });*/
    }
}