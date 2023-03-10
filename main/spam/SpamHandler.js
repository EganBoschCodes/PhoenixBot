const AntiSpam = require("discord-anti-spam");

let spamHandler = new AntiSpam({
    warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
    muteThreshold: 4, // Amount of messages sent in a row that will cause a mute
    kickThreshold: 7, // Amount of messages sent in a row that will cause a kick.
    banThreshold: 7, // Amount of messages sent in a row that will cause a ban.
    maxInterval: 2000, // Amount of time (in milliseconds) in which messages are considered spam.
    warnMessage: "{@user}, Please stop spamming.", // Message that will be sent in chat upon warning a user.
    kickMessage: "**{user_tag}** has been kicked for spamming.", // Message that will be sent in chat upon kicking a user.
    muteMessage: "**{user_tag}** has been muted for spamming.", // Message that will be sent in chat upon muting a user.
    banMessage: "**{user_tag}** has been banned for spamming.", // Message that will be sent in chat upon banning a user.
    maxDuplicatesWarning: 6, // Amount of duplicate messages that trigger a warning.
    maxDuplicatesKick: 10, // Amount of duplicate messages that trigger a warning.
    maxDuplicatesBan: 12, // Amount of duplicate messages that trigger a warning.
    maxDuplicatesMute: 8, // Ammount of duplicate message that trigger a mute.
    ignoredPermissions: [], //"ADMINISTRATOR" // Bypass users with any of these permissions.
    ignoreBots: true, // Ignore bot messages.
    verbose: true, // Extended Logs from module.
    ignoredMembers: [], // Array of User IDs that get ignored.
    unMuteTime:  10, // Amount of time (in minutes) a user will be muted for.
    removeMessages: true, // If the bot should remove all the spam messages when taking action on a user!
    modLogsEnabled: false, // If to enable modlogs
    modLogsChannelName: "mod-logs", // channel to send the modlogs too!
    modLogsMode: "embed",
    // And many more options... See the documentation.
});

module.exports = {
    checkMessage: (message) => spamHandler.message(message)
}