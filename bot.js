require("dotenv").config();

// depedency
const fs = require("fs");
const {Client, Intents, Collection, MessageEmbed, Permissions} = require('discord.js');
const http = require('http');
const api = require("./exports/api-interface");
const Logger = require("./exports/logging");
const Prospect = require("./exports/prospect-utils");

let Config;

// vars used by the client
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.DIRECT_MESSAGES]});
client.commands = new Collection();

client.ranks = {
	verified: "735631264153075814",
    supporter: "698251747906551828",
	police: "723142702384021516",
	policefto: "723251977579921480",
	policecpl: "723142515217399818",
	policecommand: "723142433885651014",
	policehighcommand: "723142305405730847",
	support: "723142991912632381",
	mod: "559759779183067136",
	snrmod: "802999548582297670",
	admin: "559759611146797058",
	snradmin: "802999460837064704",
	management: "538413605230477342"
}

client.APIKey = process.env.APIKey;

client.EmbedMessage = function(title, fields, user, thumbnail, desc){
	if(!thumbnail){
		thumbnail = false;
	}

	if(desc){
		const rt = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(title)
			.setAuthor(client.user.username, client.user.avatarURL())
			.setThumbnail(thumbnail)
			.addFields(
				fields,
			)
			.setTimestamp()
			.setFooter('Executed by ' + user.username, user.avatarURL());

		return rt;
	}

	if(thumbnail != false){
		const rt = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(title)
			.setAuthor(client.user.username, client.user.avatarURL())
			.setThumbnail(thumbnail)
			.addFields(
				fields,
			)
			.setTimestamp()
			.setFooter('Executed by ' + user.username, user.avatarURL());

	return rt;
	}
	//user = client.users.fetch(user, true);

	const rt = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle(title)
	.setAuthor(client.user.username, client.user.avatarURL())
	.addFields(
		fields,
	 )
	.setTimestamp()
	.setFooter('Executed by ' + user.username, user.avatarURL());

	return rt;
}

client.hasRole = function(member, roleid){
	var rt = false;

	/*member.roles.each(function(v, k){
        console.log(`${v} | ${k}`);
		if(roleid == v){
			rt = true;
		}
	});*/

   rt = member.roles.cache.has(roleid);

	return rt;
}

client.SendMessage = (usr, message, timeDelete = null) => {
    if(timeDelete) {
        timeDelete = parseFloat(timeDelete) * 1000;

        usr.send(message).then(newMsg => {
            setTimeout(() => {
                newMsg.delete().catch(Logger.Error);
            }, timeDelete);
        }).catch(Logger.Error);

        return;
    }

    usr.send(message).catch(Logger.Error);
}

client.ReplyMessage = (msg, reply, timeDelete = null) => {
    if(timeDelete) {
        timeDelete = parseFloat(timeDelete) * 1000;

        msg.reply(reply).then(message => {
            setTimeout(() => {
                message.delete().catch(Logger.Error);
            }, timeDelete);
        }).catch(Logger.Error);

        return;
    }

    msg.reply(reply).catch(Logger.Error);
}

client.ChannelSend = (channel, message, timeDelete) => {

}

client.AddRole = (usr, roleid) => {
    usr.roles.add(roleid).catch(Logger.Error);
}

client.fivemQuery = (sql, cb) => {
	return;
}

client.isStaff = function(minrank, member){
	if(client.hasRole(member, minrank)) return true;
	
	return false;
}

client.on('ready', () => {
	Logger.Info("Bot client ready, initializing...");

    Prospect.Init(client);

    Config = Prospect.Config;

    var req = http.get("http://54.39.131.111:30120/queuemanager/getcurrentstats", (res) => {
        var jsondata = '';
			
		res.on('data', (chunk) => {
			jsondata += chunk;
		});

		res.on('end', () => {
            jsondata = JSON.parse(jsondata);

            if(!client.guilds.cache.get("538413338913407006")) {
                return;
            }

            client.guilds.cache.get("538413338913407006").channels.cache.get("874806925089464330").setName(`❓FiveM Status: ${jsondata.online}/48`).catch((e) => {
                console.log("Failed to set status channel.");
            });

            updateServerStatus();
		})
	});
});

function updateServerStatus(){
	setTimeout(function(){
		var req = http.get("http://54.39.131.111:30120/queuemanager/getcurrentstats", (res) => {
			var jsondata = '';
			
			res.on('data', (chunk) => {
				jsondata += chunk;
			});

			res.on('end', () => {
                jsondata = JSON.parse(jsondata);

                client.guilds.cache.get("538413338913407006").channels.cache.get("874806925089464330").setName(`❓FiveM Status: ${jsondata.online}/48`).catch((e) => {
                    console.log("Failed to set status channel.");
                });
			})
		});

		req.on('error', (e) => {
            client.guilds.cache.get("538413338913407006").channels.cache.get("874806925089464330").setName(`❓FiveM Status: Offline 😭`);
			console.log("SERVER STATUS: HTTP ERROR: " + e.message);
		});

		updateServerStatus();
	}, 30000);
}

client.on('guildMemberAdd', member => {
	Logger.Log(`${member.name} joined the discord server, checking if they're FiveM verified...`);

    api.GET(`discord/isverified/${member.id}`, (d) => {
        if(d.Response == false) {
            Logger.Log(`${member.name} is not FiveM Verified.`);

            return;
        }

        try {
            member.roles.add("735631264153075814");
            client.SendMessage(member.user, "Welcome back! You've previously linked your Discord account with us, and have been granted the verified role automatically.")
        } catch(e) {
            Logger.Error(e);
        }
    });
});

const loadCommands = fs.readdirSync('./commands');
for(const folder of loadCommands){
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

	for(const file of commandFiles){
		const command = require(`./commands/${folder}/${file}`);

		client.commands.set(command.name, command);
	}
}

client.on('messageCreate', msg => {
    if(msg.content.indexOf("stearncommunytiy.ru") != -1 && !msg.member.user.bot) {
        msg.member.send("This link is a known phishing site. You have been banned from the server, and your message as been removed.");
        msg.member.ban({days: 7, reason: "Posting phishing links."});
        msg.delete();

        return;
    }

    if(Config.FilteredWords.includes(msg.content) && Prospect.HasAccess("m", msg.member)) { // staff can use these words so they can, ie, ban someone spamming nigger without the bot going ape shit for saying nigger.
        msg.channel.send(`Hey ${msg.member.toString()}, that word wasn't very cool. Please refrain from saying that.`)
            .then(msg.delete())
            .catch(Logger.Error);

        Prospect.ModerationLog("Message Deleted", `${msg.member.user.tag} said ${msg.content}, which is a filtered word.`);
    }

	if(msg.content.substring(0, 1)== "!"){
		let args = msg.content.split(" ");
		let cmd = args[0].replace('!', '');

		if(!client.commands.has(cmd)) return;

		var cmdobj = client.commands.get(cmd);

		args.splice(0, 1);
		let argtxt = args.join(" ");

		if(args.length == 0) 
            argtxt = "<NONE>";

		Logger.Info(`${msg.member.user.username} attempted to run command ${cmd}. Arguments: ${argtxt}`);

		if(Prospect.HasAccess(cmdobj.permission, msg.member)){
			if(args.length < cmdobj.reqargs){
				Prospect.TimedReply(msg, `Oops, you're missing required command arguments. Usage: \`\`\`!${cmd} ${cmdobj.usage}\`\`\``, 60);

                return;
			}
			try {
				cmdobj.execute(msg, args)
			} catch(error){
                Logger.Error(`${msg.member.name} had an error while executing command ${cmd}: ${error}`);

				Prospect.TimedReply(msg, `Error running command!\n\`\`\`${error}\`\`\``, 60);
			}
		}else{
			Prospect.TimedReply(msg, "Sorry, but you do not have access to run this command.", 60);
		}
	}
});

client.login(process.env.TOKEN);