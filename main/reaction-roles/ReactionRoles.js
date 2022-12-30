const FireStore = require("../firebase/firestore.js");

module.exports = {
    handleReaction: async (client, reaction, user, action) => {

        if (user.id === client.user.id) return;
        
        let guild = reaction.message.guildId;
        let guildData = await FireStore.getDefault({}, FireStore.Collections.GUILD_SETTINGS, guild);

        if (!guildData.REACTION_ROLES_MESSAGE) return;
        if (reaction.message.id != guildData.REACTION_ROLES_MESSAGE) return;

        for (let reactionRole of guildData.REACTION_ROLES) {
            if (reaction.emoji.name === reactionRole.emoji) {
                var currentGuild = client.guilds.cache.get(guild);
                var role = currentGuild.roles.cache.get(reactionRole.id);
                (await currentGuild.members.fetch(user.id)).roles[action](role);

                return;
            }
        }
    }
}