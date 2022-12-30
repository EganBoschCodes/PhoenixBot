const { Client, GatewayIntentBits, Events, Partials } = require('discord.js');

const FireStore = require("./firebase/firestore.js");
const ReactionRoles = require('./reaction-roles/ReactionRoles.js');
const CommandHandler = require('./slash-commands/CommandHandler.js');
const SpamHandler = require('./spam/SpamHandler.js');
const Welcome = require('./welcome/Welcome.js');
const MessageDeletionListener = require('./message-deletion/MessageDeletionListener.js');

require('dotenv').config();
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
console.log("Discord Token: " + DISCORD_TOKEN);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions], partials: [Partials.Message, Partials.Channel, Partials.Reaction] });

/*
 * INITIALIZE
 */

client.on(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user.tag}.`)

    await FireStore.initFirebase();
    CommandHandler.registerCommands(client);
});

/*
 * EVENT HANDLERS
 */

client.on(Events.InteractionCreate, (interaction) => CommandHandler.handleInteraction(client, interaction));

client.on(Events.MessageCreate, async (message) => {

    if (!message.guild || message.author.bot) return;

    //Get necessary data, initializing with a default set of data if no record exists.
    let guildData = await FireStore.getDefault({ NAME: client.guilds.cache.get(message.guildId).name }, FireStore.Collections.GUILD_SETTINGS, message.guildId);
    let userData = await FireStore.getDefault({name: message.author.username, history: {}, offense_log: []}, FireStore.Collections.USER_DATA, message.author.id);

    //All feature functionality.
    Welcome.welcomeStudent(client, message, userData, guildData);
    SpamHandler.checkMessage(message);

    // Save any changes to database.
    FireStore.set(FireStore.Collections.USER_DATA, message.author.id, userData);
    FireStore.set(FireStore.Collections.GUILD_SETTINGS, message.guildId, guildData);

});

//Listen for reactions to messages.
client.on(Events.MessageReactionAdd, (reaction, user) => ReactionRoles.handleReaction(client, reaction, user, 'add'));
client.on(Events.MessageReactionRemove, (reaction, user) => ReactionRoles.handleReaction(client, reaction, user, 'remove'));

//Listen for deleted messages.
client.on(Events.MessageDelete, async (message) => MessageDeletionListener.report(client, message));

client.login(DISCORD_TOKEN);