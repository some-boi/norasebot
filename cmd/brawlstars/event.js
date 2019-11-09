const BrawlStars = require("brawlstars")
const client = new BrawlStars.Client({token: process.env.BSECRET})
const { RichEmbed } = require("discord.js")

module.exports = {
	name: "event",module: "brawlstars",
	aliases: ['events'],
  usage: "<upcoming>",
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
			let em = new RichEmbed()
			.setTitle("Current")
			.setAuthor(message.author.username, message.author.avatarURL)
			.setThumbnail("https://i.pinimg.com/originals/61/a4/28/61a428624030ac3e01e2de71f2f4c87f.png")
			.setFooter("For view upcoming, use ;event <upcoming>")
			.setColor("e4b400")
      console.log(current)
      for(const se of current) {
        em.addField(`Slot: ${se.slotName}`, `Map Name: ${se.mapName}\nGame Mode: ${se.gameMode}\nEnds in: ${time(se.endTimeInSeconds)}`, true)
      }

			return message.channel.send(em)
		} else if(cu === "upcoming") {
			const upcoming = kek.upcoming.sort((x, y) => y.slot - x.slot)
			let em = new RichEmbed()
			.setTitle("Current")
			.setAuthor(message.author.username, message.author.avatarURL)
			.setThumbnail("https://i.pinimg.com/originals/61/a4/28/61a428624030ac3e01e2de71f2f4c87f.png")
			.setFooter("For view upcoming, use ;event <upcoming>")
			.setColor("e4b400")
      for(const se of upcoming) {
        em.addField(`Slot: ${se.slotName}`, `Map Name: ${se.mapName}\nGame Mode: ${se.gameMode}\nStarts in: ${time(se.startTimeInSeconds)}`, true)
      
      } return message.channel.send(em)
		} else {
			return message.reply("Please use `;events <upcoming>`")
		}
		
	}
}