const {RichEmbed} = require("discord.js")
const fetch = require('superagent');
module.exports = {
  name: "blursed",
  aliases: [],
  usage: "<text>",
  module: "fun",
  cooldown: 4,
  execute: async (message,args) => {

    function rand() {
      let num = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14','15','16','17','18','19','20']
      let item = num[Math.floor(Math.random()*num.length)];
      return item
    }
    const ye = await fetch.get(`https://api.imgur.com/3/gallery/r/blursedimages/time/week`).set('Authorization',`Client-ID ${process.env.IMGUR}`).set('Accept', 'application/json')
    const yes = JSON.parse(ye.text).data
    const no = yes[Number(rand())]
    if(!no) {
      return message.channel.send("That was an error ;-;\nTry again.")
    }
    const e  = new RichEmbed()
    .setAuthor(message.author.username, message.author.avatarURL)
    .setTitle(no.title)
    .setDescription(`Not working? Check the [link](${no.link})`)
    .setImage(no.link)
    .setColor("25c059")
    .setFooter(`👍 ${no.score}`)
    message.channel.send(e)
  }
}