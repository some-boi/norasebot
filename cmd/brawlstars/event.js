const BrawlStars = require("brawlstars")
const client = new BrawlStars.Client({token: process.env.BSECRET})
const { RichEmbed } = require("discord.js")

module.exports = {
	name: "event",module: "brawlstars",
	aliases: ['events'],
	cooldown: 5,
	execute: async (message, args) => {
		let cu = args[0]
		const kuk = await client.getCurrentEvents()
		const kek = await client.getUpcomingEvents()
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
			if (!type) return `${hours}:${minutes}:${seconds}`
		}
		if(!cu) {
		    const current = kuk.current.sort((x, y) => x.slot - y.slot)
			const upcoming = kek.upcoming.sort((x, y) => x.slot - y.slot)
			let em = new RichEmbed()
			.setTitle("Current & Upcoming Events")
			.setAuthor(message.author.username, message.author.avatarURL)
			.setThumbnail("https://i.pinimg.com/originals/61/a4/28/61a428624030ac3e01e2de71f2f4c87f.png")
			.addField("Gem Grab", `Current: ${current[0].mapName} - Upcoming: ${upcoming[0].mapName}`, true)
			.addField("Showdown", `Current: ${current[1].mapName} - Upcoming: ${upcoming[1].mapName}`, true)
			.addField("Daily events", `Current: ${current[2].gameMode} (${current[2].mapName}) - Upcoming: ${upcoming[2].gameMode} (${current[2].mapName})`, true)
			.addField("Team events", `Current: ${current[3].gameMode} (${current[3].mapName}) - Upcoming: ${upcoming[3].gameMode} (${current[3].mapName})`, true) 
			.addField("Solo events", `Current: ${current[4].gameMode} (${current[4].mapName}) - Upcoming: ${upcoming[4].gameMode} (${current[4].mapName})`, true) 
			.setFooter("For view starts/ends time, use ;event <current/upcoming>")
			.setColor("e4b400")
			return message.channel.send(em)
		} else if(cu === "current") {
			const current = kuk.current.sort((x, y) => y.slot - x.slot)
			let em = new RichEmbed()
			.setTitle("Current Events")
			.setAuthor(message.author.username, message.author.avatarURL)
			.setThumbnail("https://i.pinimg.com/originals/61/a4/28/61a428624030ac3e01e2de71f2f4c87f.png")
			.addField(`Gem Grab - Ends in: ${time(current[0].endTimeInSeconds)}`, `${current[0].mapName}`, true)
			.addField(`Showdown - Ends in: ${time(current[1].endTimeInSeconds)}`, `${current[1].mapName}`, true)
			.addField(`Daily Events - Ends in: ${time(current[2].endTimeInSeconds)}`, `${current[2].gameMode} (${current[2].mapName})`, true)
			.addField(`Team Events - Ends in: ${time(current[3].endTimeInSeconds)}`, `${current[3].gameMode} (${current[3].mapName})`, true) 
			.addField(`Solo Events - Ends in: ${time(current[4].endTimeInSeconds)}`, `${current[4].gameMode} (${current[4].mapName})`, true)
			.setColor("e4b400") 
			return message.channel.send(em)
		} else if(cu === "upcoming") {
			const upcoming = kek.upcoming.sort((x, y) => y.slot - x.slot)
			let em = new RichEmbed()
			.setTitle("Upcoming Events")
			.setAuthor(message.author.username, message.author.avatarURL)
			.setThumbnail("https://i.pinimg.com/originals/61/a4/28/61a428624030ac3e01e2de71f2f4c87f.png")
			.addField(`Gem Grab - Starts in: ${time(upcoming[0].startTimeInSeconds)}`, `${upcoming[0].mapName}`, true)
			.addField(`Showdown - Starts in: ${time(upcoming[1].startTimeInSeconds)}`, `${upcoming[1].mapName}`, true)
			.addField(`Daily Events - Starts in: ${time(upcoming[0].startTimeInSeconds)}`, `${upcoming[2].gameMode} (${upcoming[2].mapName})`, true)
			.addField(`Team Events - Starts in: ${time(upcoming[0].startTimeInSeconds)}`, `${upcoming[3].gameMode} (${upcoming[3].mapName})`, true) 
			.addField(`Solo Events - Starts in: ${time(upcoming[0].startTimeInSeconds)}`, `${upcoming[4].gameMode} (${upcoming[4].mapName})`, true)
			.setColor("e4b400")  
			return message.channel.send(em)
		} else {
			return message.reply("Please use `;events <upcoming/current>`")
		}
		
	}
}