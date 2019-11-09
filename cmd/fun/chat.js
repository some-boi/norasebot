const api = require("some-random-api")

module.exports = {
  name: "chat",
  aliases: ["chatbot", "chat-bot"],
  usage: "<say to bot!>",
  cooldown: 2,
  module: "fun",
  execute: async (message, args) => {
      message.channel.startTyping();
    let bruh = await api.chat(args.join(' '))
    message.channel.send(bruh)
      message.channel.stopTyping();
      return
  }
}