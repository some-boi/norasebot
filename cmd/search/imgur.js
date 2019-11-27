const request = require("request");
const { RichEmbed } = require('discord.js')
module.exports = {
  name: "image",
  aliases: ["imgur"],
  cooldown: 5,
  module: "search",
  execute: (message, args) => {
    let search = args.join(" ");
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
    if(!search) return message.channel.send("Please use `;image <search>`")
    message.channel.startTyping()
    let json = {
      url: `https://api.imgur.com/3/gallery/search/time/all/0?q=${search}`,
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR}`
      }
    };
    let fun = (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const jsoon = JSON.parse(body)
        let r = jsoon.data[rand()]
        if(!jsoon.success) { 
          if(!jsoon.status == 502) return message.channel.send("It looks like our API is down")
          return message.channel.send("It looks like your result is invalid")
        }
        if(r.nsfw && !message.channel.nsfw) return message.channel.send("It looks like your result is a NSFW")
        return message.channel.send(r.link)
      } else {
        return message.channel.send("I got an error!")
        console.error(error)
      }
    }
   
    
    request(json, fun)
     message.channel.stopTyping()
  }
};
