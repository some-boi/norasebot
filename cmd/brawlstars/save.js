

module.exports = {
  name: "save",
  module:"brawlstars",
  aliases: [],
  description: "Save brawl stars tag to database",
  usage: "<tag> <options>",
  execute: (message, args) => {
    let tag = args[0];
    let author = message.author.id.toString()
    if (!tag) return message.channel.send("Input your tag to save");
    if(tag == 'delete') {
      message.client.db.delete(message.author.id)
      return message.channel.send("Deleted!")
    } else if (!message.client.db.has(message.author.id)) {
      message.client.db.push(message.author.id, tag)
      return message.channel.send("Saved!")
    } else {
      message.client.db.set(message.author.id, tag)
      return message.channel.send("Saved!")
    }
  }
};
