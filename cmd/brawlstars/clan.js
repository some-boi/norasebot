const BrawlStars = require("brawlstars");
const client = new BrawlStars.Client({ token: process.env.BSECRET });
const { RichEmbed } = require("discord.js");

module.exports = {
  name: "clan",
  module: "brawlstars",
  aliases: ["club"],
  usage: "<tag>",
  execute: async (message, args) => {
    let option = args[0];
    if (!option) {
      if (!message.client.db.get(message.author.id)) {
        return message.reply("Input the clan's tag");
      } else {
        const get = message.client.db.get(message.author.id).toString();
        const m = await client.getPlayer(get);
        option = !m.club.tag ? null : m.club.tag
      }

      try {
        const search = await client.getClub(option);
        let bestmember = search.members.sort((x, y) => y.trophies - x.trophies);
        let e = new RichEmbed()
          .setAuthor(message.author.username, message.author.avatarURL)
          .setTitle(`#${search.tag}`)
          .setDescription(search.description)
          .setThumbnail(search.badgeUrl)
          .addField("Name", search.name, true)
          .addField("Status", search.status, true)
          .addField("Region", search.region, true)
          .addField("Trophies", search.trophies, true)
          .addField(
            `Members (Online ${search.onlineMembers}/${search.members.length})`,
            `Best member:\n${bestmember[0].name} - Trophies ${bestmember[0].trophies}`,
            true
          );
        return message.channel.send(e);
      } catch {
        return message.reply("I cannot find a clan or invalid tag");
      }
    }
  }
};
