const { RichEmbed } = require("discord.js")

module.exports = {
  name: "avatar",
  aliases: ['av'],
  module: "info",
  usage: "<member>",
  execute: (message,args) => {
    let user = message.mentions.users.first()
    if(!user) {
      user = message.client.users.find(m => m.id == args[0])
      if(!user) {
        user = message.author
      }
    }
    const e = new RichEmbed()
    .setAuthor(message.author.username, message.author.avatarURL)
    .setImage(user.avatarURL)
    message.channel.send(e)
  }
}