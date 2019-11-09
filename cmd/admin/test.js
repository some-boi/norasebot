
const BrawlStars = require("brawlstars")
const client = new BrawlStars.Client({token: process.env.BSECRET})
const { RichEmbed } = require("discord.js")
module.exports = {
  name: "bitch",
  ownerOnly: true,
  execute: async (message, args) => {
  }
}