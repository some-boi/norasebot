module.exports = {
  name: "invite",
  aliases: [],
  module: "utility",
  execute: (message, args) => {
    message.channel.send("**This bot is in BETA, so you can invite this bot before released**\nhttps://discordapp.com/oauth2/authorize?client_id=637326132261158945&permissions=21137932718&scope=bot")
   }
  
}