const { sendCase } = require("./../../_case.js");

module.exports = {
  name: "ban",
  usage: "<member's name or ID or mention>",
  permission: ["BAN_MEMBERS"],
  module: "moderator",
  execute: (message, args) => {
    let reason = args.slice(1);
    let user = message.mentions.members.first();
    if (user) {
      if (user.hasPermission("ADMINISTRATOR") ||
          user.id == message.author.id ||
          user.id == message.client.user.id)
        return message.channel.send(
          "I don't ban that user"
        );
      message.guild.ban(user, {
        reason: !reason
          ? `by ${message.author.tag}`
          : `by ${message.author.tag}\n${reason.join(" ")}`
      });
      let te = {
        case: message.client.warn.has(message.guild.id)
          ? message.client.warn
              .get(message.guild.id)
              .sort((a, b) => b.case - a.case)[0].case + 1
          : 1,
        userid: user.id,
        user: user.tag,
        action: "ban",
        mod: message.author.id,
        reason: reason.join(" ")
      };
      message.client.warn.push(message.guild.id, te);
      sendCase(message);
      return message.channel.send(
        `\`Case: ${te.case}\` ${user.tag} (${
          user.id
        }) has been banned from this guild!\nReason: **${
          !reason ? `No reason` : `${reason.join(" ")}`
        }**`
      );
    } else {
      user = message.guild.members.find(
        m => m.user.username == args[0] || m.user.id == args[0]
      );
      if (!user) {
        user = message.client.fetchUser(args[0])
        console.log(user)
        if (!user || user.length < 1) return message.channel.send("I cannot find that user!");
        message.guild.ban(user.id, {
          reason: !reason
            ? `by ${message.author.tag}`
            : `by ${message.author.tag}\n${reason.join(" ")}`
        });
        let te = {
          case: (message.client.warn.has(message.guild.id) && !message.client.warn
                .get(message.guild.id).length < 1)
            ? message.client.warn
                .get(message.guild.id)
                .sort((a, b) => b.case - a.case)[0].case + 1
            : 1,
          user: user.tag,
          userid: user.id,
          action: "warn",
          mod: message.author.id,
          reason: reason.join(" ")
        };
        message.client.warn.push(message.guild.id, te);
        sendCase(message);
        return message.channel.send(
          `\`Case: ${te.case}\` ${user.tag} (${
            user.id
          }) has been banned from this guild!\nReason: **${
            !reason ? `No reason` : `${reason.join(" ")}`
          }**`
        );
      } else {
        if (
          user.hasPermission("ADMINISTRATOR") ||
          user.id == message.author.id ||
          user.id == message.client.user.id
        )
          return message.channel.send("I don't ban that user");
        message.guild.ban(user.id, {
          reason: !reason
            ? `by ${message.author.tag}`
            : `by ${message.author.tag}\n${reason.join(" ")}`
        });
        let te = {
          case: message.client.warn.has(message.guild.id)
            ? message.client.warn
                .get(message.guild.id)
                .sort((a, b) => b.case - a.case)[0].case + 1
            : 1,
          user: user.user.tag,
          userid: user.id,
          action: "ban",
          mod: message.author.id,
          reason: reason.join(" ")
        };
        message.client.warn.push(message.guild.id, te);
        sendCase(message)
        return message.channel.send(
          `\`Case: ${te.case}\` ${user.user.tag} (${
            user.id
          }) has been banned from this guild!\nReason: **${
            !reason ? `No reason` : `${reason.join(" ")}`
          }**`
        );
      }
    }
  }
};
