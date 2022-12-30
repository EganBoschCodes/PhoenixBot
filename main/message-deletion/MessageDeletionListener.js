const { getEmbed } = require("../utils.js");
const FireStore = require("../firebase/firestore.js");
const { AuditLogEvent } = require('discord.js');

module.exports = {
    report: async (client, message) => {
        if (!message.guild) return;

        const fetchedLogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MessageDelete,
        });
        
        const deletionLog = fetchedLogs.entries.first();

        // This is because no audit log is emitted when a message is self deleted, so if no log is emitted we can assume it was self-deleted.
        let deleter = message.author.id;

        if (deletionLog) {
            const { executor, target } = deletionLog;

            if (target.id === message.author.id) deleter = executor.id;
        }

        let embed = getEmbed()
                .setTitle("Message Deletion:")
                .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=64`)
                .addFields( 
                    {name: "Author:",value: `<@${message.author.id}>`},
                    {name: "Deleted By:",value: `<@${deleter}>`},
                    {name: "Message:",value: `\`${message.content}\``});

        let guildData = await FireStore.getDefault({}, FireStore.Collections.GUILD_SETTINGS, message.guildId);

        if(guildData.NAME_CHANGE_CHANNEL) {
            client.channels.cache.get(guildData.NAME_CHANGE_CHANNEL).send({ embeds: [embed] });
        }
    }
}