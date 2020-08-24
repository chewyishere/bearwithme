export default class Music {
    constructor() {
        this.sound = document.getElementById("music");
        this.sound.volume = 0.4;
        this.soundBTN = document.getElementById("musicCTA");
        this.isPlaying = false;

        this.soundBTN.addEventListener('mousedown',this.toggleMusic.bind(this));
        this.sound.play();       
    }

    toggleMusic(){
        this.isPlaying = !this.isPlaying;
       if( this.isPlaying ) {
            this.soundBTN.classList.add('off')
            this.sound.play()
        } else {
            this.soundBTN.classList.remove('off')
            this.sound.pause()
        }

    }
    
}

