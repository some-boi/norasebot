const BrawlStars = require("brawlstars")
const client = new BrawlStars.Client({token: process.env.BSECRET})
const { Attachment, RichEmbed } = require("discord.js")

module.exports = {
  name: "leaderboard",
  aliases: ['lb'],
  usage: "<brawl <name>/club>",
  cooldown: 5,
  module: "brawlstars",
  execute: async (message,args) => {
    if(!args[0]) {
      const ye = await client.getTopPlayers({count: 10})
      console.log(ye)
      const e = new RichEmbed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setTitle("Top 10 Players")
      .setThumbnail("https://i.pinimg.com/originals/61/a4/28/61a428624030ac3e01e2de71f2f4c87f.png")
      .setDescription(`NAME  -   TROPHIES\n\n${ye.map(m => `${m.name} (${m.tag}) - ${m.trophies}`).join('\n')}`)
      message.channel.send(e)
    } else if(args[0] == "club") {
      const ye = await client.getTopClubs(10)
      console.log(ye)
      const e = new RichEmbed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setTitle("Top 10 Clubs")
      .setThumbnail("https://i.pinimg.com/originals/61/a4/28/61a428624030ac3e01e2de71f2f4c87f.png")
      .setDescription(`NAME  -   TROPHIES\n\n${ye.map(m => `${m.name} (${m.tag}) - ${m.trophies}`).join('\n')}`)

      message.channel.send(e)
    } else if(args[0] == "brawl") {
      let ar = args[1]
      if(!ar) return message.channel.send("Please use `;lb brawl <name>`")
      const ye = await client.getTopPlayers({count: 10, brawler: ar})
      const e = new RichEmbed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setTitle("Top 10 Brawlers")
      .setThumbnail("https://i.pinimg.com/originals/61/a4/28/61a428624030ac3e01e2de71f2f4c87f.png")
      .setDescription(`NAME  -   TROPHIES\n\n${ye.map(m => `${m.name} (${m.tag}) - ${m.trophies}`).join('\n')}`)
      message.channel.send(e)
    } else {
      return message.channel.send("Do `;lb <brawl <name>/club>`")
    }
  }
}