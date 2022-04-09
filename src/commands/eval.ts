import { MessageEmbed } from 'discord.js';
import { inspect } from 'util';
import { createError, removeCodeblock } from '../assets/functions';
import { Command } from '../typings/types';
import sourcebin from 'sourcebin';

export = {
    name: 'eval',
    description: 'Allows the bot devs to evaluate code within Discord.',
    aliases: ['e'],
    ownerOnly: true,
    cooldown: 0,
    execute: async (message, args) => {
        if(!args) {
            return message.reply({ embeds: [createError('You did not type anything to evaluate!')] });
        }

        try {
            const to_eval = removeCodeblock(args.join(' '));
            const output = eval(to_eval.includes('await') ? `(async () => { ${to_eval} })()` : to_eval);
            const final_output = inspect(output, { showHidden: false, depth: 0 });

            if(output instanceof Promise) {
                await output;

                return message.reply('`Evaluated in 69 millisecond(s)`');
            } else {
                const embed = new MessageEmbed()
                    .setDescription(`**Input**\n\`\`\`javascript\n${to_eval}\`\`\`\n**Output**\n\`\`\`javascript\n${final_output}\`\`\``)
                    .setFooter({ text: 'Evaluated in 69 millisecond(s)' })
                    .setColor('RANDOM');

                if(embed.description && embed.description.length > 4096) {
                    const bin = await sourcebin.create([{
                        content: `${final_output}`,
                        language: 'javascript',
                    }], {
                        title: 'Evaluated Output',
                        description: 'The output was over 4k chars',
                    });

                    console.log(bin);
                    return message.reply(`The output was larger than 4k characters, here's the sourcebin link:\n<${bin.url}>`);
                }

                return message.reply({ embeds: [embed] });
            }
        } catch(err) {
            const to_eval = removeCodeblock(args.join(' '));

            const embed = new MessageEmbed()
                .setDescription(`**Input**\n\`\`\`javascript\n${to_eval}\`\`\`\n**Output**\n\`\`\`javascript\n${err}\`\`\``)
                .setFooter({ text: 'An error occurred!' })
                .setColor('RANDOM');

            if(embed.description && embed.description.length > 4096) {
                const bin = await sourcebin.create([{
                    content: `${err}`,
                    language: 'javascript',
                }], {
                    title: 'Evaluated Output',
                    description: 'The output was over 4k chars',
                });

                return message.reply(`The output was larger than 4k characters, here's the sourcebin link:\n<${bin.url}>`);
            }

            return message.reply({ embeds: [embed] });
        }
    },
} as Command;