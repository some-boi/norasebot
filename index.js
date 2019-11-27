const fs = require("fs");
const s = require("wordfilter");
const frick = require("./swears.json");
const Discord = require("discord.js");
const fetch = require("superagent");
const spammer = require("spam");
const v = require("project-version");
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.queue = new Map();
const db = require("quick.db");
client.mod = new db.table("mod"); // automod & logging
client.warn = new db.table("warn"); // case
client.db = new db.table("tags"); // brawl stars tag
client.db1 = new db.table("announce"); // welcome autorole
client.db2 = new db.table("announce1"); //goodbye
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
  `v${v} | ;help`
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
client.on("guildBanAdd", (guild, user) => {
  //banned
  if (client.mod.has(`log_${guild.id}`)) {
    let y = client.mod
      .get(`log_${guild.id}`)
      .filter(m => m.type == 1 || m.type == 4);
    if (!y || y.lenght < 1) return;
    guild.fetchAuditLogs({ limit: 1 }).then(m => {
      let a = m.entries.first();
      if (!a.action == "MEMBER_BAN_ADD") return;
      const audit = a;
      for (const q of y) {
        try {
          const e = new Discord.RichEmbed()
            .setColor("#ff2e2e")
          .setTitle("Banned")
            .setAuthor(
              `${audit.executor.tag} (${audit.executor.id})`,
              audit.executor.avatarURL
            )
            .setThumbnail(user.avatarURL)
            .setDescription(
              `**${user.tag}** (${user.id}) got banned by ${
                audit.executor.tag
              }!\n**Reason:** ${!audit.reason ? "No reason" : audit.reason}`
            );
          guild.channels.get(q.channel).send(e);
        } catch {
          return;
        }
      }
    });
  } else {
    return;
  }
});
client.on("guildBanRemove", (guild, user) => {
  //remove ban
  if (client.mod.has(`log_${guild.id}`)) {
    let y = client.mod
      .get(`log_${guild.id}`)
      .filter(m => m.type == 1 || m.type == 4);
    if (!y || y.lenght < 1) return;

    guild.fetchAuditLogs({ limit: 1 }).then(m => {
      let a = m.entries.first();
      if (!a.action == "MEMBER_BAN_REMOVE") return;
      const audit = a;
      for (const q of y) {
        try {
          const e = new Discord.RichEmbed()
          
            .setColor("#42ff4b")
            .setAuthor(
              `${audit.executor.tag} (${audit.executor.id})`,
              audit.executor.avatarURL
            )
          .setTitle("UN-Banned")
            .setThumbnail(user.avatarURL)
            .setDescription(
              `**${user.tag}** (${user.id}) got unbanned by ${
                audit.executor.tag
              }!\n**Reason:** ${!audit.reason ? "No reason" : audit.reason}`
            );
          guild.channels.get(q.channel).send(e);
        } catch {
          return;
        }
      }
    });
  } else {
    return;
  }
});
client.on("guildMemberRemove", member => {
  //kicked
  if (client.mod.has(`log_${member.guild.id}`)) {
    let y = client.mod
      .get(`log_${member.guild.id}`)
      .filter(m => m.type == 1 || m.type == 4);
    if (!y || y.lenght < 1) return;
    member.guild.fetchAuditLogs({ limit: 1 }).then(m => {
      let a = m.entries.first();
      if (!a.action == "MEMBER_KICK") return;
      for (const q of y) {
        try {
          const e = new Discord.RichEmbed()
            .setColor("#ff2e2e")
          .setTitle("Kicked")
            .setAuthor(
              `${a.executor.tag} (${a.executor.id})`,
              a.executor.avatarURL
            )
            .setThumbnail(a.target.avatarURL)
            .setDescription(
              `**${a.target.tag}** (${a.target.id}) got kicked by ${
                a.executor.tag
              }!\n**Reason:** ${!a.reason ? "No reason" : a.reason}`
            );
          member.guild.channels.get(q.channel).send(e);
        } catch {
          return;
        }
      }
    });
  }
});
client.on("guildMemberAdd", member => {
  if (member.guild.id == client.db1.get(`${member.guild.id}.id`)) {
    if (client.db1.get(`${member.guild.id}.ignorebot`) && member.user.bot)
      return;
    if (client.db1.has(`${member.guild.id}.autorole`)) {
      member.addRoles(client.db1.get(`${member.guild.id}.autorole`));
    }
    try {
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
    } catch {
      return;
    }
  } else {
    return;
  }
});
client.on("guildMemberRemove", member => {
  if (member.guild.id == client.db2.get(`${member.guild.id}.id`)) {
    if (client.db2.get(`${member.guild.id}.ignorebot`) && member.user.bot)
      return;
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
  // mass ping
  if (!client.mod.has(`ping_${message.guild.id}`)) return;
  if (message.member.hasPermission("ADMINISTRATOR") || message.author.bot)
    return;
  let mass = client.mod.get(`ping_${message.guild.id}`);
  if (mass.ignore) {
    if (mass.ignore.find(m => m == message.channel.id)) return;
  }
  if (message.mentions.users.size >= mass.count) {
    message.delete();
    if (mass.dm) {
      message.author.send("Please don't ping too many users!");
    }
    if (mass.action == "ban") {
      message.guild.ban(message.member, { reason: "Pinging too many people" });
      let te = {
        case: message.client.warn.has(message.guild.id)
          ? message.client.warn
              .get(message.guild.id)
              .sort((a, b) => b.case - a.case)[0].case + 1
          : 1,
        userid: message.member.id,
        user: message.author.tag,
        action: "ban",
        mod: client.user.id,
        reason: "[AUTOMOD] Pinging too many people"
      };
      message.client.warn.push(message.guild.id, te);
      return message.channel.send(
        `\`Case: ${te.case}\`  ${message.author.tag} has been banned from this server!\nReason: **Pinging too many people**`
      );
    } else if (mass.action == "kick") {
      message.member.kick({ reason: "Pinging too many people" });
      let te = {
        case: message.client.warn.has(message.guild.id)
          ? message.client.warn
              .get(message.guild.id)
              .sort((a, b) => b.case - a.case)[0].case + 1
          : 1,
        userid: message.member.id,
        user: message.author.tag,
        action: "kick",
        mod: client.user.id,
        reason: "[AUTOMOD] Pinging too many people"
      };
      message.client.warn.push(message.guild.id, te);
      return message.channel.send(
        `\`Case: ${te.case}\`  ${message.author.tag} has been kicked from this server!\nReason: **Pinging too many people**`
      );
    } else if (mass.action == "mute") {
      let p = message.guild.roles.find(m => m.name == "Muted");
      if (!p)
        return message.channel.send(
          "It looks like I cannot mute him because this guild has no `Muted` role, but I deleted the message instead"
        );
      else {
        message.member
          .addRole(p.id, "Pinging too many people")
          .catch(console.error);
        let te = {
          case: message.client.warn.has(message.guild.id)
            ? message.client.warn
                .get(message.guild.id)
                .sort((a, b) => b.case - a.case)[0].case + 1
            : 1,
          userid: message.member.id,
          user: message.author.tag,
          action: "mute",
          mod: client.user.id,
          reason: "[AUTOMOD] Pinging too many people"
        };
        message.client.warn.push(message.guild.id, te);
        return message.channel.send(
          `\`Case: ${te.case}\`  ${message.author.tag} has been muted from this server!\nReason: **Pinging too many people**`
        );
      }
    } else if (mass.action == "warn") {
      let te = {
        case: message.client.warn.has(message.guild.id)
          ? message.client.warn
              .get(message.guild.id)
              .sort((a, b) => b.case - a.case)[0].case + 1
          : 1,
        userid: message.member.id,
        user: message.author.tag,
        action: "warn",
        mod: client.user.id,
        reason: "[AUTOMOD] Pinging too many people"
      };
      message.client.warn.push(message.guild.id, te);
      return message.channel.send(
        `\`Case: ${te.case}\`  ${message.author.tag} has been warned from this server!\nReason: **Pinging too many people**`
      );
    } else {
      return message.reply("**Stop pinging too many people!**").then(m => {
        m.delete(5000);
      });
    }
  }
});
client.on("message", message => {
  // spam detector
  if (!client.mod.has(`spam_${message.guild.id}`)) return;
  if (message.member.hasPermission("ADMINISTRATOR") || message.author.bot)
    return;
  let spam = client.mod.get(`spam_${message.guild.id}`);
  if (spam.ignore) {
    if (spam.ignore.find(m => m == message.channel.id)) return;
  }
  spammer.log(message, 50);
  if (spammer.tooQuick(5, 3000)) {
    message.channel.bulkDelete(5);
    if (spam.dm) {
      message.author.send("Please don't spam!");
    }
    if (spam.action == "ban") {
      message.guild.ban(message.member, { reason: "Spamming" });
      let te = {
        case: message.client.warn.has(message.guild.id)
          ? message.client.warn
              .get(message.guild.id)
              .sort((a, b) => b.case - a.case)[0].case + 1
          : 1,
        userid: message.member.id,
        user: message.author.tag,
        action: "ban",
        mod: client.user.id,
        reason: "[AUTOMOD] Spamming"
      };
      message.client.warn.push(message.guild.id, te);
      return message.channel.send(
        `\`Case: ${te.case}\`  ${message.author.tag} has been banned from this server!\nReason: **Spamming**`
      );
    } else if (spam.action == "kick") {
      message.member.kick({ reason: "Spamming" });
      let te = {
        case: message.client.warn.has(message.guild.id)
          ? message.client.warn
              .get(message.guild.id)
              .sort((a, b) => b.case - a.case)[0].case + 1
          : 1,
        userid: message.member.id,
        user: message.author.tag,
        action: "kick",
        mod: client.user.id,
        reason: "[AUTOMOD] Spamming"
      };
      message.client.warn.push(message.guild.id, te);
      return message.channel.send(
        `\`Case: ${te.case}\`  ${message.author.tag} has been kicked from this server!\nReason: **Spamming**`
      );
    } else if (spam.action == "mute") {
      let p = message.guild.roles.find(m => m.name == "Muted");
      if (!p)
        return message.channel.send(
          "It looks like I cannot mute him because this guild has no `Muted` role, but I deleted the message insteald"
        );
      else {
        message.member.addRole(p.id, "Spamming").catch(console.error);
        let te = {
          case: message.client.warn.has(message.guild.id)
            ? message.client.warn
                .get(message.guild.id)
                .sort((a, b) => b.case - a.case)[0].case + 1
            : 1,
          userid: message.member.id,
          user: message.author.tag,
          action: "mute",
          mod: client.user.id,
          reason: "[AUTOMOD] Spamming"
        };
        message.client.warn.push(message.guild.id, te);
        return message.channel.send(
          `\`Case: ${te.case}\`  ${message.author.tag} has been muted from this server!\nReason: **Spamming**`
        );
      }
    } else if (spam.action == "warn") {
      let te = {
        case: message.client.warn.has(message.guild.id)
          ? message.client.warn
              .get(message.guild.id)
              .sort((a, b) => b.case - a.case)[0].case + 1
          : 1,
        userid: message.member.id,
        user: message.author.tag,
        action: "warn",
        mod: client.user.id,
        reason: "[AUTOMOD] Spamming"
      };
      message.client.warn.push(message.guild.id, te);
      return message.channel.send(
        `\`Case: ${te.case}\`  ${message.author.tag} has been warned from this server!\nReason: **Spamming**`
      );
    } else {
      return message.reply("**Stop spamming!**").then(m => {
        m.delete(5000);
      });
    }
  } else if (spammer.sameMessages(5, 30000)) {
    message.channel.bulkDelete(5);
    if (spam.dm) {
      message.author.send("Please don't repeat the same messages!");
    }
    if (spam.action == "ban") {
      message.guild.ban(message.member, {
        reason: "Repeating the same messages"
      });
      let te = {
        case: message.client.warn.has(message.guild.id)
          ? message.client.warn
              .get(message.guild.id)
              .sort((a, b) => b.case - a.case)[0].case + 1
          : 1,
        userid: message.member.id,
        user: message.author.tag,
        action: "ban",
        mod: client.user.id,
        reason: "[AUTOMOD] Repeating the same messages"
      };
      message.client.warn.push(message.guild.id, te);
      return message.channel.send(
        `\`Case: ${te.case}\`  ${message.author.tag} has been banned from this server!\nReason: **Repeating the same messages**`
      );
    } else if (spam.action == "kick") {
      message.member.kick({ reason: "Repeating the same messages" });
      let te = {
        case: message.client.warn.has(message.guild.id)
          ? message.client.warn
              .get(message.guild.id)
              .sort((a, b) => b.case - a.case)[0].case + 1
          : 1,
        userid: message.member.id,
        user: message.author.tag,
        action: "kick",
        mod: client.user.id,
        reason: "[AUTOMOD] Spamming"
      };
      message.client.warn.push(message.guild.id, te);
      return message.channel.send(
        `\`Case: ${te.case}\`  ${message.author.tag} has been kicked from this server!\nReason: **Repeating the same messages**`
      );
    } else if (spam.action == "mute") {
      let p = message.guild.roles.find(m => m.name == "Muted");
      if (!p)
        return message.channel.send(
          "It looks like I cannot mute him because this guild has no `Muted` role, but I deleted the message insteald"
        );
      else {
        message.member
          .addRole(p.id, "Repeating the same messages")
          .catch(console.error);
        let te = {
          case: message.client.warn.has(message.guild.id)
            ? message.client.warn
                .get(message.guild.id)
                .sort((a, b) => b.case - a.case)[0].case + 1
            : 1,
          userid: message.member.id,
          user: message.author.tag,
          action: "mute",
          mod: client.user.id,
          reason: "[AUTOMOD] Repeating the same messages"
        };
        message.client.warn.push(message.guild.id, te);
        return message.channel.send(
          `\`Case: ${te.case}\`  ${message.author.tag} has been muted from this server!\nReason: **Repeating the same messages**`
        );
      }
    } else if (spam.action == "warn") {
      let te = {
        case: message.client.warn.has(message.guild.id)
          ? message.client.warn
              .get(message.guild.id)
              .sort((a, b) => b.case - a.case)[0].case + 1
          : 1,
        userid: message.member.id,
        user: message.author.tag,
        action: "warn",
        mod: client.user.id,
        reason: "[AUTOMOD] Repeating the same messages"
      };
      message.client.warn.push(message.guild.id, te);
      return message.channel.send(
        `\`Case: ${te.case}\`  ${message.author.tag} has been warned from this server!\nReason: **Repeating the same messages**`
      );
    } else {
      return message.reply("**Stop repeating the same messages!**").then(m => {
        m.delete(5000);
      });
    }
  }
});
client.on("message", message => {
  // swear detected
  if (!client.mod.has(`swear_${message.guild.id}`)) return;
  if (message.member.hasPermission("ADMINISTRATOR") || message.author.bot)
    return;
  let swear = client.mod.get(`swear_${message.guild.id}`);
  if (swear.ignore) {
    if (swear.ignore.find(m => m == message.channel.id)) return;
  }
  if (swear.default) s.addWords(frick.swears);
  if (swear.swears) s.addWords(swear.swears);
  if (s.blacklisted(message.content)) {
    message.delete();
    if (swear.dm) {
      message.author.send("Please don't say that word!");
    }
    if (swear.action == "ban") {
      message.guild.ban(message.member, { reason: "Using a bad word" });
      let te = {
        case: message.client.warn.has(message.guild.id)
          ? message.client.warn
              .get(message.guild.id)
              .sort((a, b) => b.case - a.case)[0].case + 1
          : 1,
        userid: message.member.id,
        user: message.author.tag,
        action: "ban",
        mod: client.user.id,
        reason: "[AUTOMOD] Using a bad word"
      };
      message.client.warn.push(message.guild.id, te);
      return message.channel.send(
        `\`Case: ${te.case}\`  ${message.author.tag} has been banned from this server!\nReason: **Using a bad word**`
      );
    } else if (swear.action == "kick") {
      message.member.kick({ reason: "Using a bad word" });
      let te = {
        case: message.client.warn.has(message.guild.id)
          ? message.client.warn
              .get(message.guild.id)
              .sort((a, b) => b.case - a.case)[0].case + 1
          : 1,
        userid: message.member.id,
        user: message.author.tag,
        action: "kick",
        mod: client.user.id,
        reason: "[AUTOMOD] Using a bad word"
      };
      message.client.warn.push(message.guild.id, te);
      return message.channel.send(
        `\`Case: ${te.case}\`  ${message.author.tag} has been kicked from this server!\nReason: **Using a bad word**`
      );
    } else if (swear.action == "warn") {
      let te = {
        case: message.client.warn.has(message.guild.id)
          ? message.client.warn
              .get(message.guild.id)
              .sort((a, b) => b.case - a.case)[0].case + 1
          : 1,
        userid: message.member.id,
        user: message.author.tag,
        action: "warn",
        mod: client.user.id,
        reason: "[AUTOMOD] Using a bad word"
      };
      message.client.warn.push(message.guild.id, te);
      return message.channel.send(
        `\`Case: ${te.case}\`  ${message.author.tag} has been warned from this server!\nReason: **Using a bad word**`
      );
    } else if (swear.action == "mute") {
      let p = message.guild.roles.find(m => m.name == "Muted");
      if (!p)
        return message.channel.send(
          "It looks like I cannot mute him because this guild has no `Muted` role, but I deleted the message insteald"
        );
      else {
        message.member.addRole(p.id, "Using a bad word").catch(console.error);
        let te = {
          case: message.client.warn.has(message.guild.id)
            ? message.client.warn
                .get(message.guild.id)
                .sort((a, b) => b.case - a.case)[0].case + 1
            : 1,
          userid: message.member.id,
          user: message.author.tag,
          action: "mute",
          mod: client.user.id,
          reason: "[AUTOMOD] Using a bad word"
        };
        message.client.warn.push(message.guild.id, te);
        return message.channel.send(
          `\`Case: ${te.case}\`  ${message.author.tag} has been muted from this server!\nReason: **Using a bad word**`
        );
      }
    } else {
      return message.reply("**LANGUAGE!!!** 😡").then(m => {
        m.delete(5000);
      });
    }
  }
  s.clearList();
});
client.on("message", message => {
  // caps detector
  if (!client.mod.has(`caps_${message.guild.id}`)) return;
  if (message.member.hasPermission("ADMINISTRATOR") || message.author.bot)
    return;

  let caps = client.mod.get(`caps_${message.guild.id}`);
  if (caps.ignore) {
    if (caps.ignore.find(m => m == message.channel.id)) return;
  }
  let check = message.content.replace(/[^A-Z]/g, "").length;
  let bip = Math.floor((check / 150) * 100);
  if (bip >= 15) {
    try {
      message.delete();
      if (caps.dm) {
        message.author.send("Please don't use CAPS ON!");
      }
      if (caps.action == "kick") {
        message.member.kick({ reason: "Using CAPS ON" });
        let te = {
          case: message.client.warn.has(message.guild.id)
            ? message.client.warn
                .get(message.guild.id)
                .sort((a, b) => b.case - a.case)[0].case + 1
            : 1,
          userid: message.member.id,
          user: message.author.tag,
          action: "kick",
          mod: client.user.id,
          reason: "[AUTOMOD] Using CAPS ON"
        };
        message.client.warn.push(message.guild.id, te);
        return message.channel.send(
          `\`Case: ${te.case}\`  ${message.author.tag} has been kicked from this server!\nReason: **Using CAPS ON**`
        );
      } else if (caps.action == "mute") {
        let p = message.guild.roles.find(m => m.name == "Muted");
        if (!p)
          return message.channel.send(
            "It looks like I cannot mute him because this guild has no `Muted` role, but I deleted the message insteald"
          );
        else {
          message.member.addRole(p.id, "Using CAPS ON").catch(console.error);
          let te = {
            case: message.client.warn.has(message.guild.id)
              ? message.client.warn
                  .get(message.guild.id)
                  .sort((a, b) => b.case - a.case)[0].case + 1
              : 1,
            userid: message.member.id,
            user: message.author.tag,
            action: "mute",
            mod: client.user.id,
            reason: "[AUTOMOD] Using CAPS ON"
          };
          message.client.warn.push(message.guild.id, te);
          return message.channel.send(
            `\`Case: ${te.case}\`  ${message.author.tag} has been muted from this server!\nReason: **Using CAPS ON**`
          );
        }
      } else {
        return message.reply("Stop using CAPS!");
      }
    } catch (e) {
      console.error(e);
    }
  }
});
client.on("message", message => {
  //invite detector
  if (!client.mod.has(`invite_${message.guild.id}`)) return;
  if (
    (message.content.includes("https://discord.gg/") ||
      message.content.includes("discord.gg/")) &&
    !message.author.bot
  ) {
    if (message.member.hasPermission("ADMINISTRATOR")) return;
    let inviter = client.mod.get(`invite_${message.guild.id}`);
    if (inviter.ignore) {
      if (inviter.ignore.find(m => m == message.channel.id)) return;
    }
    try {
      message.delete();
      if (inviter.dm) {
        message.author.send("Stop posting Discord invite link!");
      }
      if (inviter.action == "ban") {
        message.guild.ban(message.member, {
          reason: "Posting a Discord link server"
        });
        let te = {
          case: message.client.warn.has(message.guild.id)
            ? message.client.warn
                .get(message.guild.id)
                .sort((a, b) => b.case - a.case)[0].case + 1
            : 1,
          userid: message.member.id,
          user: message.author.tag,
          action: "ban",
          mod: client.user.id,
          reason: "[AUTOMOD] Posting a Discord server"
        };
        message.client.warn.push(message.guild.id, te);
        return message.channel.send(
          `\`Case: ${te.case}\`  ${message.author.tag} has been banned from this server!\nReason: **Posting a Discord server**`
        );
      } else if (inviter.action == "kick") {
        message.member.kick({ reason: "Posting a Discord link server" });
        let te = {
          case: message.client.warn.has(message.guild.id)
            ? message.client.warn
                .get(message.guild.id)
                .sort((a, b) => b.case - a.case)[0].case + 1
            : 1,
          userid: message.member.id,
          user: message.author.tag,
          action: "kick",
          mod: client.user.id,
          reason: "[AUTOMOD] Posting a Discord server"
        };
        message.client.warn.push(message.guild.id, te);
        return message.channel.send(
          `\`Case: ${te.case}\`  ${message.author.tag} has been kicked from this server!\nReason: **Posting a Discord server**`
        );
      } else if (inviter.action == "mute") {
        let p = message.guild.roles.find(m => m.name == "Muted");
        if (!p)
          return message.channel.send(
            "It looks like I cannot mute him because this guild has no `Muted` role, but I deleted the message insteald"
          );
        else {
          message.member
            .addRole(p.id, "Posting a Discord link server")
            .catch(console.error);
          let te = {
            case: message.client.warn.has(message.guild.id)
              ? message.client.warn
                  .get(message.guild.id)
                  .sort((a, b) => b.case - a.case)[0].case + 1
              : 1,
            userid: message.member.id,
            user: message.author.tag,
            action: "mute",
            mod: client.user.lid,
            reason: "[AUTOMOD] Posting a Discord server"
          };
          message.client.warn.push(message.guild.id, te);
          return message.channel.send(
            `\`Case: ${te.case}\`  ${message.author.tag} has been muted from this server!\nReason: **Posting a Discord server**`
          );
        }
      } else {
        return message.reply(
          "Hey, you are not allowed to post the discord server link here!"
        );
      }
    } catch (e) {
      console.error(e);
    }
  } else return;
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
    if (command.module == "music") return;
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    let e = !message.author.id == 390540063609454593 ? "" : error;
    message.reply("there was an error trying to execute that command!\n" + e);
  }
});
client.login(process.env.SECRET);
