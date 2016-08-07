// taken from https://gist.github.com/revolunet/f194a6b4cbbd10a304f9 and modified

var lame = require('lame');
var fs = require('fs');
var Speaker = require('speaker');
var volume = require("pcm-volume");

var audioOptions = {
    channels: 2,
    bitDepth: 16,
    sampleRate: 44100,
    mode: lame.STEREO
};


var song = 'rain-and-thunder.mp3';

function playStream(input, options) {
    var decoder = lame.Decoder();
    options = options || {};
    var v = new volume();
    if (options.volume) {
        v.setVolume(options.volume);
    }
    var speaker = new Speaker(audioOptions);
    speaker.on('finish', function() {
        if (options.loop) {
            // i want to restart here
            start();
        }
    });
    function start() {
        v.pipe(speaker);
        decoder.pipe(v);
        input.pipe(decoder);
    }
    start();
}

var inputStream = fs.createReadStream(song);


playStream(inputStream, {
    volume: 0.5,
    loop: true
});
