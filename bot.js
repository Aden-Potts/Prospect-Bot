require("dotenv").config();

// depedency
const fs = require("fs");
const {Client, Intents, Collection, MessageEmbed, Permissions} = require('discord.js');
const mysql = require('mysql');
const http = require('http');
const api = require("./exports/api-interface");
const Logger = require("./exports/logging");

var db;

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

client.getDB = function(){
	if(!db){
		db = client.createDBObj();
	}
	return db;
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
	db.getConnection((err, conn) => {
		if(err){
			console.error(err);
			if(cb) cb(false)
			return;
		}

		conn.query(sql, (err, res) => {
			conn.release();

			if(err){
				console.error(err);
				if(cb) cb(false);
				return;
			}

			if(cb) cb(true, res);
		});
	});
}

client.isStaff = function(minrank, member){
	if(client.hasRole(member, minrank)) return true;
	
	return false;
}

client.createDBObj = function(){
	var rt = mysql.createPool({
		connectionLimit: 1,
		host: process.env.fivemhost,
		user: process.env.fivemuser,
		password: process.env.fivempw,
		database: 'dev_server'
	});

	console.log("Created FiveM MySQL Pool");

	return rt;
}

client.on('ready', () => {
	console.log("Creating database object...");

	db = client.createDBObj();

	console.log(`Logged in as ${client.user.tag}!`);

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

	if(msg.content.substring(0, 1)== "!"){
		let args = msg.content.split(" ");
		let cmd = args[0].replace('!', '');

		if(!client.commands.has(cmd)) return;

		var cmdobj = client.commands.get(cmd);

		args.splice(0, 1);
		let argtxt = args.join(" ");

		if(args.length == 0) argtxt = "<NONE>"
		console.log(msg.member.user.username + " attempted to run command " + cmd + " with args " + argtxt);

		if(cmdobj.category == "Police"){
			if(!client.hasRole(msg.member, client.ranks.police)){
				msg.reply("you are not a Police Officer!");
				return;
			}

			let perm = cmdobj.policeperms;

			if(perm == "fto" && !client.hasRole(msg.member, client.ranks.policefto)){
				msg.reply("you are not an FTO!");
				return;
			}else if(perm == "cpl+" && !client.hasRole(msg.member, client.ranks.policecpl)){
				msg.reply("you are not a Corporal+");
				return;
			}else if(perm == "command" && !client.hasRole(msg.member, client.ranks.policecommand)){
				msg.reply("you are not Command!");
				return;
			}else if(perm == "highcommand" && !client.hasRole(msg.member, client.ranks.policehighcommand)){
				msg.reply("you are not High Command!");
				return;
			}
		}

		if(cmdobj.permission == 0){
			if(args.length < cmdobj.reqargs){
				client.ReplyMessage(msg, `Oops, you're missing required command arguments. Usage: \`\`\`!${cmd} ${cmdobj.usage}\`\`\``, 60);

				return;
			}

			try {
				cmdobj.execute(msg, args)
			} catch(error){
				Logger.Error(`${msg.member.name} had an error while executing command ${cmd}: ${error}`);

				client.ReplyMessage(msg, `Error running command!\n\`\`\`${error}\`\`\``, 60);

                return;
			}

		}else if(msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || msg.member.permissions.has(cmdobj.permission)){
			if(args.length < cmdobj.reqargs){
				client.ReplyMessage(msg, `Oops, you're missing required command arguments. Usage: \`\`\`!${cmd} ${cmdobj.usage}\`\`\``, 60);

                return;
			}
			try {
				cmdobj.execute(msg, args)
			} catch(error){
                Logger.Error(`${msg.member.name} had an error while executing command ${cmd}: ${error}`);

				client.ReplyMessage(msg, `Error running command!\n\`\`\`${error}\`\`\``, 60);
			}
		}else{
			client.ReplyMessage(msg, "Sorry, but you do not have access to run this command.", 60);
		}
	}
});

client.login(process.env.TOKEN);