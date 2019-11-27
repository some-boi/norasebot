const {RichEmbed} = require("discord.js")

module.exports = {
  name: "case",
  aliases: ["viewcase", "view-case"],
  permission: ["MANAGER_GUILD"],
  module: "manager",
  execute: (message, args) => {
    let view = args[0]
    if(!view) return message.channel.send("Please use `;case <number of case>`")
    let viewer = message.client.warn.get(message.guild.id)
    if(!viewer) return message.channel.send("There's no case using this bot")
    let p = viewer.find(m => m.case == view)
    if(!p) return message.channel.send("That case is not found")
    let e = new RichEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL)
    .setTitle(`Case: ${view}   ${p.user} (${p.userid})`)
    .setColor('25c059')
    .addField("Action", p.action)
    if(p.mod)
    e.addField("Moderator", !message.guild.members.find(m => m.id == p.mod) ? `A mod has left (${p.mod})` : message.guild.members.find(m => m.id == p.mod).tag)
    else e.addField("Moderator", message.client.user.tag)
    e.addField("Reason", p.reason.length < 1 ? "No reason" : p.reason)
    message.channel.send(e)
  }
}