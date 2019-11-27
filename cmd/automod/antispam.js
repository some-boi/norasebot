const { RichEmbed} = require("discord.js")

module.exports = {
  name: "antispam",
  aliases: ["spam", "anti-spam", "nospam"],
  cooldown: 2,
  description: "The bot will trigger when someone repeating same messages in a row or spamming in the chat\nWhen spamming 5 messages in last 3 seconds, it counts as spam\nWhen repeating 5 same messages in a row, it counts as spam\n\n`enable` - Enable this module\n`disable` - Disable this module\n`action <delete/mute/kick/ban>` - Set action\n`ignore <channel's name or ID>` - Add an ignore channel\n`unignore <channel's name or ID>` - Remove an ignore channel",
  permission: ["MANAGE_GUILD"],
  module: "automod",
  execute: (message, args) => {
    let type = args[0]
    let value = args[1]
    let spam = message.client.mod.has(`spam_${message.guild.id}`)
    if(!type) {
      if(!spam) return message.channel.send("This guild's anti spam is disabled")
      let e = new RichEmbed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setTitle(`${message.guild.name}'s antispam'`)
      .addField("Action", message.client.mod.get(`spam_${message.guild.id}.action`))
      if(spam.ignore) e.addField("Ignore channels", !spam.ignore.length < 1 ? spam.ignore.map(m => `<#${m}>`).join(', ') : "No channel")
      return message.channel.send(e)
    } else if(type == "action") {
      if(!value) return message.channel.send("Please use `;antispam action <delete/warn/mute/kick/ban>`")
      else {
        if(value == "mute" || value == "kick" || value == "ban" || value == "delete" || value == "warn") {
          message.client.mod.set(`spam_${message.guild.id}.action`, value)
          message.channel.send("Set!")
          return
        } else {
          return message.channel.send("Please use `;antispam action <delete/mute/kick/ban>`")
        }
      }
    } else if(type == "ignore") {
      if(!value) return message.channel.send("Please use `;antispam ignore <channel's name or ID>`")
      else {
        let a = message.guild.channels.find(m => m.name == value || m.id == value)
        if(!a) return message.channel.send("Ops, I cannot find a channel!")
        else{
          message.client.mod.push(`spam_${message.guild.id}.ignore`, a.id)
          return message.channel.send("Added a channel!")
        }
      }
    } else if (type == "unignore") {
      if(!value) return message.channel.send("Please use `;antispam ignore <channel's name or ID>`")
      else {
        let a = message.guild.channels.find(m => m.name == value|| m.id == value)
        if(!a) return message.channel.send("Ops, I cannot find a channel!")
        else{
          let n = spam.ignore.find(m => m == a.id)
          if(!n) return message.channel.send("That channel is already removed")
          message.client.mod.set(`spam_${message.guild.id}.ignore`, !spam.ignore.length == 1 ? spam.ignore.splice(spam.ignore.indexOf(a.id) ,1 ) : [])
          return message.channel.send("Removed a channel!")
        }
      }
    } else if(type == "disable") {
      if(!spam) return message.channel.send("This module has already disabled. If you want to enable it, use `;antispam enable`")
      else {
        message.client.mod.delete(`spam_${message.guild.id}`)
        return message.channel.send("This module has been disabled!")
      }
    }  else if(type == "enable") {
      if(spam) return message.channel.send("This module has already enabled. If you want to disable it, use `;antispam disable`")
      else {
        message.client.mod.set(`spam_${message.guild.id}.action`, "mute")
        return message.channel.send("This module has been enabled, but the action is set to default (`mute`)!")
      }
    }
  }
}