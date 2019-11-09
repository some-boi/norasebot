const BrawlStars = require("brawlstars")
const client = new BrawlStars.Client({token: process.env.BSECRET})
const { Attachment, RichEmbed } = require("discord.js")

module.exports = {
	name: "profile",module: "brawlstars",
	aliases: ["bsprofile"],
	usage: "<tag/mention>",
	cooldown: 5,
	execute: async (message, args) => {
		let user = message.mentions.members.first()
		if(!user) { 
		    user = args[0]
			if(!user) {
        if(!message.client.db.has(message.author.id)) {
          				return message.reply("Input your Brawl Stars Token", new Attachment("https://cdn.glitch.com/77a81f9d-ba11-4b9e-ad58-ab4119ff297e%2Ftag.png", "tag.png")).catch(e => console.error(e))
        } else {
          user = message.client.db.get(message.author.id).toString()
        }
			}
		}
		try {
			let player = await client.getPlayer(user)
			const bestBrawler = player.brawlers.sort((a, b) => b.trophies - a.trophies)[0]
			const stat = `Trophies: ${player.trophies} (${player.highestTrophies})\nBrawlers Unlocked: ${player.brawlersUnlocked}\nVictories: ${player.victories}\n  Solo Showdown: ${player.soloShowdownVictories}\n  Duo Showdown: ${player.duoShowdownVictories}\nTotal EXP: ${player.totalExp}\nEXP process: ${player.expFmt}`
			const best = `Big Brawler: ${player.bestTimeAsBigBrawler}\nRoboRumbleTime: ${player.bestRoboRumbleTime}`
			const em = new RichEmbed()
			.setTitle(`${player.name} (${player.tag})`)
			.setThumbnail(player.avatarUrl)
			.setAuthor(!player.club ? "No clan" : player.club.name, !player.club ? null : player.club.badgeUrl)
			.setColor(player.nameColorCode)
			.addField("Stats", stat)
			.addField("Best time as", best)
			.addField("Best Brawler", `${bestBrawler.name} - Trophies: ${bestBrawler.trophies} - Power: ${bestBrawler.power}`)
			return message.channel.send(em)
			
		} catch (e) {
			console.error(e)
			return message.reply(`It looks like I cannot get a player :(\n${e}`).catch(e => console.error(e))
		}
	}
}
		