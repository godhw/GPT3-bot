/**
 * @file Sample help command with slash command.
 * @author Naman Vrati
 * @author Thomas Fournier <thomas@artivain.com>
 * @since 3.0.0
 * @version 3.1.0
 */

// Deconstructed the constants we need in this file.

const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("set-channel")
		.setDescription(
			"Enter a channel name to activate this AINFT chatbot"
		)
		.addStringOption((option) =>
			option
				.setName("name")
				.setDescription("Enter a channel name to activate")
		),

	async execute(interaction) {
		const name = interaction.options.getString("name");

		if (!name) {
			const embed = new MessageEmbed()
				.setTitle('Please, enter a channel name to activate')
				.setColor(0xD0312D);
			return interaction.reply({ embeds: [embed] });
		}


		const channels = await interaction.guild.channels.fetch();
		const channelNames = channels.map(channel => channel.name.toLowerCase());
		const isExist = channelNames.some(channelName => channelName === name.toLowerCase())

		if (!isExist) {
			const embed = new MessageEmbed()
				.setTitle('`' + name + '` channel does not exist.')
				.setColor(0xD0312D)
			return interaction.reply({ embeds: [embed] });
		}

		// save at process.env
		process.env.trigger_channel = name;

		const embed = new MessageEmbed().setColor(0x4286f4)
			.setTitle(`Activiated!`)
			.setDescription("AINFT Chatbot has been activated in " + '`' + name + '` channel');
		await interaction.reply({ embeds: [embed] });
	},
};
