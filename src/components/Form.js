import gsap from 'gsap';
const axios = require('axios');
const apiPath = 'https://iot.dukefromearth.com/products/bearwithme'


export default class Form {
    constructor(_getCB) {
        this.form = document.querySelector("form");
        this.form.addEventListener("submit", this.onSubmit.bind(this));
        this.closeArea = document.getElementById("closeArea");
        this.closeArea.addEventListener("click", this.onCloseLetter.bind(this));
        this.getCB = _getCB;
        this.getLetters();
        this.letterDOMS = [];
        this.currentIdx = 0;
    }

    addLetterToDom(msgs) {
        console.log('addLetterToDom')
        let main = document.querySelector("main");
        let letterContainer = document.createElement("div");
        let msgField = document.createElement("p");
        
        letterContainer.classList.add('formContainer');
        msgField.classList.add('message-form','message-input');
        msgField.innerHTML = msgs.data.message;

        main.appendChild(letterContainer);
        letterContainer.appendChild(msgField);
        this.letterDOMS.push(letterContainer);
    }


    getLetters() {
        axios.get(apiPath)
            .then((res) => {
                this.getCB(res.data, true);
            })
            .catch((error) => {
                console.error(error)
            })
    }

    postLetters(msg) {
        axios.post(apiPath, msg)
          .then((res) => {
              this.getCB(msg, false);
          })
          .catch((error) => {
            console.log(error);
          });
    }

    showOldLetter(idx){
        this.currentIdx = idx;
        this.closeArea.classList.add('closeArea-active')
        gsap.fromTo(
            this.letterDOMS[idx], 
            {rotation: -10, x: 0, y: "300%", opacity: 1}, 
            {rotation: -2,  x: 0, y: "30%", duration: 0.5}
        );
    }

    onCloseLetter() {
        let l = this.letterDOMS[this.currentIdx]; 
        gsap.to(
            l, 
            {rotation: 10, x: 0, y: "-200%", opacity: 1}, 
        );

        this.closeArea.classList.remove('closeArea-active')
    }

    show(){
        gsap.fromTo(
            this.form, 
            {rotation: -10, x: 0, y: "300%", opacity: 1}, 
            {rotation: -2,  x: 0, y: "30%", duration: 0.5}
        );
    }

    validated(msg){
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(msg.data.email).toLowerCase());
    }

    onSubmit(e){
        e.preventDefault();
        let form = e.target;
        gsap.to(this.form, {rotation: 10, y: "-150%", duration: 0.5});
        let firstName = form.elements["fname_first"].value;
        let lastName = form.elements["fname_last"].value;
        let email = form.elements["femail"].value;
        let message = form.elements["fmessage"].value;

        let msg = {
            id: email,
            data: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                message: message,
            },
            hasPlayed: false,
            showOnShelf: true,
        }

        if(this.validated(msg)){
            this.postLetters(msg);
        } else {
            console.log('error for email')
        }
    }

    setPos(pos){
        this.position = pos;
    }

    setSize(size){
        this.scale.set(size);
    }


}