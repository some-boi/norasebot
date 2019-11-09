
module.exports = {
	name: 'loop',
	description: 'Loop command.',
	cooldown: 5,
  module: "music",
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (serverQueue && serverQueue.loop) {
			serverQueue.loop = false;
			return message.channel.send('Disabled!');
		} else if (serverQueue && !serverQueue.loop){
      serverQueue.loop = true;
			return message.channel.send('Enabled!');
    } else {
		  return message.channel.send('There is nothing playing.');
    }
	}
};