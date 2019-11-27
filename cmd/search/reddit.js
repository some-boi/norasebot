const reddit = require("snoowrap")
const c = require("chance")
const {RichEmbed} = require("discord.js")
const re = new reddit({userAgent: process.env.UAGENT, clientId: process.env.CID, clientSecret: process.env.CSECRET, username: "therealraluvy95", password: process.env.PASSWORD})
module.exports = {
  name: "reddit",
  aliases: ['r', 'subreddit'],
  module: "search",
  cooldown: 5,
  execute: async (message, args) => {
            function rand() {
          let num = [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20"
          ];
          let item = num[Math.floor(Math.random() * num.length)];
          return item;
        }
    const sub = args[0]
    if(!sub) return message.channel.send("Please use `;reddit <subreddit>`")
    try {
   const e = await re.getSubreddit(sub).getHot()
    const r = e[rand()]
    console.log(r)
      
      if(r.over_18 && !message.channel.nsfw) {
        return message.channel.send("It looks like your result is a NSFW\nSo you can use it in NSFW channel")
      }
      let l = new RichEmbed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setTitle(r.title)
      .setURL(r.url)
      .setColor(new c().color({format: 'hex'}))
      
      .setDescription(!r.selftext ? '' : r.selftext)
      
      .setFooter(`👍 ${r.score} | 💬 ${r.num_comments}`)
      
        l.setImage(r.url)
      
      message.channel.send(l)
      
    } catch (e) {console.error(e)}
  }
}