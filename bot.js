require('dotenv').config();

const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { token, client_id, test_guild_id } = process.env;

/**
 * From v13, specifying the intents is compulsory.
 * @type {Object}
 * @description Main Application Client */

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

/**********************************************************************/
// Define Collection of Commands, Slash Commands and cooldowns
client.slashCommands = new Collection();
client.triggers = new Collection();
client.cooldowns = new Collection();


/**********************************************************************/
// Below we will be making an event handler!
fs
	.readdirSync("./events")
	.filter((file) => file.endsWith(".js"))
	.map((file => {
		const event = require(`./events/${file}`);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args, client));
		} else {
			client.on(
				event.name,
				async (...args) => await event.execute(...args, client)
			);
		}
	}))


/**********************************************************************/
// Registration of Slash-Command Interactions.
fs
	.readdirSync(`./interactions/slash`)
	.filter((file) => file.endsWith(".js"))
	.map(commandFile => {
		const command = require(`./interactions/slash/${commandFile}`);
		client.slashCommands.set(command.data.name, command);
	});



/**********************************************************************/
// Registration of Slash-Commands in Discord API

const rest = new REST({ version: "9" }).setToken(token);
const commandJsonData = [...Array.from(client.slashCommands.values()).map((c) => c.data.toJSON())];

(async () => {
	try {
		console.log("Started refreshing application (/) commands.");

		await rest.put(
			/**
			 * Here we are sending to discord our slash commands to be registered.
					There are 2 types of commands, guild commands and global commands.
					Guild commands are for specific guilds and global ones are for all.
					In development, you should use guild commands as guild commands update
					instantly, whereas global commands take upto 1 hour to be published. To
					deploy commands globally, replace the line below with:
				Routes.applicationCommands(client_id)
			 */

			Routes.applicationCommands(client_id),
			{ body: commandJsonData }

			//Routes.applicationGuildCommands(client_id, test_guild_id),
			//{ body: commandJsonData }
		);

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}
})();


/**********************************************************************/
// Registration of Message Based Chat Triggers
fs.readdirSync(`./triggers`)
	.filter((file) => file.endsWith(".js"))
	.map(file => {
		const trigger = require(`./triggers/${file}`);
		client.triggers.set(trigger.name, trigger);
	})


// Login into your client application with bot's token.
client.login(token);
