import { Guild } from 'discord.js';
import { EventHandler } from '../typings/types';

export = {
    name: 'guildCreate',
    once: false,
    callback: async function(guild: Guild) {
        await guild.me?.setNickname('Discord Defender');
    },
} as EventHandler;