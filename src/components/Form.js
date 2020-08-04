import gsap from 'gsap';

export default class Form {
    constructor() {
        this.form = document.querySelector("form");
        this.form.addEventListener("submit", this.onSubmit.bind(this));
        this.name = 'no one';
        this.message = 'no mesage';
        this.email = 'no email';
    }

    show(){
        gsap.fromTo(
            this.form, 
            {rotation: -10, y: "300%", opacity: 1}, 
            {rotation: -2, y: "30%", duration: 0.5}
        );
    }

    onSubmit(e){
        e.preventDefault();
        let form = e.target;
        gsap.to(this.form, {rotation: 10, y: "-150%", duration: 0.5});
        this.name = form.elements["fname"].value;
        this.message = form.elements["fmessage"].value;
    }

}