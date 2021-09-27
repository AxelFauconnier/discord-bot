const { demuxProbe, createAudioResource } = require('@discordjs/voice');
const { raw } = require('youtube-dl-exec');
const { formatDuration } = require('../util');

class Song {

    constructor({ url, title, duration, views, thumbnail }) {
        this.url = url;
        this.title = title;
        this.duration = duration;
        this.views = views;
        this.thumbnail = thumbnail;
    }

    // Return a song with getInfo(url) data
    static fromURL(info) {
        const song = info.videoDetails;

        return new Song({
            url: song.video_url,
            title: song.title,
            duration: formatDuration(song.lengthSeconds),
            views: song.viewCount,
            thumbnail: song.thumbnails[0].url,
        });
    }

    // Return a song with ytsr('search') data
    static fromSearch(result) {
        const song = result.items[0];
        if (song.type !== 'video') {
            throw new Error('The first result from the search is not a video');
        }

        return new Song({
            url: song.url,
            title: song.title,
            duration: song.duration,
            views: song.views.toString(),
            thumbnail: song.thumbnails[0].url,
        });
    }

    createAudioResource() {
        return new Promise((resolve, reject) => {
            const process = raw(this.url,
                {
                    o: '-',
                    q: '',
                    f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
                    r: '100K',
                },
                { stdio: ['ignore', 'pipe', 'ignore'] },
            );
            if (!process.stdout) {
                reject(new Error('No stdout'));
                return;
            }
            const stream = process.stdout;
            const onError = (error) => {
                if (!process.killed) process.kill();
                stream.resume();
                reject(error);
            };
            process.once('spawn', () => {
                demuxProbe(stream).then((probe) => {
                    resolve(createAudioResource(probe.stream, { metadata: this, inputType: probe.type}))
                })
                .catch(onError);
            })
            .catch(onError);
        });       
    }

}

module.exports = { Song };