import { MessageEmbed } from 'discord.js';

import { bot_token } from './auth.json';

const owner_tags = 'encodeous#7441 / Terrarian#1265 / Mystical7818';

/**
 * Creates an error embed for any command errors.
 * @param {string} error - The error.
 * @example const error = createError('An error occurred!');
 */
export function createError(error: string) {
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Error!')
        .setDescription(error)
        .setTimestamp()
        .setFooter({ text: `Made by ${owner_tags}` });

    return embed;
}

/**
 * Cleans the provided text (gets rid of Discord mentions).
 * @param {string} text - The text to clean.
 * @example const cleaned = clean('@everyone');
 */
export function clean(text: string) {
    return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)).replace(new RegExp(bot_token, 'gi'), '***************');
}

/**
 * Removes markdown formatting for codeblocks.
 * @param {string} text - The text with markdown codeblocks to remove.
 * @example const cleaned = removeCodeblock(```js\nmessage.channel.send('Hey there!');\n```);
 */
export function removeCodeblock(text: string) {
    if(text.startsWith('```')) {
        text = text.replace(/^```(js|ts|typescript|javascript)?\n/g, '');
    }

    if(text.endsWith('```')) {
        text = text.replace(/```$/g, '');
    }

    return text;
}

/**
 * Parses text case.
 * @param string The text to parse.
 */
export function parseCase(string: string): void {
    string.split('_').map((char) => char[0] + char.slice(1).toLowerCase()).join(' ');
}

/**
 * Returns a boolean if a link is a valid link.
 * @param {String} link - The link to check.
 * @example const validlink = isValidLink('https://bit.ly/3eiCLNg');
 */
export function isValidLink(link: string) {
    const regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/;
    return link.match(regex);
}