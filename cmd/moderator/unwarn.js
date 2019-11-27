module.exports = {
  name: "unwarn",
  permission: ["MANAGE_MESSAGES"],
  module: "moderator",
  description: "Remove all warnings from specific user",
  execute: (message, args) => {
    let user = message.mentions.users.first();
    if (!user) {
      user = message.guild.members.find(
        m => m.user.username == args.join[" "] || m.user.id == args[0]
      );
      if (!user) {
        return message.channel.send("That user is not found or invalid");
      }
    }
    let y = message.client.warn
      .get(message.guild.id)
      .find(
        m =>
          (m.userid == !user.id ? user.user.id : user.id) && m.action == "warn"
      );
    let x = message.client.warn.get(message.guild.id);
    if (!y) return message.channel.send("That user has no warnings");
    while (
      x.findIndex(
        e =>
          (e.userid == !user.id ? user.user.id : user.id) && e.action == "warn"
      ) >= 0
    ) {
      x.splice(
        x.findIndex(
          f =>
            (f.userid == !user.id ? user.user.id : user.id) &&
            f.action == "warn"
        ),
        1
      );
    }
    message.client.warn.set(message.guild.id, x);
    return message.channel.send(`${!user.user ? user.tag : user.user.tag} removed all of warnings!`)
  }
};
