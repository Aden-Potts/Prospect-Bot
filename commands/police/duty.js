const Discord = require("discord.js");

module.exports = {
    name: 'duty',
    description: 'Get your duty time.',
    usage: '<NONE>',
    category: 'Police',
    policeperms: 'all',
    permission: 0,
    reqargs: 0,
    execute(message, args){

		var client = message.client;

    	client.fivemQuery('SELECT * FROM `users` WHERE `discord` = \'discord:' + message.member.id + '\'', function(success, res){
        	if(!success){
            	message.channel.send(`Uh oh! An error occured!`);
            	return;
        	}else if(!res[0]){
           		message.channel.send("Uh oh! No database results were found for this user.");
            	return;
        	}
			let identifier = res[0].identifier;

			client.fivemQuery("SELECT * FROM `characters` WHERE `identifier` = '" + identifier + "' AND `job` = 1", (success, res) => {
				if(!success){
					message.channel.send(`Uh oh! An error occured!`);
					return;
				}else if(!res[0]){
					message.channel.send("Uh oh! No database results were found for this user.");
					return;
				}

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

				message.channel.send({embeds: [msg]});
			});
    	});
    }
}