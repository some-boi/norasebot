const fetch = require("node-fetch");
const { RichEmbed } = require("discord.js");
module.exports = {
  name: "pokemon",
  aliases: ["pokedex"],
  usage: "<pokemon's name>",
  cooldown: 5,
    module: "search",
  execute: async (message, args) => {
    const arg = args.join(" ");
    if (!arg) return message.channel.send("Use `;pokemon <pokemon's name>`");
    const e = await fetch(`https://pokeapi.co/api/v2/pokemon/${arg}`);
    try {
      const j = await e.json();
      const em = new RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle(
          `${j.name.charAt(0).toUpperCase() + j.name.slice(1)} (ID: ${j.id})`
        )
        .addField(
          `Abilities ${j.abilities.length}`,
          j.abilities.map(m => m.ability.name).join(", "),
          true
        )
        .addField("Specie", j.species.name, true)
        .addField("Types", j.types.map(m => m.type.name).join(", "), true)
        .setThumbnail(j.sprites.front_default)
        .addField(
          `Moves ${j.moves.length}`,
          j.moves
            .slice(0, 10)
            .map(
              m => m.move.name.charAt(0).toUpperCase() + m.move.name.slice(1)
            )
            .join(", "),
          true
        )
        .addField("Height", j.height, true)
        .addField("Weight", j.weight, true)
        .addField(
          "Stats",
          j.stats.map(m => `${m.stat.name} [${m.base_stat}]`).join("\n"),
          true
        )
        .addField("Base experience", j.base_experience, true);
      message.channel.send(em);
    } catch {
      return message.channel.send(
        "it looks like your result is not found or invalid"
      );
    }
  }
};
