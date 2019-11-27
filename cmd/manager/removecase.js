const {RichEmbed} = require("discord.js")
module.exports = {
  name: "removecase",
  aliases: [
    "deletecase",
    "remove-case",
    "delete-case",
    "case-remove",
    "caseremove",
    "casedelete",
    "case-delete"
  ],
  module: "manager",
   permission: ["MANAGE_GUILD"],
  usage: "<number of case>",
  description: "Remove a case (useful when warned a wrong people or something)",
  execute: (message, args) => {
    let num = args[0];
    if (!num)
      return message.channel.send("Please use `;removecase <number of case>`");
    if (isNaN(num)) return message.channel.send("That isn't a number");
    let c = message.client.warn.get(message.guild.id);
    if (!c) return message.channel.send("There's no case using this bot");
    let fi = c.find(f => f.case == num);
    if (!fi) return message.channel.send("That case was removed or not found");
    const filter = answer => {
      return (
        answer.author.id == message.author.id
      );
    };
    let e = new RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
    .setTitle(`Case: ${fi.case}   ${fi.user} (${fi.userid})`)
    .setColor('25c059')
    .addField("Action", fi.action)
    .addField("Moderator", !message.guild.members.get(fi.mod).user.tag ? `A mod has left (ID: ${fi.mod})` : message.guild.members.get(fi.mod).user.tag )
    .addField("Reason", fi.reason.length < 1 ? "No reason" : fi.reason)

    message.channel.send("Are you sure if you want to delete this case? [yes/no]",  {embed: e}).then(
      message.channel
        .awaitMessages(filter, { max: 1, time: 10000, errors: ["time"] })
        .then(collected => {
          console.log(collected.map(m => m.content))
          if(collected.map(m => m.content).join(' ') == "yes") {
            c.splice(c.findIndex(f => f.case == num), 1)
          message.client.warn.set(message.guild.id, c)
          return message.channel.send(`\`Case: ${fi.case}\` deleted!`);
          }
          else {
            return message.channel.send("Ok, I won't remove that case")
          }
        }) .catch(collected => { console.log(collected); message.channel.send("Ok, I won't remove that case because you're inactive")})
    );
  }
};
