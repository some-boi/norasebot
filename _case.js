const { RichEmbed } = require("discord.js");

module.exports.sendCase = message => {
  if (!message.client.mod.has(`log_${message.guild.id}`)) return;
  let e = message.client.mod
    .get(`log_${message.guild.id}`)
    .filter(m => m.type == 2 || m.type == 4);
  let o = message.client.warn
    .get(message.guild.id)
    .sort((a, b) => b.case - a.case)[0];
  for (const p of e) {
    const u = new RichEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL)
      .setTitle(`Case: ${o.case}   ${o.user} (${o.userid})`)
      .setColor("25c059")
      .addField("Action", o.action)
      .addField(
        "Moderator",
        !message.guild.members.get(o.mod).user.tag
          ? `A mod has left (ID: ${o.mod})`
          : message.guild.members.get(o.mod).user.tag
      )
      .addField("Reason", o.reason.length < 1 ? "No reason" : o.reason);
    message.guild.channels.find(m => m.id == p.channel).send(u);
  }
};
