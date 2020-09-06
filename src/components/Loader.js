import gsap from 'gsap';

export default class Loader {
    constructor() {
        this.loader_container = document.getElementById("loader_chewy");
        this.loader_z = document.getElementsByClassName("loader_z");
        this.loader_text = document.getElementsById("loader_text");

        this.loader_z.forEach(el=>{
            gsap.set(el, {opacity: 0});
        })

        this.animateLoader();
    };

    animateLoader(){
        gsap.staggerTo([this.loader_z], 0.5, {opacity: 1},  0.2);
    }
}

