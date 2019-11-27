module.exports = {
  name: "slowmode",
  aliases: ["cooldown", "setslowmode", "set-slowmode", "set-cooldown", "setcooldown"],
  permission: ["MANAGE_CHANNELS"],
  usage: "<number> <reason>",
  module: "manager",
  execute: (message, args) => {
    let nu = args[0]
    let reason = args[1]
    if(!reason) reason = ""
    if(nu == "off") nu = 0
    message.channel.setRateLimitPerUser(nu, reason)
    message.channel.send(nu < 1 ? "Removed a cooldown!" : "Set a cooldown!")
  }
}