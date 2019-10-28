module.exports = {
    name: "say",
    aliases: [],
    usage: "<whatever you want>",
    module: "fun",
    cooldown: 3,
    execute: (message, args) => {
        let say = args.join(" ")
        if(!say) return message.reply(`Use: ;say <whatever you want>`)
        let ye = message.mentions.channels.first()
        if(ye) {
            delete args[0]
            say = args.join(" ")
            message.client.channels.get(ye.id).send(say)
        } else {
            message.channel.send(say)
        }
    }
}