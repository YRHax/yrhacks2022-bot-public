import { EventHandler, SlashCommand } from '../typings/types';
import path from 'path';
import fs from 'fs';

import { DiscordScanner } from '../bot';

export = {
    name: 'ready',
    once: false,
    callback: async function() {
        const self = this as unknown as DiscordScanner;
        const guild_id = '825107631797436436';

		try {
			const slash_command_files = fs.readdirSync(path.join(process.cwd(), 'src', 'slashcommands')).filter((file) => file.endsWith('.ts'));

			for(const file of slash_command_files) {
				const command: SlashCommand = require(path.join(process.cwd(), 'src', 'slashcommands', `${file}`));

				if(command.global === true) {
					const data = {
						name: command.name,
						description: command.description,
						options: command.options,
					};

					await self.application?.commands.create(data);
				} else {
					const data = {
						name: command.name,
						description: command.description,
						options: command.options,
					};

					await self.guilds.cache.get(guild_id)?.commands.create(data);
				}

				self.slash_commands.set(command.name, command);
				console.log(`[Slash Command] ${file} loaded! (${command.global ? 'Global' : 'Guild-only'})`);
			}
		} catch(error) {
			console.log((error as Error).stack);
		}


        self.user?.setPresence({ activities: [{ name: 'for malicious code...', type: 'WATCHING' }], status: 'dnd' });

        console.log('Connected to Discord!');
    },
} as EventHandler;