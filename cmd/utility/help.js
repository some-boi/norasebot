const discord = require("discord.js")
const fs = require('fs')
module.exports = {
    name: "help",
    aliases: ['h'],
    description: "Shows list of commands",
    usage: "",
    module: "utility",
    cooldown: 3,
    execute: (message, args) => {
        let bruh = args[0]
        if(bruh) {
            
            var cmmd = message.client.commands.find(m => m.name == bruh && !m.ownerOnly)
            if(!cmmd){
                return message.reply("No command found")
            }
            let e1 = new discord.RichEmbed()
            .setTitle(`${cmmd.name}`)
            .setDescription(!cmmd.description ? "No description found" : cmmd.description)
            .addField("Usage", !cmmd.usage ? `;${cmmd.name}` : `;${cmmd.name} ${cmmd.usage}`)
            .addField("Aliases", !cmmd.aliases || cmmd.aliases.lenght < 1 ? "No aliases" : cmmd.aliases.join(", "), true)
            .addField("Cooldown", !cmmd.cooldown ? "3 seconds" : `${cmmd.cooldown} seconds`, true)
            .addField("Permission requirement", !cmmd.permission ? "No requirements" : cmmd.permission.join(", "),true)
            .addField("Hidden?", !cmmd.hidden ? "No hidden" : "Yes",true)
          return message.channel.send(e1)
        }
        const modules = fs.readdirSync(`./cmd/`).filter(file => !file.startsWith("_"))
        const e = new discord.RichEmbed()
        .setTitle(`Avaliable commands (${message.client.commands.size} commands)`)
        .setThumbnail(message.client.user.avatarURL)
        for (const module1 of modules){
            if(module1 == "admin" || module1 == "music") continue
          try{
            let kek = message.client.commands.filter(m => m.module == module1).map(m => `\`${m.name}\``).join(", ")
            e.addField(module1 == "config" ? "SERVER CONFIG" : module1.toUpperCase(), kek)
          } catch {}
        }
        return message.channel.send(e)
    }
}