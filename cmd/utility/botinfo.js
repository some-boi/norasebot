const discord = require("discord.js")
const version = require('project-version');
module.exports = {
    name: "botinfo",
    aliases: ['bot-info'],
    cooldown: 4,
    module: "utility",
    execute: async (message, args) => {
		
        let totalSeconds = (message.client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.round(totalSeconds % 60);
        let stat = `\nGuild: ${message.client.guilds.size}\nUsers: ${message.client.users.size}\nChannels: ${message.client.channels.size}`
        let em = new discord.RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .addField ("Name", message.client.user.username, true)
        .addField ("Created at", message.client.user.createdAt, true)
        .addField("Library", `discord.js v${discord.version}`, true)
        .addField("Stats", stat, true)
        .addField("Bot Version", `v${version}`, true)
		.addField("Uptime", `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`, true)
        .setThumbnail(message.client.user.avatarURL)
        .setColor("#744357")
        .setFooter(`Created by ${ message.client.users.get('390540063609454593').tag}`)
        message.channel.send(em)
    }
}