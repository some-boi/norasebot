const { RichEmbed} = require("discord.js")

module.exports = {
  name: "membercount",
  aliases: ["servercount"],
  usage: "",
  module: "info",
  execute: (message, args) => {
    let monline = message.guild.members.filter(m => !m.bot && m.presence.status == "online")
    let mdnd = message.guild.members.filter(m => !m.bot && m.presence.status == "dnd")
    let midle = message.guild.members.filter(m => !m.bot && m.presence.status == "idle")
    let moffline = message.guild.members.filter(m => !m.bot && m.presence.status == "offline")
    let meonline = message.guild.members.filter(m => !m.bot && (m.presence.status == "online" || m.presence.status == "dnd" || m.presence.status == "idle"))
    let mbot = message.guild.members.filter(m => m.bot)
    let m = message.guild.members.filter(m => !m.bot)
    const e = new RichEmbed()
    .setAuthor(message.author.username, message.author.avatarURL)
    .setDescription("This command isn't work correcty")
    .addField("Members", message.guild.memberCount, true)
    .addField("Bots", mbot.size, true)
    .addField("People", m.size, true)
    .addField("Online", meonline.size, true)
    .addField("Stats", `Online: ${monline.size}\nDND: ${mdnd.size}\nIdle: ${midle.size}\nOffline: ${moffline.size}`, true)
    message.channel.send(e)
  }
}