//
const {Permissions, MessageEmbed} = require("discord.js");
const Logger = require("./logging");
const fs = require('fs');
 
const Roles = {
    "538413605230477342": ["s+", "s", "a", "m+", "m"], // management/owner 538413605230477342
    "802999460837064704": ["s", "a", "m+", "m"], // senior admin 802999460837064704
    "559759611146797058": ["a", "m+", "m"], // Admin 559759611146797058
    "538413691671150616": ["a", "m+", "m"], // Developer 538413691671150616
    "802999548582297670": ["m+", "m"], // senior mod 802999548582297670
    "559759779183067136": ["m"], // mod 559759779183067136
    "723142991912632381": ["m"], // trial mod 723142991912632381
}

const PDRoles = {
    "723142305405730847": ["pdhc", "pdc", "pdspv", "pdd", "pdfto", "pd"], // pd high command
    "723142433885651014": ["pdc", "pdspv", "pdd", "pdfto", "pd"], // pd command
    "723142515217399818": ["pdspv", "pdd", "pdfto", "pd"], // pd spv whatever the fuck that means
    "828657657799508018": ["pdd", "pdfto", "pd"], // detective
    "723251977579921480": ["pdfto", "pd"], // fto
    "723142702384021516": ["pd"] // regular cop
}

module.exports = {
    Config: {
        LoggingChannel: "557852098964750337", // 707466055517208627
        FiveMGuild: "538413338913407006",
        FilteredWords: ["nigger", "faggot", "spic", "fag", "nigga"],
        Client: null
    },

    /**
     * Initialize the bot.
     * 
     * @param {Client} client 
     * 
     */
    Init: (client) => {
        if(!fs.existsSync("./data/warnings")) {
            Logger.Debug("data/warnings folder does not exist, lets create it!");
    
            fs.mkdirSync("./data/warnings", {recursive: true});
        }

        if(fs.existsSync(`data/filteredwords.json`)) {
            let data = fs.readFileSync("data/filteredwords.json", "utf8");
        
            try{
                data = JSON.parse(data);
        
                module.exports.Config.FilteredWords = data;
            } catch(e) {
                Logger.Error(`Error reading filteredwords.json: ${e}`);
            }
        
        } else {
            fs.writeFileSync("data/filteredwords.json", JSON.stringify(module.exports.Config.FilteredWords));
        }

        module.exports.Config.Client = client;

        Logger.Info("Prospect Roleplay bot started!");
    },

    /**
     * Grabs a member from FiveM discord.
     * 
     * @param {Int} id 
     * @return {GuildMember} The member.
     */
    GetMember: (id) => {
        let g = module.exports.Config.Client.guilds.cache.get(module.exports.Config.FiveMGuild)
        if(!g) {
            g = module.exports.Config.Client.guilds.cache.get("468893611220795412")// my dev discord
        }

        return g.members.cache.get(id);
    },

    HasAccess: (access, usr) => {
        if(usr.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) // those with admin permission will have access to *everything*
            return true;

        if(access == 0 || access == "everyone") // 0 == everyone
            return true;

        if(typeof access == "bigint") { // discord.js permissions are bigints
            if(usr.permissions.has(access)) {
                return true;
            }

            return false;
        }

        if(access.indexOf('pd') != -1) { // all pd roles have pd in the access string.

            usr.roles.cache.forEach((v, k) => {
                if(PDRoles[k] && PDRoles[k].includes(access)) {
                    return true;
                }
            });

            return false;
        }
        
        usr.roles.cache.forEach((v, k) => {
            if(Roles[k] && Roles[k].includes(access)) {
                return true;
            }
        });

        return false;
    },

    HasRole: (role, usr) => {
        if(usr.roles.cache.get(role)) {
            return true;
        }

        return false;
    },

    GetGuildChannel: (channel) => {
        var client = module.exports.Config.Client;

        if(!client.guilds.cache.get("538413338913407006")) {
            return;
        }

        let guild = client.guilds.cache.get("538413338913407006");

        return guild.channels.cache.get(channel);
    },

    SendMessage: (usr, msg) => {
        usr.send(msg).catch(Logger.Error);
    },

    TimedReply: (msg, reply, timeDelete = 30) => {
        timeDelete = parseFloat(timeDelete) * 1000;

        msg.reply(reply).then(message => {
            setTimeout(() => {
                message.delete().catch(Logger.Error);
            }, timeDelete);
        }).catch(Logger.Error);
    },

    AddRole: (usr, roleid) => {
        usr.roles.add(roleid).catch(Logger.Error);
    },

    GetRoleConst: () => {
        return Roles;
    },

    GetPDRoles: () => {
        return PDRoles;
    },

    GetTaggedMemberUser: (message, input) => {
        if(message.mentions.users.size) {
            const taggedUser = message.mentions.users.first();
            const taggedMember = message.mentions.members.first();

            return [taggedUser, taggedMember]; // user will always be at index 0, member will always be 1
        }

        let member = module.exports.GetMember(input);
        if(!member)
            return false;
        
        let user = member.user;

        return [user, member];
    },

    GetUserWarnings: (id) => {
        if(!fs.existsSync(`data/warnings/${id}.json`)) {
            return false;
        }

        try {
            let data = fs.readFileSync(`data/warnings/${id}.json`, "utf8");

            if(data == "") 
                return false;

            try {
                data = JSON.parse(data);

                if(data.length == 0) {
                    return false;
                }

                return data; 
            } catch(e) {
               Logger.Error(e);

               return null;
            }
        } catch(err) {
            Logger.Error(err);
        }
    },

    GiveUserWarning: (id, reason, admin) => {
        const Timestamp = Math.trunc(Date.now() / 1000);

        let writeData = {
            DateGiven: Timestamp,
            Admin: [admin.user.username, admin.id],
            Reason: reason,
            Expires: Timestamp + 604800, // 1 week
            Expired: false
        }

        let userWarnings = module.exports.GetUserWarnings(id);
        if(userWarnings == null) {
            Logger.Warning("prospect-utils.GetUserWarnings returned NULL!");

            return;
        }

        let active = 0;

        if(userWarnings == false) {
            userWarnings = [writeData];
        } else {
            userWarnings.forEach((val, index) => {
                if(val.Expires <= Timestamp) {
                    val.Expired = true;
                } else {
                    active += 1;
                }
            });
    
            userWarnings[userWarnings.length] = writeData;
        }

        try {
            fs.writeFileSync(`data/warnings/${id}.json`, JSON.stringify(userWarnings));
        } catch (e) {
            Logger.Error(e);

            return false; // false -> error. see, you dont need to throw a fucking exception for literally everything.
        }

        if(active > 5) {
            var member = module.exports.GetMember(id);
            member = member[1];

            if(!member) {
                admin.send(`This user (${id}) has more than 5 active warnings, however I was unable to ban them. Please ban them manually using !ban.`);

                return;
            }

            member.send("You've been given a warning. This warning has placed you above the 5 warning limit, and you have been banned from the discord.\nPlease appeal if you feel unfairly treated @ https://prospectroleplay.net/forums")
            member.ban({days: 0, reason: "You have more than 5 active warnings and have been banned."});

            return;
        }

        return true;
    },

    RemoveUserWarning: (userid, warnid) => {
        let warnings = module.exports.GetUserWarnings(userid);

        if(warnings == null || warnings == false)
            return;
        
        warnid = parseInt(warnid) - 1;

        warnings.splice(warnid, 1);

        try {
            fs.writeFileSync(`data/warnings/${userid}.json`, JSON.stringify(warnings));
        } catch(e) {
            Logger.Error(e);

            return false;
        }
    },

    ExpireUserWarning: (userid, warnid) => {
        let warnings = module.exports.GetUserWarnings(userid);

        if(warnings == null || warnings == false)
            return;
        
        warnid = parseInt(warnid) - 1;

        warnings[warnid].Expired = true;
        warnings[warnid].Expires = Date.now() / 1000;

        try {
            fs.writeFileSync(`data/warnings/${userid}.json`, JSON.stringify(warnings));
        } catch(e) {
            Logger.Error(e);

            return false;
        }
    },

    ModerationLog: (title, desc, admin = null) => {
        let avatar = "https://cdn.discordapp.com/attachments/711952428957827162/793256549270552606/WHITE_ICON.png";

        if(admin == null) {
            admin = module.exports.Config.Client.user;
        } else {
            avatar = admin.avatarURL();
        }


        const newEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Moderation Action: ${title}`)
            .setAuthor('Prospect Roleplay', 'https://cdn.discordapp.com/attachments/711952428957827162/793256549270552606/WHITE_ICON.png')
            .setDescription(desc)
            .setThumbnail('https://cdn.discordapp.com/attachments/711952428957827162/793256549270552606/WHITE_ICON.png')
            .setTimestamp()
            .setFooter(`Executed by ${admin.tag}`, `${avatar}`);

        let channel = module.exports.GetGuildChannel(module.exports.Config.LoggingChannel);

        if(!channel)
            return false;

        channel.send({embeds: [newEmbed]}).catch(Logger.Error);
    }
}