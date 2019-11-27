module.exports = {
    name: "name",
    aliases: ["setusername"], module: "admin",
  description: "the pro shit that can help make codes :p",
    usage: "<name>",
    ownerOnly: true,
  
  
  
    execute: (message, args) => {
      const name = args.join(" ")
      message.client.user.setUsername(name)
      message.channel.send("changed my name to " + name)
    }
}