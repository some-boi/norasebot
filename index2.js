const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./index.js', { token: process.env.SECRET });

manager.spawn();
manager.on('launch', shard => console.log(`Launched shard ${shard.id}`));