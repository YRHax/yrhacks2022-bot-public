import { Client, Collection, Snowflake } from 'discord.js';
import path from 'path';
import fs from 'fs';

import { Command, EventHandler, SlashCommand } from './typings/types';
import { bot_token } from './assets/auth.json';

export class DiscordScanner extends Client {
    commands: Collection<string, Command>;
    slash_commands: Collection<string, SlashCommand>;
    cooldowns: Collection<string, Collection<Snowflake, number>>;
    has_done_setup: boolean;

    constructor() {
        super({
            intents: 32767,
            partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
            restTimeOffset: 100,
        });

        this.commands = new Collection();
        this.slash_commands = new Collection();
        this.cooldowns = new Collection();
        this.has_done_setup = false;
    }
}

const client = new DiscordScanner();

const cmd_array = [];
let index = 1;

const command_files = fs.readdirSync(path.join(process.cwd(), 'src', 'commands')).filter((file) => file.endsWith('.ts'));

for (const file of command_files) {
    const cmd_name = file.split('.')[0];
    cmd_array.push(cmd_name);
}

for (const file of command_files) {
    const command: Command = require(path.join(process.cwd(), 'src', 'commands', `${file}`));
    client.commands.set(command.name, command);

    console.log(`${file} loaded! [${index}/${cmd_array.length}]`);
    index++;
}

const events = fs.readdirSync(path.join(process.cwd(), 'src', 'events'));
function loadEvents() {
    for (const file of events) {
        const event: EventHandler = require(path.join(process.cwd(), 'src', 'events', file));
        client.on(event.name, event.callback.bind(client));
    }
}

loadEvents();

client.login(bot_token);