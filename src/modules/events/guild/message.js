const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const {
	COLORS: {red}
} = require('../../../structures/Constants');

module.exports = {
	name: 'message',
	run: async (client, message) => {
		if (!message.content.startsWith(client.prefix) || message.author.bot) return;

		const { cmd, args, flags } = message.commandProps;
		if (!cmd) return;

		const cooldown = message.commandCooldown(cmd, message.author);
		if (cooldown)
			return (
				client.delete(message) &&
				client.delete(message.channel, new client.Embed().error('On Cooldown', cooldown), 5000)
			);

		if (cmd.deleteInvoke) client.delete(message);

		const commandCheck = await message.commandCheck(args, cmd, message.author, message.guild);
		if (commandCheck)
			return (
				client.delete(message) &&
				client.delete(message.channel, new client.Embed().error('Invalid Usage', commandCheck), 25000)
			);

		try {
			cmd.execute(message, args, flags);
		} catch (error) {
			console.error(error);
		}
	}
};
