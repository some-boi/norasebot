const {RichEmbed} = require("discord.js")
module.exports = {
  name: "massmention",
  aliases: ["massping", "massmentions"],
  description: "When someone pings too many people in a message, the bot will trigger\n\n`enable` - Enable this module\n`disable` - Disable this module\n`action <delete/warn/mute/kick/ban>` - Set action\n`count <number>` - Set count pings\n`ignore <channel's name or ID>` - Add an ignore channel\n `unignore <channel's name or ID>` - Remove an ignore channel",
  permission: ["MANAGE_GUILD", "KICK_MEMBERS"],
  module: "automod",
  cooldown: 3,
  execute: (message, args) => {
    let type = args[0]
    let value = args[1]
    let mass = message.client.mod.get(`ping_${message.guild.id}`)
    if(!type) {
      if(!mass) return message.channel.send("This guild's mass mention is disabled")
      let e = new RichEmbed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setTitle(`${message.guild.name}'s mass mention system'`)
      .addField("Action", mass.action)
      .addField("Pings count that will trigger", mass.count)
      if(mass.ignore) e.addField("Ignore channels", !mass.ignore.length < 1 ? mass.ignore.map(m => `<#${m}>`).join(', ') : "No ignore channels")
      message.channel.send(e)
    } else if(type == "count") {
      if(!value) return message.reply("please use `;massmention count <number>`")
      if(isNaN(value)) return message.channel.send("Only real number is valid")
      if(parseInt(value) < 3) return message.reply("Under than 3 is too low")
      message.client.mod.set(`ping_${message.guild.id}.count`, value)
      return message.channel.send(`Set the count to ${value}!`)
  } else if (type == "action") {
      if (!value)
        return message.channel.send(
          "Please use `;swear action <delete/mute/kick/ban>`"
        );
      else {
        if (
          value == "mute" ||
          value == "kick" ||
          value == "ban" ||
          value == "delete"  || value == "warn"
        ) {
          message.client.mod.set(`ping_${message.guild.id}.action`, value);
          message.channel.send("Set!");
          return;
        } else {
          return message.channel.send(
            "Please use `;massmention action <delete/warn/mute/kick/ban>`"
          );
        }
      }
    } else if (type == "disable") {
      if (!mass)
        return message.channel.send(
          "This module has already disabled. If you want to enable it, use `;massmention enable`"
        );
      else {
        message.client.mod.delete(`ping_${message.guild.id}`);
        return message.channel.send("This module has been disabled!");
      }
    } else if (type == "enable") {
      if (mass)
        return message.channel.send(
          "This module has already enabled. If you want to disable it, use `;massmention disable`"
        );
      else {
        message.client.mod.set(`ping_${message.guild.id}.action`, "mute");
        message.client.mod.set(`ping_${message.guild.id}.count`, 5);
        return message.channel.send(
          "This module has been enabled, but the action and counter is set to default (`mute` and `5`)!"
        );
      }
    } else if (type == "ignore") {
      if (!value)
        return message.channel.send(
          "Please use `;massmention ignore <channel's name or ID>`"
        );
      else {
        let a = message.guild.channels.find(
          m => m.name == value || m.id == value
        );
        if (!a) return message.channel.send("Ops, I cannot find a channel!");
        else {
          message.client.mod.push(`ping_${message.guild.id}.ignore`, a.id);
          return message.channel.send("Added a channel!");
        }
      }
    } else if (type == "unignore") {
      if (!value)
        return message.channel.send(
          "Please use `;massmention ignore <channel's name or ID>`"
        );
      else {
        let a = message.guild.channels.find(
          m => m.name == value || m.id == value
        );
        if (!a) return message.channel.send("Ops, I cannot find a channel!");
        else {
          let n = mass.ignore.find(m => m == a.id);
          if (!n)
            return message.channel.send("That channel is already removed");
          message.client.mod.set(
            `ping_${message.guild.id}.ignore`,
            !mass.ignore.length == 1
              ? mass.ignore.splice(mass.ignore.indexOf(a.id), 1)
              : []
          );
          return message.channel.send("Removed a channel!");
        }
      }
    }
  }
}