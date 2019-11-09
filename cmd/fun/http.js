
const { Attachment } = require("discord.js")
module.exports = {
  name: "http",
  aliases: ["http-cat", "httpcat"],
  usage: "<code>",
  cooldown: 3,
  module: "fun",
  description: "Send with HTTP codes",
  execute: (message, args) => {
    let arg = args[0]
    if (!arg || arg.length !== 3 || arg.isNaN()) arg = 404
    message.channel.send(new Attachment(`https://http.cat/${arg}.jpg`, "http.jpg"))
  }
}