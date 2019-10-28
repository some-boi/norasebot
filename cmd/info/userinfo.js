const { RichEmbed } = require("discord.js")
const moment = require("moment");
module.exports = {
  name: "userinfo",
  aliases: ['whois'],
  usage: "<mention>",
  module: "info",
  execute: (message,args) => {
    let user = message.mentions.members.first()
    if(!user) {
      try {
      user = message.client.fetchUser(args[0])
      } catch {
      user = message.author
      }
    }
    const member = message.guild.member(user)
    const e = new RichEmbed()
    .setAuthor(message.author.username, message.author.avatarURL)
    .setTitle(`${user.username}#${user.discriminator}`)
    .setDescription(!user.presence.game.name == "Custom Status" ? " " : user.presence.game.state)
    .addField("Bot?", user.bot, true)
    .setThumbnail(user.avatarURL)
    .addField("Created At:", `${moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
    .setFooter(`ID: ${user.id}`)
    try {
      e.addField("Status:", `${user.presence.status}`, true)
		  e.addField("Game:", `${user.presence.game && !user.presence.game.name == "Custom Status"? user.presence.game.name : 'None'}`, true)
      e.addField("Joined", `${moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
      e.addField("Roles", member.roles.map(roles => `${roles.name}`).join(', '), true)
    } catch {}
    return message.channel.send(e)
  }
}