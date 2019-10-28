module.exports = {
    name: "ping",
    description: "Pong!",
    aliases: [],
    guildOnly: false,
    usage: "",
    module: "utility",
    cooldown: 1,
    execute: (message, args) => {
        message.channel.send ("Pong!")
    }
}