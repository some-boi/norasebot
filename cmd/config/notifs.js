const {RichEmbed} = require("discord.js")

module.exports = {
  name: "notify",
  aliases: ["logging"],
  permission: ["MANAGE_GUILD"],
  usage: "<number> <channel's name or ID>",
  description: "List of params\nName   |   Description   |   Usage (toggle)\n\n**Ban & kick** - The bot will announce when the member got banned\kicked | `;notify 1 <channel's name or ID>`\n**Mod logging** - The bot will announce when the new case was arrived | `;notify 2 <channel's name or ID>`\n**Basic Logs** - Looks like audit log | `;notify 3 <channel's name or ID>`\n**All of them** - All logs in one channel | `;notify 4 <channel's name or ID>`\n\n`show` - Show the current logging\n`delete` - Reset all loggings in this server",
   module: "config",
  execute: (message, args) => {
    let type = args[0]
    let value = args[1]
    const toName = {
      1: "Ban & Kick",
      2: "Mod Logging",
      3: "Basic Logs",
      4: "All of them"
    }
    if(!type) {
      return message.channel.send("Please use `;help notify` for more information")
    } else if(type == 1 || type == 2 || type == 3 || type == 4) {
      if(!value) return message.channel.send("You forgot to input the channel's name or ID")
      let ch = message.guild.channels.find(m => m.id == value || m.name == value)
      if(!ch) return message.channel.send("That channel is not found or invalid")
      message.client.mod.push(`log_${message.guild.id}`, {type: type, channel: ch.id})
      return message.channel.send(`Logging will announce in <#${ch.id}>`)
    } else if( type == "show") {
      if(!message.client.mod.has(`log_${message.guild.id}`)) return message.channel.send("This guild's logging is emply")
      let ar = message.client.mod.get(`log_${message.guild.id}`)
        let e = new RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setDescription(ar.map(m => `**${toName[m.type]}** - <#${m.channel}>`).join('\n'))
        return message.channel.send(e)
    } else if (type == "remove" || type == "delete") {
      if(!message.client.mod.has(`log_${message.guild.id}`)) return message.channel.send("That logging was removed")
      message.client.mod.delete(`log_${message.guild.id}`)
      return message.channel.send("This guild's logging was removed, but you can use `;notify <any types>` to enable")
    }
    else {
      return message.channel.send("Please use `;help notify` for more information")
    }
  }
}