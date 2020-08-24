import gsap from 'gsap';

export default class UI {
    constructor() {
        this.sound = document.getElementById("music");
        this.soundBTN = document.getElementById("musicCTA");
        this.info = document.getElementById("infoPage");
        this.infoBTN = document.getElementById("infoCTA");
        this.closeBTN = document.getElementById("infoClose");
        
        this.sound.volume = 0.4;
        this.isPlaying = false;
        this.isInfoOn = false;

        this.soundBTN.addEventListener('mousedown',this.toggleMusic.bind(this));   
        this.infoBTN.addEventListener('mousedown',this.toggleInfo.bind(this));   
        this.closeBTN.addEventListener('mousedown',this.toggleInfo.bind(this, false));
    }


    toggleInfo(show){
        this.isInfoOn = !this.isInfoOn;
        gsap.to(this.info, {y: this.isInfoOn ? '0%': '-100%', duration: 0.5});    
       
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

