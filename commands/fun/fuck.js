const Discord = require("discord.js");

module.exports = {
    name: 'fuck',
    description: 'Shit',
    usage: 'none',
    category: 'Fun',
    permission: 0,
    reqargs: 2,
    execute(message, args){
       message.reply("ur a fuckstick");
       var db = message.client.getDB();

       console.log(message.client.hasRole(message.member, "502031842229223424"));

       console.log(message.client.isStaff(message.client.ranks.management, message.member));

       db.query('SELECT * FROM `characters` WHERE `id` = 5', function(err, res){
        if(err) throw err;
        console.log(res[0].firstname);

       });
        //taggedMember.kick(reason);
    }
}