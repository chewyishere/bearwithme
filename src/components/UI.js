import gsap from 'gsap';

export default class UI {
    constructor(scene) {
        this.scene = scene;
        this.sound_guitar = document.getElementById("music_guitar");
        this.sound_piano = document.getElementById("music_piano");
        
        this.soundBTN = document.getElementById("musicCTA");
        this.info = document.getElementById("infoPage");
        this.infoBTN = document.getElementById("infoCTA");
        this.closeBTN = document.getElementById("infoClose");
        this.bearImage = document.getElementsByClassName("infoBearGif")[0];
        this.next = document.getElementById("next");

        this.sound = [this.sound_guitar, this.sound_piano];

        this.sound_piano.volume = 0.3;
        this.sound_guitar.pause();
        this.sound_piano.pause();

        this.isPlaying = false;
        this.isInfoOn = false;
        this.on2ndPage = false;
        this.musicIdx = 1;

        this.gif = document.getElementById("bearGif"); 

        this.bearImage.addEventListener('mouseover',this.toggleGIF.bind(this, true));   
        this.bearImage.addEventListener('mouseout',this.toggleGIF.bind(this, false));   
        this.soundBTN.addEventListener('mousedown',this.toggleMusic.bind(this));   
        this.infoBTN.addEventListener('mousedown',this.toggleInfo.bind(this));   
        this.closeBTN.addEventListener('mousedown',this.toggleInfo.bind(this, false));
        this.next.addEventListener('mousedown',this.nextPage.bind(this, false));

        gsap.to( this.next, {opacity:1, duration: 1, delay: 1});    
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

    switchMusic(n){
        this.musicIdx = n;
        this.isPlaying = true;
        this.soundBTN.classList.add('off')
        if(n === 1){
            this.sound[0].pause();
            this.sound[0].currentTime = 0;
            let p = setTimeout(()=>{
                this.sound[1].play(); 
                clearTimeout(p);
            }, 1000);

        } else {
            this.sound[1].pause()
            this.sound[1].currentTime = 0;
            let p = setTimeout(()=>{
                this.sound[0].play(); 
                clearTimeout(p);
            }, 1000);
        }
    }

    toggleMusic(){
        this.isPlaying = !this.isPlaying;
       if( this.isPlaying ) {
            this.soundBTN.classList.add('off')
            this.sound[this.musicIdx].play();
        } else {
            this.soundBTN.classList.remove('off')
            this.sound[this.musicIdx].pause();
        }

    }
    
}

