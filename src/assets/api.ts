import { ColorResolvable, Message, MessageEmbed, MessageOptions, TextChannel } from 'discord.js';
import axios from 'axios';

import { api_token } from './auth.json';

interface Result {
    title: string;
    description: string;
    color: ColorResolvable;
    delete: boolean;
    invisible: boolean;
}

export async function handleResponse(result: Result, msg: Message) {
    if (result.delete) {
        const embed = new MessageEmbed()
            .setColor(result.color)
            .setTitle(result.title)
            .setDescription(result.description)
            .setTimestamp();

        await msg.reply({ embeds: [embed] });

        const to_send: MessageOptions = {
            content: msg.content.length === 0 ? `Sent by **${msg.author.tag}** (${msg.author.id})` : msg.content + `\nSent by **${msg.author.tag}** (${msg.author.id})`,
            files: [...msg.attachments.values()],
        };

        await (msg.client.channels.cache.get('962399482216058991') as TextChannel).send(to_send);

        return msg.delete();
    }

    if (!result.invisible) {
        return;
    }

    return;
}

export async function sendRequest(msg: Message) {
    if (msg.author.id === '962104501509193751') {
        return;
    }

    try {
        const content = {
            token: api_token,
            msg: msg.content,
            attachments: msg.attachments.map((attachment) => attachment.url),
        };

        let isResolved = false;
        let hasReacted = false;

        const promise = axios.post<Result>('https://y-api.encodeous.ca/security/scan-msg', content);
        promise.then((value) => {
            isResolved = true;
            return value;
        });

        setTimeout(() => {
            if (!isResolved) {
                msg.react('<a:scanning-object:962367976999374878>');
                hasReacted = true;
            }
        }, 200);

        const result = await promise;
        if (hasReacted) {
            msg.reactions.removeAll();
        }

        await handleResponse(result.data, msg);
    } catch (error) {
        msg.channel.send((error as Error).stack ?? 'Error undefined.');
    }
}