const {RichEmbed} = require("discord.js")

module.exports = {
	name: 'np',
	description: 'Now playing command.',
	cooldown: 5,
  module: "music",
  aliases: ['nowplaying', 'now-playing'],
	execute: (message) => {
    function time(stuff, type) {
			let totalSeconds = stuff
			let days = Math.floor(totalSeconds / 86400);
			let hours = Math.floor(totalSeconds / 3600);
			totalSeconds %= 3600;
			let minutes = Math.floor(totalSeconds / 60);
			let seconds = totalSeconds % 60;
			if (type == "days") return days
			if (type == "hours") return hours
			if (type == "minutes") return minutes
			if (type == "seconds") return seconds
			if (!type) return `${hours}:${!minutes.toString().lenght == 2 ? "0" + minutes.toString() : minutes}:${seconds}`
		}
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		const e  = new RichEmbed()
    .setAuthor("Now playing!", message.author.avatarURL)
    .setTitle(serverQueue.songs[0].title)
    .addField("Requested by", serverQueue.songs[0].requested)
    .addField("Duration", time(serverQueue.songs[0].duration))
	}
};