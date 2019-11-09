const { RichEmbed } = require("discord.js");
module.exports = {
  
  name: "goodbye",
  aliases: ["leave"],
  usage: "<types> <value>",
  cooldown: 2, 
  permission: ["MANAGE_GUILD"],
  description:
    "`message` - Set message on leave\n`channel` - Set goodbye channel\n`delete` - Delete goodbye system from database\n`show` - Show goodbye system\n\nTAGS:\n{member} - Member's name and tag\n{server} - Server's name\n{servercount} / {membercount} - Server's member count",
  module: "announce",
  execute: (message, args) => {
    const [types, ...restArgs] = args;
    let value = restArgs.join(" ");
    if (!types) {
      return message.channel.send("Use `;help goodbye` for more information.");
    } else if (types == "message") {
      if (!value) {
        return message.channel.send("Value is a require");
      }
      if (!message.client.db2.has(message.guild.id)) {
        message.client.db2.set(`${message.guild.id}`, { message: value , id: message.guild.id});
        return message.channel.send(
          "Message set! but you must use `;goodbye channel <channel>` to working on leave."
        );
      } else {
        message.client.db2.set(`${message.guild.id}.message`, value);
        return message.channel.send("Message set!");
      }
    } else if (types == "channel") {
      if (!value) {
        return message.channel.send("Value is a require");
      }
      let channel1 = args[1];
      let channel = message.guild.channels.find(
        m => m.name == channel1 || m.id == channel1
      );
      if (!channel) return message.channel.send("I cannot find a channel.");
      if (!message.client.db2.has(message.guild.id)) {
        message.client.db2.set(message.guild.id, {
          channel: channel.id , id: message.guild.id
        });
        return message.channel.send(
          "Channel set! But you must use `;goodbye message <msgs>` to working on goodbye channel"
        );
      } else {
        message.client.db2.set(`${message.guild.id}.channel`, channel.id);
        return message.channel.send("Channel set!");
      }
    } else if (types == "delete") {
      if (!message.client.db2.has(message.guild.id)) {
        return message.channel.send("Already deleted!");
      } else {
        message.client.db2.delete(message.guild.id);
        return message.channel.send("Deleted!");
      }
    } else if (types == "show") {
      if (!message.client.db2.has(message.guild.id)) {
        return message.channel.send(
          "Welcome system isn't setup in this server"
        );
      }
      let e = new RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle("Goodbye system")
        .setThumbnail(message.guild.iconURL);
      e.addField(
        "Message",
        message.client.db2.get(`${message.guild.id}.message`),
        true
      );
      e.addField(
        "Channel",
        `<#${message.client.db2.get(`${message.guild.id}.channel`)}>`,
        true
      );
            e.addField(
      "Ignore bots", message.client.db2.get(`${message.guild.id}.ignorebot`), true
      )
      return message.channel.send(e);
    }
  }
};
