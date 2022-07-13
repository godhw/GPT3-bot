/**
 * @file Main trigger handler file.
 */

function isNeedToTriggered(content, { keywords, prefixes, suffixes }) {
	const lowerCaseContent = content.toString().toLowerCase()

	if (keywords.some(keyword => lowerCaseContent.includes(keyword))) return true;
	if (prefixes.some(prefix => lowerCaseContent.startsWith(prefix))) return true;
	if (suffixes.some(suffix => lowerCaseContent.endsWith(suffix))) return true;

	return false;
}


module.exports = {
	name: "messageCreate",

	/**
	 * @description Executes when a message is created and handle it.
	 * @param {*} message The message which was created.
	 */
	async execute(message) {
		const { content, channel } = message;

		const args = content.split(/ +/);
		const { name: channelName } = channel

		// Checks if the trigger author is a bot. Comment this line if you want to reply to bots as well.
		if (message.author.bot) return;
		// Skip if channelName is not equal to trigger channel
		if (channelName.toLowerCase() !== process.env.trigger_channel) return;

		await message.client.triggers.every(async (trigger) => {
			if (!isNeedToTriggered(content, trigger)) return;

			try {
				await trigger.execute(message, args);
			} catch (error) {
				console.error(error);
				await message.reply({
					content: "there was an error trying to execute that trigger!",
				});
			}
		});
	},
};
