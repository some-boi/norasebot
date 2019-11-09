module.exports = {
  name: "weebify",
  aliases: ['weebify'],
  usage: "<text>",
  cooldown: 1,
  module: "fun",
  execute: (message, args) => {
    function furry() {
      let me = ['OwO!', ':3', 'uwu', 'oWo, whats this?', 'uw- OwO!', '']
      let index = Math.floor(Math.random() * (me.length - 1) + 1)
      return me[index]
    }
    function weeb(text1) {
      let text = text1.toLowerCase().replace("o", "ow")
      text = text.toLowerCase().replace("v", "w")
        text = text.toLowerCase().replace('i', 'wi')
        text = text.toLowerCase().replace('y', 'i')
        text = text.toLowerCase().replace('OwO', 'UwU')
        text = text.toLowerCase().replace('a', 'o')
        text = text.toLowerCase().replace('r', 'rw')
        text = text.toLowerCase().replace('e', 'we')
        text = text.toLowerCase().replace('t', 'ht')
        text = text.toLowerCase().replace('c', 'ch')
        text = text.toLowerCase().replace('u', 'uw')
      return `${text} ${furry()}`
    }
    if(!args[0]) {
      return message.reply("Please use `;weebify <text>`")
    } else {
      return message.channel.send(weeb(args.join(' ')))
    }
  }
}