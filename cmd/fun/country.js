module.exports = {
  name: "country",
  module: "fun",
  cooldown: 0,
  execute: (message, args) => {
     let a = require("chance")
let b = new a()
 message.channel.send(b.country({full: true}))
  }
}