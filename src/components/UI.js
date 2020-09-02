import gsap from 'gsap';
import lottie from 'lottie-web'

export default class UI {
    constructor(scene) {
        this.scene = scene;
        this.loader_container = document.getElementById("loader_chewy");
        this.sound_guitar = document.getElementById("music_guitar");
        this.sound_piano = document.getElementById("music_piano");
        
        this.soundBTN = document.getElementById("musicCTA");
        this.info = document.getElementById("infoPage");
        this.infoBTN = document.getElementById("infoCTA");
        this.closeBTN = document.getElementById("infoClose");
        this.bearImage = document.getElementsByClassName("infoBearGif")[0];
        this.next = document.getElementById("next");
        this.loader = document.getElementById("loader");
        this.sound = [this.sound_guitar, this.sound_piano];

        this.sound_piano.volume = 0.3;
        this.sound_guitar.pause();
        this.sound_piano.pause();

        this.isPlaying = false;
        this.isInfoOn = false;
        this.on2ndPage = false;
        this.musicIdx = 1;

        this.initLoad();

        this.gif = document.getElementById("bearGif"); 

        this.bearImage.addEventListener('mouseover',this.toggleGIF.bind(this, true));   
        this.bearImage.addEventListener('mouseout',this.toggleGIF.bind(this, false));   
        this.soundBTN.addEventListener('mousedown',this.toggleMusic.bind(this));   
        this.infoBTN.addEventListener('mousedown',this.toggleInfo.bind(this));   
        this.closeBTN.addEventListener('mousedown',this.toggleInfo.bind(this, false));
        this.next.addEventListener('mousedown',this.nextPage.bind(this, false));
    }
   
    initLoad(){
        gsap.set(this.next, {opacity: 0});
        gsap.set(this.soundBTN, {opacity: 0});
        gsap.set(this.infoBTN, {opacity: 0});
        this.loaderAnim = lottie.loadAnimation({
            container:  this.loader_container, // the dom element that will contain the animation
            renderer: 'svg',
            clearCanvas: false,
            loop: true,
            autoplay: false,
            path: 'assets/loader/panda.json', // the path to the animation json
            rendererSettings: {
				preserveAspectRatio: 'xMidYMid slice',
				clearCanvas: false,
				progressiveLoad: false,
			}
          });
        this.loaderAnim.play(); 
    };

    loadingComplete(){
        this.loaderAnim.pause(); 
        gsap.to( this.loader, {opacity:0, duration: 0.5, onComplete: ()=> {
            gsap.set(this.loader, {display: 'none'});
            gsap.to( this.next, {opacity:1, duration: 1, delay: 1});    
            gsap.to( this.soundBTN, {opacity:1, duration: 1});    
            gsap.to( this.infoBTN, {opacity:1, duration: 1});    
        }});      
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

