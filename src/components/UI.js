import gsap from 'gsap';

export default class UI {
    constructor(scene) {
        this.scene = scene;
        this.sound = document.getElementById("music");
        this.soundBTN = document.getElementById("musicCTA");
        this.info = document.getElementById("infoPage");
        this.infoBTN = document.getElementById("infoCTA");
        this.closeBTN = document.getElementById("infoClose");
        this.bearImage = document.getElementsByClassName("infoBearGif")[0];
        this.next = document.getElementById("next");

        this.sound.volume = 0.4;
        this.isPlaying = false;
        this.isInfoOn = false;
        this.on2ndPage = false;

        this.gif = document.getElementById("bearGif"); 

        this.bearImage.addEventListener('mouseover',this.toggleGIF.bind(this, true));   
        this.bearImage.addEventListener('mouseout',this.toggleGIF.bind(this, false));   
        this.soundBTN.addEventListener('mousedown',this.toggleMusic.bind(this));   
        this.infoBTN.addEventListener('mousedown',this.toggleInfo.bind(this));   
        this.closeBTN.addEventListener('mousedown',this.toggleInfo.bind(this, false));
        this.next.addEventListener('mousedown',this.nextPage.bind(this, false));
    }

    nextPage(){
        gsap.to(this.scene.position, {x: !this.on2ndPage? -window.innerWidth : 0, duration: 0.5});  
        this.on2ndPage = !this.on2ndPage;
        this.next.classList.toggle('next-right');

    }

    toggleGIF(over){
        over ? this.gif.classList.add('showGif') : this.gif.classList.remove('showGif') 
    }

    toggleInfo(){
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

