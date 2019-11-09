module.exports = {
    name: "status",
    aliases: ["setstatus"], module: "admin",
  description: "the pro shit that can help make codes :p",
    usage: "<code>",
    ownerOnly: true,
    execute: (message, args) => {
      const name = args.join(" ")
      message.client.user.setActivity(name)
      message.channel.send("changed my status to " + name)
    }
}