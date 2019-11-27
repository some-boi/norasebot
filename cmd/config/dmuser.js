module.exports = {
  name: "dmuser",
  aliases: ["userdm", "dm-user"],
   module: "config",
  description:
    "Toggle DM a user after the bot triggers like MEE6\n\n`enable` - Enable DM user to all automods\n`disable` - Disable DM user to all automods",
  permission: ["MANAGE_GUILD"],
  execute: (message, args) => {
    let type = args[0];
    if (type == "enable") {
      if (message.client.mod.has(`spam_${message.guild.id}`)) message.client.mod.set(`spam_${message.guild.id}.dm`, true);
      if (message.client.mod.has(`invite_${message.guild.id}`)) message.client.mod.set(`invite_${message.guild.id}.dm`, true);
      if (message.client.mod.has(`caps_${message.guild.id}`)) message.client.mod.set(`caps_${message.guild.id}.dm`, true);
      if (message.client.mod.has(`swear_${message.guild.id}`)) message.client.mod.set(`swear_${message.guild.id}.dm`, true);
      if (message.client.mod.has(`ping_${message.guild.id}`)) message.client.mod.set(`ping_${message.guild.id}.dm`, true);
      return message.channel.send("Enabled!")
    } else if(type == "disable") {
      if (message.client.mod.has(`spam_${message.guild.id}`)) message.client.mod.set(`spam_${message.guild.id}.dm`, false);
      if (message.client.mod.has(`invite_${message.guild.id}`)) message.client.mod.set(`invite_${message.guild.id}.dm`, false);
      if (message.client.mod.has(`caps_${message.guild.id}`)) message.client.mod.set(`caps_${message.guild.id}.dm`, false);
      if (message.client.mod.has(`swear_${message.guild.id}`)) message.client.mod.set(`swear_${message.guild.id}.dm`, false);
      if (message.client.mod.has(`ping_${message.guild.id}`)) message.client.mod.set(`ping_${message.guild.id}.dm`, false);
      return message.channel.send("Disabled!")
    }
  }
};
