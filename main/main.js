const { Client, GatewayIntentBits } = require('discord.js');

const FireStore = require("./firebase/firestore.js");
const CommandHandler = require('./slash-commands/CommandHandler.js');
const SpamHandler = require('./spam/SpamHandler.js');
const Welcome = require('./welcome/Welcome.js');

require('dotenv').config();
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
console.log("Discord Token: " + DISCORD_TOKEN);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent] });

/**
 * INITIALIZE
 */

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}.`)

    await FireStore.initFirebase();
    CommandHandler.registerCommands(client);
});

/**
 * EVENT HANDLERS
 */

client.on('interactionCreate', (interaction) => CommandHandler.handleInteraction(client, interaction));

client.on('messageCreate', async (message) => {

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

client.login(DISCORD_TOKEN);