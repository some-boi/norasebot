module.exports = {
  name: "botignore",
  aliases: ["ignorebot", "ignore-bot", "bot-ignore"],
  usage: "",
  module: "config",
  cooldown: 2,
  permission: ["MANAGE_GUILD"],
  description: "Ignore welcome/goodbye/autorole system when the bot joined",
  execute: (message, args) => {
    if (
      !message.client.db1.get(`${message.guild.id}.ignorebot`) &&
      !message.client.db2.get(`${message.guild.id}.ignorebot`)
    ) {
      message.client.db1.set(`${message.guild.id}.ignorebot`, true)
      message.client.db2.set(`${message.guild.id}.ignorebot`, true)
      return message.channel.send("I will ignore announce when the bot joined/left")
    } else {
      message.client.db1.set(`${message.guild.id}.ignorebot`, false)
      message.client.db2.set(`${message.guild.id}.ignorebot`, false)
      return message.channel.send("I will **UN**ignore announce when the bot joined/left")
    }
  }
};
