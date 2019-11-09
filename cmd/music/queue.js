module.exports = {
	name: 'queue',
	description: 'Queue command.',
	cooldown: 5,
  module: "music",
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('There is nothing playing.');
    console.log(serverQueue)
		return message.channel.send(`
__**Song queue (${serverQueue.songs.lenght} songs added):**__
${serverQueue.songs.map(song => `**-** ${song.title} | Requested by ${song.requested}`).join('\n')}
**Now playing:** ${serverQueue.songs[0].title}
		`);
	}
};