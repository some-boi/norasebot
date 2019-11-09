const fs = require("fs");
const Discord = require("discord.js");
const fetch = require("superagent")
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.queue = new Map();
const db = require("quick.db");
client.db = new db.table("tags"); // brawl stars tag
client.db1 = new db.table("announce"); // welcome autorole
client.db2 = new db.table("announce1") //goodbye
const modules = fs.readdirSync(`./cmd/`).filter(file => !file.startsWith("_"));
for (const module1 of modules) {
  const commandFiles = fs
    .readdirSync(`./cmd/${module1}/`)
    .filter(
      file =>
        (file.endsWith(".coffee") || file.endsWith(".js")) &&
        !file.startsWith("_")
    );
  console.log(`Module: ${module1}`);
  for (const file of commandFiles) {
    const command = require(`./cmd/${module1}/${file}`);
    client.commands.set(command.name, command);
    console.log(`${file} loaded!`);
  }
}
//keyv.on('error', err => console.error("Can't connect to database >-<", err))
const activities_list = [
  "I like cookies | ;help",
  "OwO | ;help",
  "UwU | ;help",
  "Do ;help for fun commands :3",
  "Fortnite sucks | ;help",
  "I like blursing cats | ;help",
  "Slaps people who breaks ToS | ;help"
];
const cooldowns = new Discord.Collection();
client.once("ready", () => {
  console.log(`Ready! Guild: ${client.guilds.size}`);
  setInterval(() => {
    const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
    client.user.setActivity(activities_list[index], { type: "PLAYING" });
  }, 15000);
});
client.on("debug", info => {
  if (info.startsWith("Authenticated using token")) {
    console.info("Authenticated using token");
  } else {
    console.info(info);
  }
});
client.on("disconnect", event => {
  console.log(event);
});
client.on("guildMemberAdd", member => {
  if (member.guild.id == client.db1.get(`${member.guild.id}.id`)) {
    if(client.db1.get(`${member.guild.id}.ignorebot`) && member.user.bot) return
    if(client.db1.has(`${member.guild.id}.autorole`)) {
      member.addRoles(client.db1.get(`${member.guild.id}.autorole`))
      
    }
    
    let pre = client.db1.get(`${member.guild.id}.message`);
    let pre1 = pre.replace("{server}", member.guild.name);
    let pre2 = pre1.replace("{mention}", `<@${member.id}>`);
    let pre3 = pre2.replace("{member}", member.user.tag);
    let pre4 = pre3.replace("{servercount}", member.guild.members.size);
    let pre5 = pre4.replace("{membercount}", member.guild.members.size);
    let pre6 = pre5.replace("{username}", member.user.username);
    return client.channels
      .find(m => m.id == client.db1.get(`${member.guild.id}.channel`))
      .send(pre6);
  } else {
    return;
  }
});
client.on("guildMemberRemove", member => {
  if (member.guild.id == client.db2.get(`${member.guild.id}.id`)) {
    if(client.db2.get(`${member.guild.id}.ignorebot`) && member.user.bot) return
    let pre = client.db2.get(`${member.guild.id}.message`);
    let pre1 = pre.replace("{server}", member.guild.name);
    let pre2 = pre1.replace("{servercount}", member.guild.members.size);
    let pre3 = pre2.replace("{membercount}", member.guild.members.size);
    let pre4 = pre3.replace("{member}", member.user.tag);
    return client.channels
      .find(m => m.id == client.db2.get(`${member.guild.id}.channel`))
      .send(pre4);
  } else {
    return;
  }
});
client.on("message", message => {
  let prefix = ";";
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);

  const commandName = args.shift().toLowerCase();
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      cmd => cmd.aliases && cmd.aliases.includes(commandName)
    );
  if (!command) return;
  if (command.ownerOnly && message.author.id != 390540063609454593)
    return message.reply("This command is Owner Only!");
  if (command.guildOnly && message.channel.type == "dm")
    return message.reply("I can't execute that command inside DMs!");
  if (command.hidden) return;
  if (command.permission && !message.member.hasPermission(command.permission))
    return message.channel.send(
      `You don't have any permission to execute the command\nYou need: ${command.permission.join(
        ", "
      )}`
    );
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `Please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    let e = !message.author.id == 390540063609454593 ? "" : error 
    message.reply("there was an error trying to execute that command!\n" + e);
  }
});
client.login(process.env.SECRET);
