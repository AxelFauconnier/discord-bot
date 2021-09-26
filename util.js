const { MessageEmbed } = require('discord.js');

function formatDuration(seconds) {
    let hour = 0;
    let remainingSeconds = seconds;

    if (seconds >= 3600) {
        remainingSeconds = seconds % 3600;
        hour = (seconds - remainingSeconds) / 3600;
    }
    let sec = remainingSeconds % 60;
    let min = (remainingSeconds - sec) / 60;

    let fh = '';
    if (sec < 10) sec = '0' + sec;
    if (hour > 0) {
        fh = hour + ':';
        if (min < 10) min = '0' + min;
    }
    return fh + min + ':' + sec;
}

function createEmbedPlayMessage(song, interaction, pos) {
    const message = new MessageEmbed()
                .setAuthor('Added to queue', interaction.user.avatarURL())
                .setThumbnail(song.thumbnail)
                .setTitle(song.title)
                .setURL(song.url)
                .addFields(
                    { name: 'Duration', value: song.duration, inline: true },                    
                    { name: 'Views', value: song.views, inline: true },
                    { name: 'Position in queue', value: pos.toString(), inline: false },
                );

    return message;
}
// Use embeds or ```code block``` ? code = no url
function createQueueMessage(queue, nextIndex, interaction, playing) {
    let start = nextIndex - 2;
    if (start < 0 ) {
        start = 0;
    }
    const end = Math.min(start + 10, queue.length);
    let playingSong = -1;
    const maj = '```';
    const point = '```';

    if (playing) {
        playingSong = nextIndex - 1;
    }

    const message = new MessageEmbed().setFooter('\u200B', interaction.user.avatarURL())
        .setTitle('Queue');

    for(i = start; i < end; i++) {
        const item = queue[i];
        const pos = i + 1;
        const str = pos.toString() + '. ' + '[' + item.title + '](' + item.url + ')' + ' | ' + item.duration;
        let nameValue = '\u200B';

        if (playingSong === i) {
            nameValue = 'Now playing';
        }

        message.fields.push({ name: nameValue, value: str });
    }

    return message;
}

module.exports = { createEmbedPlayMessage, createQueueMessage, formatDuration };