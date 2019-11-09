const superagent = require("superagent")
module.exports = {
  name: "image",
  aliases: ["imgur"],
  cooldown: 5,
  module: "search",
  execute: (message, args) => {
    let search = args.join(' ')
    const res = superagent.get(`https://api.imgur.com/3/gallery/search/time/all/0?q=${search}`).set('Authorization',`Client-ID ${process.env.IMGUR}`)
    console.log(res.text)
    let r = JSON.parse(res.text)
    
  }
}