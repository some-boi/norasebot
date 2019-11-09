const discord = require("discord.js")

module.exports = {
    name: "botinfo",
    aliases: ['bot-info'],
    cooldown: 4,
    module: "utility",
    execute: (message, args) => {
		
        let totalSeconds = (message.client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.round(totalSeconds % 60);
        let stat = `\nGuild: ${message.client.guilds.size}\nUsers: ${message.client.users.size}\nChannels: ${message.client.channels.size}`
        let em = new discord.RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .addField ("Name", message.client.user.username)
        .addField ("Created at", message.client.user.createdAt)
        .addField("Library", "discord.js")
        .addField("Stats", stat)
		.addField("Uptime", `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`)
        .setThumbnail(message.client.user.avatarURL)
        .setColor("#744357")
        message.channel.send(em)
    }
}