const { RichEmbed } = require("discord.js");
module.exports = {
  name: "badword",
  aliases: ["badwords", "swears", "bad-word", "bad-words", "swear"],
  permission: ["MANAGE_GUILD", "BAN_MEMBERS", "KICK_MEMBERS"],
  module: "automod",
  usage: "<type> <value>",
  description: "When someone swears in the chat, the bot will trigger\n\n`action <delete/warn/mute/kick/ban>` - Set action\n`default` - Toggle default swears (view using `;swear show` for list default swears)\n`add <swear>` Add to blacklist words\n`remove <swear>` - Remove from blacklist words\n`enable` - Enable this guild's module\n`disable` - Disable this guild's module\n`ignore <channel's name or ID>` - Add a ignore channel\n`unignore <channel's name or ID>` - Remove ignore channel\n`show` - List of default swears",
  execute: (message, args) => {
    let type = args[0];
    let value = args[1];
    let swear = message.client.mod.get(`swear_${message.guild.id}`);
    if (!type) {
      if (!swear)
        return message.channel.send(
          "This guild's antiswear module is disabled"
        );
      let e = new RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle(`${message.guild.name}'s anti-swear`)
        .addField("Is default swears enabled?", swear.default ? "Yes" : "No")
      .addField("Action", swear.action)
      if (swear.swears) {
        e.addField(
          "Custom swears", !swear.swears.length < 1 ?
          swear.swears.map(m => `\`${m}\``).join(", ") : "No custom swears"
        );
      }
      if (swear.ignore) {
        e.addField(
          "Ignore channels",
          !swear.ignore.length < 1
            ? swear.ignore.map(m => `<#${m}>`).join(", ")
            : "No channel"
        );
      }
      message.channel.send(e);
    } else if (type == "action") {
      if (!value)
        return message.channel.send(
          "Please use `;swear action <delete/warn/mute/kick/ban>`"
        );
      else {
        if (
          value == "mute" ||
          value == "kick" ||
          value == "ban" ||
          value == "delete"  || value == "warn"
        ) {
          message.client.mod.set(`swear_${message.guild.id}.action`, value);
          message.channel.send("Set!");
          return;
        } else {
          return message.channel.send(
            "Please use `;swear action <delete/warn/mute/kick/ban>`"
          );
        }
      }
    } else if (type == "disable") {
      if (!swear)
        return message.channel.send(
          "This module has already disabled. If you want to enable it, use `;swear enable`"
        );
      else {
        message.client.mod.delete(`swear_${message.guild.id}`);
        return message.channel.send("This module has been disabled!");
      }
    } else if (type == "enable") {
      if (swear)
        return message.channel.send(
          "This module has already enabled. If you want to disable it, use `;swear disable`"
        );
      else {
        message.client.mod.set(`swear_${message.guild.id}.action`, "delete");
        message.client.mod.set(`swear_${message.guild.id}.default`, true);
        return message.channel.send(
          "This module has been enabled, but the action and default swears is set to default (`delete`)!"
        );
      }
    } else if (type == "ignore") {
      if (!value)
        return message.channel.send(
          "Please use `;swear ignore <channel's name or ID>`"
        );
      else {
        let a = message.guild.channels.find(
          m => m.name == value || m.id == value
        );
        if (!a) return message.channel.send("Ops, I cannot find a channel!");
        else {
          message.client.mod.push(`swear_${message.guild.id}.ignore`, a.id);
          return message.channel.send("Added a channel!");
        }
      }
    } else if (type == "unignore") {
      if (!value)
        return message.channel.send(
          "Please use `;swear ignore <channel's name or ID>`"
        );
      else {
        let a = message.guild.channels.find(
          m => m.name == value || m.id == value
        );
        if (!a) return message.channel.send("Ops, I cannot find a channel!");
        else {
          let n = swear.ignore.find(m => m == a.id);
          if (!n)
            return message.channel.send("That channel is already removed");
          message.client.mod.set(
            `swear_${message.guild.id}.ignore`,
            !swear.ignore.length == 1
              ? swear.ignore.splice(swear.ignore.indexOf(a.id), 1)
              : []
          );
          return message.channel.send("Removed a channel!");
        }
      }
    } else if (type == "default") {
      if (!swear.default) {
        message.client.mod.set(`swear_${message.guild.id}.default`, true);
        return message.channel.send("Default swears is enabled!");
      } else {
        message.client.mod.set(`swear_${message.guild.id}.default`, false);
        return message.channel.send("Default swears is disabled!");
      }
    } else if (type == "add") {
      if (!value)
        return message.channel.send("Please use `;swear add <swear>`");
      if (swear.swears) {
        if (!swear.swears.find(m => m == value)) {
          message.client.mod.push(`swear_${message.guild.id}.swears`, value);
          return message.channel.send("Added!");
        } else {
          return message.channel.send(
            "It looks like that swear is already added!"
          );
        }
      } else {
                  message.client.mod.push(`swear_${message.guild.id}.swears`, value);
          return message.channel.send("Added!");
      }
    } else if (type == "remove") {
      if (!value)
        return message.channel.send("Please use `;swear remove <swear>`");
      if(!swear.swears || swear.swears.length < 1) return message.channel.send("All custom swears is removed")
      if (swear.swears.find(m => m == value)) {
        message.client.mod.set(
          `swear_${message.guild.id}.swears`,
          !swear.swears.length == 1
            ? swear.swears.splice(swear.swears.indexOf(value), 1)
            : []
        );
        return message.channel.send("Added!");
      } else {
        return message.channel.send(
          "It looks like that swear is already removed!"
        );
      }
    } else if(type == "show") {
      let show = require("./../../swears.json")
      const e = new RichEmbed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setDescription(show.swears.join(', '))
      return message.channel.send(e)
    }
  }
};
