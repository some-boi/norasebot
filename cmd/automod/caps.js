const { RichEmbed } = require("discord.js")

module.exports = {
  name: "caps",
  aliases: ["anticaps", "capsoff", "anti-caps"],
  description: "When the member sent TOO MUCH CAPS ON the bot will trigger (I dunno what % CAPS will trigger)\n\n`action <delete/warn/mute/kick>` - Set action\n`enable` - Enable this module\n`disable` - Disable this module\n`ignore <channel's name or ID>` - Add ignore channel\n`unignore <channel's name or ID` - Remove ignore channel",
  cooldown: 2,
  usage: "<type> <value>",
    module: "automod",
  permission: ["MANAGE_GUILD", "KICK_MEMBERS"],
  execute: (message, args) => {
    let [type, ...value1] = args
    if(value1) { 
      var value = value1.join(' ')
    }
   let caps = message.client.mod.get(`caps_${message.guild.id}`)
    if(!type ) {
      if(!caps) return message.channel.send("This guild's anti caps is disabled")
      const e = new RichEmbed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setTitle(`${message.guild.name}'s anti caps'`)
      .setThumbnail(message.guild.iconURL)
      .addField("Action", caps.action)
      if(caps.ignore) e.addField("Ignore channels", !caps.ignore.length < 1 ? caps.ignore.map(m => `<#${m}>`).join(', ') : "No ignore channels")
      message.channel.send(e)
    } else if (type == "action") {
            if(!value) return message.channel.send("Please use `;caps action <delete/mute/kick/ban>`")
      else {
        if(value == "mute" || value == "kick" || value == "delete" || value == "warn") {
          message.client.mod.set(`caps_${message.guild.id}.action`, value)
          message.channel.send("Set!")
          return
        } else {
          return message.channel.send("Please use `;caps action <delete/warn/mute/kick>`")
        }
      }
    } else if(type == "disable") {
      if(!caps) return message.channel.send("This module has already disabled. If you want to enable it, use `;caps enable`")
      else {
        message.client.mod.delete(`caps_${message.guild.id}`)
        return message.channel.send("This module has been disabled!")
      }
    }  else if(type == "enable") {
      if(caps) return message.channel.send("This module has already enabled. If you want to enable it, use `;caps disable`")
      else {
        message.client.mod.set(`caps_${message.guild.id}.action`, "kick")
        return message.channel.send("This module has been enabled, but the action has been set to default (`kick`)!")
      }
    } else if(type == "ignore") {
      if(!value) return message.channel.send("Please use `;caps ignore <channel's name or ID>`")
      else {
        let a = message.guild.channels.find(m => m.name == value || m.id == value)
        if(!a) return message.channel.send("Ops, I cannot find a channel!")
        else{
          message.client.mod.push(`caps_${message.guild.id}.ignore`, a.id)
          return message.channel.send("Added a channel!")
        }
      }
    } else if (type == "unignore") {
      if(!value) return message.channel.send("Please use `;caps ignore <channel's name or ID>`")
      else {
        let a = message.guild.channels.find(m => m.name == value|| m.id == value)
        if(!a) return message.channel.send("Ops, I cannot find a channel!")
        else{
          let n = caps.ignore.find(m => m == a.id)
          if(!n) return message.channel.send("That channel is already removed")
          message.client.mod.set(`caps_${message.guild.id}.ignore`, !caps.ignore.length == 1 ? caps.ignore.splice(caps.ignore.indexOf(a.id) ,1 ) : [])
          return message.channel.send("Removed a channel!")
        }
      }
    }
  }
}