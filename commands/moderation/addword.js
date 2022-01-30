const {Permissions} = require("discord.js");
const fs = require("fs");
const Logger = require("../../exports/logging");
const Prospect = require("../../exports/prospect-utils");

module.exports = {
    name: 'addword',
    description: 'Adds a word to the filter list.',
    usage: '<word>',
    category: 'Moderation',
    permission: "a",
    reqargs: 1,
    execute(message, args){
        let word = args[0];

        let list = fs.readFileSync("data/filteredwords.json", "utf8");

        try {
            list = JSON.parse(list);

            list.push(word);

            try {
                fs.writeFileSync("data/filteredwords.json", JSON.stringify(list));

                Prospect.TimedReply(message, `Success! Added ||${word}|| to the filtered list.`, 30);
            } catch (e) {
                Logger.Error(e);

                Prospect.TimedReply(message, `An error prevented this command from running. Try again later. \`\`\`${e}\`\`\``, 30);
            }
        } catch(e) {
            Logger.Error(e);

            Prospect.TimedReply(message, `An error prevented this command from running. Try again later. \`\`\`${e}\`\`\``, 30);
        }
    }
}