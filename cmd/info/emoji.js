const { Attachment } = require("discord.js");

module.exports = {
  name: "emoji",
  aliases: ["e"],
  usage: "<Discord Emote input>",
  module: "info",
  execute: (message, args) => {
    let arg = args[0];
    if(!arg.startsWith("<")) return message.channel.send("Only Discord Emojis can input")
    let animated = false;
    if (arg.startsWith("<a:")) {
      animated = true;
    }
    const a = arg.replace(animated ? "<a:" : "<:", "");
    let c = a.replace(">", "");
    let [name, id] = c.split(":");
    const url = `https://cdn.discordapp.com/emojis/${id}.${
      animated ? "gif" : "png"
    }`;
    message.channel.send(new Attachment(url));
  }
};
