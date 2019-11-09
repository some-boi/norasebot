const yt = require("youtube-node");
const YouTube = new yt();

YouTube.setKey(process.env.YT);

module.exports = {
  name: "youtube",
  aliases: ['yt', 'ytb'],
  cooldown: 5,
  usage: "<search>",
  module: "search",
  execute(message, args) {
    if(!args) return message.channel.send("Use `;youtube <search>`")
    YouTube.search(args.join(" "), 2, async (error, result) => {
        if(error) {
          console.error(error)
          message.channel.send("I got an error!")
        } else {
          try{
        let ye = JSON.parse(JSON.stringify(result, null, 2)).items[0].id
        console.log(ye)
          if(ye.kind == "youtube#channel") return message.channel.send("It looks like the first result is a YT channel\nPlease search more detali")
        return message.channel.send(` https://www.youtube.com/watch?v=${ye.videoId}`)
        } catch { return message.channel.send("It looks like the result is invalid")}}
    })
    
  }
}

                   
