const { Util, RichEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const ytdlDiscord = require('ytdl-core-discord');
const yt = require("youtube-node")
const YouTube = new yt()

YouTube.setKey(process.env.YT)

module.exports = {
	name: 'play',
	description: 'Play command.',
	usage: '[command name]',
	args: true,
  module: "music",
	cooldown: 0,
	execute: async (message, args) => {
		const { voiceChannel } = message.member;
		if (!voiceChannel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		if (!permissions.has('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
    message.songid = ''
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
    // cuz save the ratelimit from my api ;-; 
    if(args[0].startsWith("https://www.youtube.com/watch") || args[0].startsWith("https://youtu.be/") ) {
      var songInfo = await ytdl.getInfo(args[0])
          message.songid = songInfo
          console.log(message.songid)
		 const song = {
      id: message.songid.video_id,
			title: message.songid.title,
			url: message.songid.video_url,
      requested: `${message.author.username}#${message.author.discriminator}`,
      duration: message.songid.length_seconds
		};

		if (serverQueue) {
			serverQueue.songs.push(song);
			console.log(serverQueue.songs);
			return message.channel.send(`✅ **${song.title}** has been added to the queue!`);
		}

		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel,
			connection: null,
			songs: [],
			volume: 2,
			playing: true,
		};
		message.client.queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);

		const play = async song => {
			const queue = message.client.queue.get(message.guild.id);
			if (!song) {
				queue.voiceChannel.leave();
				message.client.queue.delete(message.guild.id);
				return;
			}
      let msg = true
			const dispatcher = queue.connection.playOpusStream(await ytdlDiscord(song.url), { passes: 3 })
				.on('end', reason => {
					if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
					else console.log(reason);
          if(song.loop) {
            play(queue.songs[0])
          } else {
          queue.songs.shift();
					play(queue.songs[0]);
          }
				})
				.on('error', error => console.error(error));
			dispatcher.setVolumeLogarithmic(queue.volume / 5);
      let e = new RichEmbed()
      .setAuthor
			if(msg) queue.textChannel.send(`🎶 Start playing: **${song.title}** [${time(song.duration)}]\n**Requested by: ${song.requested}**`);
		};

		try {
			const connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			message.client.queue.delete(message.guild.id);
			await voiceChannel.leave();
			return message.channel.send(`I could not join the voice channel: ${error}`);
		} 
    } else if (args[0].startsWith("https://www.youtube.com/playlist?")){
      return message.channel.send("Playlist isn't support in this bot, sorry :(")
    } else {
       YouTube.search(args.join(' '), 2, async (error, result) => {
        if(error){
          console.error(error)
          return message.channel.send("I got an error!")         
                               
        }
        else {
          let ye = JSON.parse(JSON.stringify(result, null, 2)).items[0].id.videoId
          try {
          var songInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${ye}`)
          } catch (e){
            return message.channel.send(`I got an error!\n${e}`)
          }
          message.songid = songInfo
          console.log(message.songid)
		 const song = {
      id: message.songid.video_id,
			title: message.songid.title,
			url: message.songid.video_url,
      requested: `${message.author.username}#${message.author.discriminator}`,
      duration: message.songid.length_seconds
		};

		if (serverQueue) {
			serverQueue.songs.push(song);
			console.log(serverQueue.songs);
			return message.channel.send(`✅ **${song.title}** has been added to the queue!`);
		}

		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel,
			connection: null,
			songs: [],
			volume: 2,
			playing: true,
		};
		message.client.queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);

		const play = async song => {
			const queue = message.client.queue.get(message.guild.id);
			if (!song) {
				queue.voiceChannel.leave();
				message.client.queue.delete(message.guild.id);
				return;
			}
      let msg = true
			const dispatcher = queue.connection.playOpusStream(await ytdlDiscord(song.url), { passes: 3 })
				.on('end', reason => {
					if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
					else console.log(reason);
          if(song.loop) {
            play(queue.songs[0])
          } else {
          queue.songs.shift();
					play(queue.songs[0]);
          }
				})
				.on('error', error => console.error(error));
			dispatcher.setVolumeLogarithmic(queue.volume / 5);
      let e = new RichEmbed()
      .setAuthor
			if(msg) queue.textChannel.send(`🎶 Start playing: **${song.title}** [${time(song.duration)}]\n**Requested by: ${song.requested}**`);
		};

		try {
			const connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			message.client.queue.delete(message.guild.id);
			await voiceChannel.leave();
			return message.channel.send(`I could not join the voice channel: ${error}`);
		} 
    }
      }) }
    
	}
}
