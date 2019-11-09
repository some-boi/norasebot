const { RichEmbed } = require("discord.js");
module.exports = {
  name: "autorole",
  module: "announce",
  usage: "<types> <value>",
  description:
    "`add <role>` - Add a role to autorole system\n`remove <role>` - Remove a role from autorole system\n`delete` - Delete autorole system in this guild\n`show` - Show this guild's autorole system",
  cooldown: 2,
  ownerOnly: true,
  permission: ["MANAGE_GUILD"],
  execute: (message, args) => {
    const [type, ...value69] = args;
    const value = value69.join(" ");
    const a = message.client.db1.get(`${message.guild.id}.autorole`);
    if (!type) {
      if (!a)
        return message.channel.send("Autorole isn't setup in this server");
      let e = new RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle("Autorole system")
        .setThumbnail(message.guild.iconURL)
      try {
        e.addField(
          "Roles",
          a.map(m => `<@&${m}>`).join(", ")
        );
      } catch {
        e.description("It looks like Roles is emply")
      }
      message.channel.send(e);
    } else if (type == "add") {
      if (!a) {
        if (!value)
          return message.channel.send("Please use `;autorole add <role>`");
        let ye = message.guild.roles.find(m => m.name == value);
        if (!ye.id) return message.channel.send("I cannot find a role!");
              const no = a.find(m => m == ye.id)
      if(no) return message.channel.send("That role is already added!")
        message.client.db1.set(`${message.guild.id}.autorole`, [ye.id]);
        return message.channel.send(
          `${ye.name} has been added to autorole system!`
        );
      } else {
        if (!value)
          return message.channel.send("Please use `;autorole add <role>`");
        let ye = message.guild.roles.find(m => m.name == value);
        if (!ye.id) return message.channel.send("I cannot find a role!");
              const no = a.find(m => m == ye.id)
            
      if(no) return message.channel.send("That role is already added!")
        message.client.db1.push(`${message.guild.id}.autorole`, ye.id);
        return message.channel.send(
          `${ye.name} has been added to autorole system!`
        );
      }
    } else if (type == "remove") {
      if (!value)
        return message.channel.send("Please use `;autorole remove <role>`");
      if(!a) return message.channel.send("This guild's autorole is already deleted")
      const ye = message.guild.roles.find(m => m.name == value);
      const no = a.find(m => m == ye.id)
      if(!no) return message.channel.send("That role is already removed!")
      if (!ye.id) return message.channel.send("I cannot find a role!");
      message.client.db1.set(`${message.guild.id}.autorole`, !a.length == 1 ? a.splice(a.indexOf(ye.id) ,1 ) : []);
      return message.channel.send(`${ye.name} removed!`);

    } else if (type == "delete") {
      if (!a) return message.channel.send("Already deleted");
      message.client.db1.delete(`${message.guild.id}.autorole`);
      return message.channel.send("The guild's autorole has been deleted");
    }
  }
};
