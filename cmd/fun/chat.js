const api = require("some-random-api")

module.exports = {
  name: "chat",
  aliases: ["chatbot", "chat-bot"],
  usage: "<say to bot!>",
  cooldown: 2,
  module: "fun",
  execute: async (message, args) => {
      message.channel.startTyping();
    try {
    let bruh = await api.chat(args.join(' '))
        message.channel.send(bruh).catch(e => message.channel.send("It looks like our API did an oppsie, please try again"))
    } catch { return message.channel.send("It looks like our API did an oppsie, please try again")}
      message.channel.stopTyping();
      return
  }
}