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
		.setName("set-length")
		.setDescription(
			"Enter a length for generated code"
		)
		.addStringOption((option) =>
			option
				.setName("max_length")
				.setDescription("Enter a maximum length to generate code")
		),

	async execute(interaction) {
		const max_length = interaction.options.getString("max_length");

    // Check no input
		if (!max_length) {
			const embed = new MessageEmbed()
				.setTitle('Please, enter a maximum length to generate code! e.g.) 100')
				.setColor(0xD0312D);
			return interaction.reply({ embeds: [embed] });
		}

    // Check non number or new length <= 0
    const lengthStrtoInt = parseInt(max_length);
    if(isNaN(lengthStrtoInt) || (lengthStrtoInt <= 0)) {
      const embed = new MessageEmbed()
        .setTitle('Please, enter a number larger than 0')
        .setColor(0xD0312D);
      return interaction.reply({ embeds: [embed] });
    }

		// save at process.env
		process.env.max_length = lengthStrtoInt;

    console.log('SlashCommand: set max length to ', lengthStrtoInt);
		
    const embed = new MessageEmbed().setColor(0x4286f4)
			.setTitle(`Activiated!`)
			.setDescription('code maximum length is set `' + max_length + '`');
		await interaction.reply({ embeds: [embed] });
	},
};
