const { getEmbed } = require("../utils.js");

const WELCOME_MESSAGES = [
    "We're so glad you're here",
    "So excited that you're joining us",
    "You're gonna have a blast",
    "Get ready for the time of your life",
    "Oh yeah, it's gamin' time"
];

module.exports = {
    welcomeStudent: (client, message, _, guildData) => {

        if (!guildData.WELCOME_CHANNEL || !guildData.GENERAL || message.channelId !== guildData.WELCOME_CHANNEL || message.content.length > 0) return;

        let embed = getEmbed()
            .setTitle(`Welcome, ${message.author.username}!`)
            .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=64`)
            .addFields({name: "\u200b", value: `${WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)]}, <@${message.author.id}>!`});

        try {
            client.channels.cache.get(guildData.GENERAL).send({ embeds: [embed] });
        }
        catch (e) {
            console.log(e);
        }
        
    }
}