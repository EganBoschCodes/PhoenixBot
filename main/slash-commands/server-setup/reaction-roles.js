const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const FireStore = require("../../firebase/firestore.js");
const { getEmbed } = require("../../utils.js");

module.exports = {
    name: "reactionrole",
    subcommands: [ ["create", []], ["add", ["role", "emoji"]], ["remove", ["role"]], ["delete", []] ], 
    description: "Creates or modifies the reaction role message in the server.",

	data: new SlashCommandBuilder()
		.setName('reactionrole')
		.setDescription('Sets up what channels do what in your server.')
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers)
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create a new Reaction Role message.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a new reaction role to the message.')
                .addRoleOption(option =>
                    { return option.setName('role')
                        .setDescription('The role granted by reaction with the given emoji.')
                        .setRequired(true)
                        })
                .addStringOption(option =>
                    { return option.setName('emoji')
                        .setDescription('The emoji reaction granting the role.')
                        .setRequired(true)
                        })
                .addStringOption(option =>
                    { return option.setName('description')
                        .setDescription('What the role is for.')
                        .setRequired(true)
                        }))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Add a new reaction role to the message.')
                .addRoleOption(option =>
                    { return option.setName('role')
                        .setDescription('The role granted by reaction with the given emoji.')
                        .setRequired(true)
                        }))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Deletes the reaction role message.')),

	execute: {
        
        create: async (client, interaction) => {
            let guild = interaction.guildId;
            let guildData = await FireStore.getDefault({}, FireStore.Collections.GUILD_SETTINGS, guild);

            if (!guildData.REACTION_ROLES_CHANNEL) {
                await interaction.reply({ content: 'First register a channel as the Reaction Roles channel using the `/setup` command!', ephemeral: true });
                return;
            }
            
            let embed = getEmbed()
                .setTitle("React For Roles:");

        
            let reactionMessage = await client.channels.cache.get(guildData.REACTION_ROLES_CHANNEL).send({ embeds: [embed] });
            guildData.REACTION_ROLES_MESSAGE = reactionMessage.id;
            FireStore.set(FireStore.Collections.GUILD_SETTINGS, reactionMessage.guildId, guildData);

            await interaction.reply({ content: 'Successfully created the reaction roles message!', ephemeral: true });
	    },

        add: async (client, interaction) => {
            let guild = interaction.guildId;
            let guildData = await FireStore.getDefault({REACTION_ROLES: []}, FireStore.Collections.GUILD_SETTINGS, guild);

            if (!guildData.REACTION_ROLES_MESSAGE) {
                await interaction.reply({ content: 'First create a reaction roles message using the `/reactionroles create` command!', ephemeral: true });
                return;
            }

            let role = interaction.options.getRole("role");
            let emoji = interaction.options.getString("emoji");
            let desc = interaction.options.getString("description");

            if (emoji.length != 2 || !/\p{Emoji}/u.test(emoji)) {
                interaction.reply({content: "Please input exactly one emoji!"});
                return;
            }
            
            for (let existingRole of guildData.REACTION_ROLES) {
                if (existingRole.emoji == emoji) {
                    await interaction.reply({ content: `\`${emoji}\` is already taken for <@&${existingRole.id}>, use a different one!`, ephemeral: true });
                    return;
                }
                if (existingRole.id == role.id) {
                    await interaction.reply({ content: `<@&${role.id}> is already added, with emoji \`${existingRole.emoji}\`!`, ephemeral: true });
                    return;
                }
            }


            guildData.REACTION_ROLES.push( {name: role.name, id: role.id, emoji: emoji, description: desc} );
            FireStore.set(FireStore.Collections.GUILD_SETTINGS, guild, guildData);

            let reactionMessage = await client.channels.cache.get(guildData.REACTION_ROLES_CHANNEL).messages.fetch(guildData.REACTION_ROLES_MESSAGE);
            
            let embed = getEmbed().setTitle("React For Roles:");
            for (let role of guildData.REACTION_ROLES) {
                embed.addFields({ name: role.name+": " + role.emoji, value: role.description });
            }

            reactionMessage.edit({ embeds: [embed] })
            reactionMessage.react(emoji);

            await interaction.reply({ content: 'Successfully added new reaction role option!', ephemeral: true });
	    },

        remove: async (client, interaction) => {
            let guild = interaction.guildId;
            let guildData = await FireStore.getDefault({REACTION_ROLES: []}, FireStore.Collections.GUILD_SETTINGS, guild);

            if (!guildData.REACTION_ROLES_MESSAGE) {
                await interaction.reply({ content: 'First create a reaction roles message using the `/reactionroles create` command!', ephemeral: true });
                return;
            }

            let role = interaction.options.getRole("role");
            let found = false;

            let reactionMessage = await client.channels.cache.get(guildData.REACTION_ROLES_CHANNEL).messages.fetch(guildData.REACTION_ROLES_MESSAGE);

            for (let index in guildData.REACTION_ROLES) {
                let existingRole = guildData.REACTION_ROLES[index];
                if (existingRole.id == role.id) {
                    guildData.REACTION_ROLES.splice(index, 1);
                    reactionMessage.reactions.cache.get(existingRole.emoji).remove();
                    found = true;

                    await interaction.reply({ content: `<@&${existingRole.id}> has been successfully removed!`, ephemeral: true });
                }
            }

            if (!found) { await interaction.reply({ content: `The role <@&${existingRole.id}> is already not registered in the reaction role message!`, ephemeral: true }); return; }

            FireStore.set(FireStore.Collections.GUILD_SETTINGS, guild, guildData);
            
            let embed = getEmbed().setTitle("React For Roles:");
            for (let role of guildData.REACTION_ROLES) {
                embed.addFields({ name: role.name+": " + role.emoji, value: role.description });
            }

            reactionMessage.edit({ embeds: [embed] })
	    },

        delete: async (client, interaction) => {
            let guild = interaction.guildId;
            let guildData = await FireStore.getDefault({}, FireStore.Collections.GUILD_SETTINGS, guild);

            if (!guildData.REACTION_ROLES_MESSAGE) {
                await interaction.reply({ content: 'No reaction roles message to remove!', ephemeral: true });
                return;
            }

            await interaction.reply({ content: 'Successfully removed the reaction roles message!', ephemeral: true });

            (await client.channels.cache.get(guildData.REACTION_ROLES_CHANNEL).messages.fetch(guildData.REACTION_ROLES_MESSAGE)).delete();

            delete guildData.REACTION_ROLES_MESSAGE;
            delete guildData.REACTION_ROLES;
            FireStore.set(FireStore.Collections.GUILD_SETTINGS, guild, guildData);
	    }
    },
};