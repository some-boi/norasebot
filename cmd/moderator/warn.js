const { sendCase } = require("./../../_case.js");

module.exports = {
  name: "warn",
  description: "Warn an user",
  module: "moderator",
  permission: ["MANAGE_MESSAGES"],
  execute: (message, args) => {
    let user = message.mentions.users.first();
    let [kek, ...reason] = args;
    if (!user) {
      user = message.guild.members.find(m => m.name == kek || m.id == kek);
      if (!user)
        return message.channel.send("It looks like I cannot find an user!");
    }
    let te = {
      case: message.client.warn.has(message.guild.id) && message.client.warn.get(message.guild.id).length >= 1
        ? message.client.warn
            .get(message.guild.id)
            .sort((a, b) => b.case - a.case)[0].case + 1
        : 1,
      userid: user.id,
      user: user.tag,
      action: "warn",
      mod: message.author.id,
      reason: reason.join(" ")
    }
    message.client.warn.push(message.guild.id, te);
    sendCase(message)
    return message.channel.send(
      `\`Case: ${te.case}\` **${user.tag}** has been warned! ***${reason.join(" ")}***`
    );
  }
};
