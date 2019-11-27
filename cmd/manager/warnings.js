const {RichEmbed} = require("discord.js")

module.exports = {
  name: "warnings",
  aliases: ["viewwarnings", "view-warnings"],
  permission: ["MANAGER_GUILD"],
  module: "manager",
  execute: (message, args) => {
    let user = message.mentions.users.first()
    if(!user) {
      user = message.guild.members.find(m => m.username == args.join(' ') || m.id == args[0] || m.tag == args.join(' '))
      if(!user) return message.channel.send("That user is not found")
    }
    let ca = message.client.warn.get(message.guild.id)
    if(!ca) return message.channel.send("There's no case using this bot")
    let a = ca.filter(m => m.userid == user.id)
    if(a.length < 1 ) return message.channel.send("That user has no warnings :3")
    const e = new RichEmbed()
    .setAuthor(user.tag, user.avatarURL)
    .setDescription(a.map(m => `\`Case: ${m.case}\`  - **${m.action}** - ${m.reason.length < 1 ? "No Reason" : m.reason}`).join('\n'))
    message.channel.send(e)
  }
}