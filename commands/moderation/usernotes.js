const Discord = require("discord.js");

module.exports = {
    name: 'addnote',
    description: 'Adds a note to a user\'s permanent record.',
    usage: '<identifier=steam:hexid or steamid64> <notes>',
    category: 'Moderation',
    permission: 0,
    reqargs: 0,
    execute(message, args){
    	var db = message.client.getDB();

		var client = message.client;

    	client.fivemQuery('SELECT * FROM `shared_banking` WHERE `account` = 80325792', (err, res) => {
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
        });
    }
}