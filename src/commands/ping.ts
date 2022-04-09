import { Command } from '../typings/types';

export = {
    name: 'ping',
    description: 'Checks the latency of the bot.',
    aliases: ['latency'],
    cooldown: 3,
    execute: async (message) => {
        return message.channel.send('test');
    },
} as Command;