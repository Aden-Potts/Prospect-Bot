const Discord = require("discord.js");

module.exports = {
    name: 'postpage',
    description: 'Posts an embeded page.',
    usage: '<type>',
    category: 'Utilities',
    permission: 'ADMINISTRATOR',
    reqargs: 1,
    execute(message, args){
       	var c = message.channel;
		var client = message.client;


        message.reply("DEPRICATED");
        return;

    	if(args[0]== "verification"){
			const msg = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle("Prospect Roleplay - Discord Verification")
			.setThumbnail('https://cdn.discordapp.com/attachments/711952428957827162/793256540676685865/BLACK_ICON.png')
			//.setAuthor(client.user.username, client.user.avatarURL())
			.setDescription('Follow these steps to verify your discord and claim your reward ingame!')
			.addFields(
				{
					"name": "Step 1",
					"value": "While ingame, type /verify. The server will give you a code. Copy the code."
				  },
				  {
					"name": "Step 2",
					"value": "Return to this channel and type !verify *codehere*"
				  },
				  {
					"name": "Step 3",
					"value": "Once you get a success DM from the bot, go back ingame and type /claim."
				  },
				  {
					"name": "Success!",
					"value": "You have now linked your discord! Enjoy your reward!"
				  },
			 )
			.setTimestamp()
			.setFooter("Last updated");
        	const msg2 = {
				"title": "Prospect Roleplay - Discord Verification",
				"description": "Follow these steps to verify your discord and claim your reward ingame!",
				"color": 435820,
				"thumbnail": {
				  "url": "https://cdn.discordapp.com/attachments/711952428957827162/793256540676685865/BLACK_ICON.png"
				},
				"author": {
				  "name": message.client.user.username,
				  "icon_url": message.client.user.avatarURL()
				},
				"fields": [
				  {
					"name": "Step 1",
					"value": "While ingame, type /verify. The server will give you a code. Copy the code."
				  },
				  {
					"name": "Step 2",
					"value": "Return to this channel and type !verify *codehere*"
				  },
				  {
					"name": "Step 3",
					"value": "Once you get a success DM from the bot, go back ingame and type /claim."
				  },
				  {
					"name": "Success!",
					"value": "You have now linked your discord! Enjoy your reward!"
				  }
				]
			  };

			  c.send(msg);
		}else if(args[0]== "tokovoip"){
			const msg = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle("Prospect Roleplay - Tokovoip")
			.setThumbnail('https://cdn.discordapp.com/attachments/711952428957827162/793256540676685865/BLACK_ICON.png')
			//.setAuthor(client.user.username, client.user.avatarURL())
			.setDescription('Here at Prospect, we use an alternative VOIP addon called Tokovoip for TeamSpeak. This channel contains all the information you\'ll need for tokovoip.')
			.addFields(
				{
					"name": "Installation",
					"value": "\n**Step 1**\nYou'll want to download and install the latest version of Teamspeak [here](https://teamspeak.com/en/downloads/)\n\n**Step 2**\nOnce your teamspeak is installed, download and install the tokovoip plugin.\n[Direct Download (1.5.4)](https://github.com/Itokoyamato/TokoVOIP_TS3/releases/download/v1.5.6/tokovoip-1.5.4.ts3_plugin)\n[Release Page](https://github.com/Itokoyamato/TokoVOIP_TS3/releases/tag/v1.5.6)\n\n**Step 3**\nConnect to **ts.prospectroleplay.net**. Once ingame, you should automatically move to the ingame channel!"
				  },
				  {
					"name": "Additional Information",
					"value": "Sometimes, Tokovoip won't connect. Usually you can fix this by clicking plugins->tokovoip->connect at the top of Teamspeak. If this fails to work, feel free to make a support ticket."
				  },
				  {
					"name": "Key Binds",
					"value": "If this is your first time using Teamspeak, it is recommended to go to Tools->Options and setting up push to talk. Select whatever key you wish.\nFor radios and phone calls, the keybind is CAPS LOCK"
				  },
				  {
					"name": "Helpful Tips",
					"value": "To deactivate the annoying \"User has left your channel\" and along the lines, click self->sound packs->sounds deactivated and she'll go away.\nFor a more detailed approach to tokovoip, [visit our forum thread](https://prospectroleplay.net/forums/index.php?threads/tokovoip.81/)"
				  },
				  {
					"name": "Success!",
					"value": "You have now setup tokovoip and are ready to play on the server! Thanks for playing on Prospect Roleplay!"
				  },
			 )
			.setTimestamp()
			.setFooter("Last updated");

			c.send(msg);
    	}else{
        	message.reply("Unknown type.");
        	return;
       	}
    }
}