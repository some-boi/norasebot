const { sendCase } = require("./../../_case.js");

module.exports = {
  name: "kick",
  description: "Kick an user",
  permission: ["KICK_MEMBERS"],
  module: "moderator",
  execute: (message, args) => {
    let user = message.mentions.users.first()
    if(!user) {
      user = message.guild.members.find(m => m.username == args[0] || m.id == args[0] || m.tag == args[0])
      if(!user) return message.channel.send("That user is not found")
    }
    let [ o , ...p] = args
         if (user.hasPermission("ADMINISTRATOR") ||
          user.id == message.author.id ||
          user.id == message.client.user.id)
        return message.channel.send(
          "I don't ban that user"
        );
        user.kick(!p ? `by ${message.author.tag}` : `by ${message.author.tag}\n${p.join(' ')}`)
              let te = {
      case: message.client.warn.has(message.guild.id)
        ? message.client.warn
            .get(message.guild.id)
            .sort((a, b) => b.case - a.case)[0].case + 1
        : 1,
            user: !user.tag ? user.user.tag : user.tag,
      userid: !user.id ? user.user.id : user.tag,
      action: "ban",
      mod: message.author.id,
      reason: p.join(" ")
    }
    message.client.warn.push(message.guild.id, te);
    sendCase(message)
    return message.channel.send(`\`Case: ${te.case}\` ${!user.tag ? user.user.tag : user.tag} (${!user.id ? user.user.id : user.id}) has been banned from this guild!\nReason: **${!p ? `No reason` : `${p.join(' ')}`}**`)
  }
}