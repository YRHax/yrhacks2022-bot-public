import { Command } from '../typings/types';

export = {
    name: 'setup',
    description: 'Sets the bot up.',
    aliases: [],
    cooldown: 5,
    execute: async (message, _args, client) => {
        if(client?.has_done_setup === true) {
            return message.reply('Your guild has already been set up! Check for a channel named **QUARANTINE**.');
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        client!.has_done_setup = true;

        return message.guild?.channels.create('QUARANTINE', { reason: 'Quarantine channel for this guild.', topic: 'A quarantine channel for suspicious files / links.' }).then((channel) => {
            return message.reply(`A quarantine channel for this server has been created! Head to <#${channel.id}> to check it out.`);
        });
    },
} as Command;