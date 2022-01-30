const {Permissions} = require("discord.js");
const fs = require("fs");
const Logger = require("../../exports/logging");
const Prospect = require("../../exports/prospect-utils");

module.exports = {
    name: 'removeword',
    description: 'Removes a word from the filtered list.',
    usage: '<word>',
    category: 'Moderation',
    permission: "a",
    reqargs: 1,
    execute(message, args){
        let word = args[0];

        let list = fs.readFileSync("data/filteredwords.json", "utf8");

        try {
            list = JSON.parse(list);
        } catch(e) {
            Logger.Error(e);
            Prospect.TimedReply(message, `An error prevented this command from running. Try again later. \`\`\`${e}\`\`\``, 30);

            return;
        }

        let index = list.indexOf(word);

        if(index != -1) {
            list.splice(index, 1);

            try {
                fs.writeFileSync("data/filteredwords.json", JSON.stringify(list));
                Prospect.TimedReply(message, `Success! Removed ||${word}|| from the filtered list.`, 30);
            } catch (e) {
                Logger.Error(e);
                Prospect.TimedReply(message, `An error prevented this command from running. Try again later. \`\`\`${e}\`\`\``, 30);
            }
        } else {
            Prospect.TimedReply(message, `The word ||${word}|| is not in the filtered list.`, 30);

            return;
        }
    }
}