const { RichEmbed } = require("discord.js")

module.exports = {
  name: "servericon",
  aliases: ["icon", "iconserver", "server-icon"],
  module: "info",
  cooldown: 1,
  execute: (message, args) => {
    let g = message.guild
    function a() {
      let url = `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.`
      if(g.features.find(m => m == "ANIMATED_ICON")) {
        url += "gif"
        return url
      } else {
        url += "png"
        return url
      }
    }
    const e = new RichEmbed()
    .setTitle(`${g.name}'s icon'`)
    .setImage(a())
    .setAuthor(message.author.username, message.author.avatarURL)
    message.channel.send(e)
  }
}