const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const projectId = 'bearwithme'
const keyFilename = './keys/psychic-upgrade-285416-ed5a550f5945.json'

class TextToSpeechPlayer extends textToSpeech.TextToSpeechClient {
    constructor(params) {
        super(params)
        this.settings = null;
        this.player = require('play')
        this.init();
    }
    updateText(text) {
        this.settings.input.text = text;
    }
    init() {
        this.settings = {
            audioConfig: {
                audioEncoding: "LINEAR16",
                pitch: -5,
                speakingRate: 0.6
            },
            input: {
                text: "No text has been given."
            },
            voice: {
                languageCode: "en-US",
                name: "en-AU-Wavenet-D"
            },
            outputFileName: "bearWithMeMessage.wav"
        }
    }
    async generateFile(play, cb) {
        const [response] = await this.synthesizeSpeech(this.settings);
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(this.settings.outputFileName, response.audioContent, 'binary');
        console.log(`Audio content written to file: ${this.settings.outputFileName}`);
        if (play) this.playFile(cb);

    }
    playFile(cb) {
        this.player.sound('./' + this.settings.outputFileName, cb);
    }
}

let textToSpeechPlayer = new TextToSpeechPlayer({ projectId, keyFilename })

module.exports = textToSpeechPlayer;