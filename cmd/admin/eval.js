module.exports = {
    name: "eval",
	aliases: [],module: "admin",
	usage: "<code>",
	ownerOnly: true,
    execute: (message, args) => {
		const clean = text => {
            if (typeof(text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else return text;
        }
        try {
            const code = args.join(" ");
            let evaled = eval(code);
            if (typeof evaled !== "string") {
				evaled = require("util").inspect(evaled);
			}
            return message.channel.send(clean(evaled), {code:"xl"});
        } catch (err) {
            return message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
	}
}