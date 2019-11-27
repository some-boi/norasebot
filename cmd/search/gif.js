const req = require("request");
module.exports = {
  name: "gif",
  aliases: ["giphy"],
  usage: "<search>",
  cooldown: 5,
  module: "search",
  execute: (message, args) => {
    let s = args.join(" ");
    if (!s) return message.channel.send("Please use `;gif <search>`");
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
    let json = {
      url: `http://api.giphy.com/v1/gifs/search?q=${s}&api_key=${process.env.GIF}&limit=20`,
    };
    let fun = (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const jsoon = JSON.parse(body);
        let r = jsoon.data[rand()];
        return message.channel.send(r.url);
      } else {
        return message.channel.send("I got an error!");
        console.error(error);
      }
    };

    req(json, fun);
  }
};
