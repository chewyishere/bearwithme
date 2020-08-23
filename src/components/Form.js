import gsap from 'gsap';
const axios = require('axios');
const apiPath = 'https://iot.dukefromearth.com/products/bearwithme'


export default class Form {
    constructor(_getCB) {
        this.form = document.querySelector("form");
        this.form.addEventListener("submit", this.onSubmit.bind(this));
        this.closeArea = document.getElementById("closeArea");
        this.submitBTN = document.getElementById("submitCTA");
        this.info = document.getElementById("info");
        this.close = document.getElementById("close");
        this.chat = document.getElementById("chat");
        this.closeArea.addEventListener("click", this.onCloseLetter.bind(this));
        this.close.addEventListener("click", this.onCloseLetter.bind(this));
        this.close.addEventListener("mouseover", this.onCloseHover.bind(this, true));
        this.close.addEventListener("mouseout", this.onCloseHover.bind(this, false));
        this.submitBTN.addEventListener("mouseover", this.onSendHover.bind(this,true));
        this.submitBTN.addEventListener("mouseout", this.onSendHover.bind(this,false));

        this.email = document.getElementById("info");
        this.email.addEventListener("mouseover", this.onEmailHover.bind(this, true));
        this.email.addEventListener("mouseout", this.onEmailHover.bind(this, false));

        this.main = document.querySelector("main");
        this.getCB = _getCB;
        this.getLetters();
        this.letterDOMS = [];
        this.currentIdx = 0;
        this.resetDOM();
    }

    resetDOM(){
        gsap.to(this.info, {rotation: -40, x: '-100%'});
        gsap.to(this.close, {rotation: 40, x: '100%'});
    }

    onSendHover(over){
        if(over){
            gsap.to(this.chat, {opacity: 1, duration: 0.3});
            this.form.classList.add('formContainer--hover')
        } else {
            gsap.to(this.chat, {opacity: 0, duration: 0.3});
            this.form.classList.remove('formContainer--hover')
        }
    }

    onCloseHover(over){
        if(over){
            this.form.classList.add('formContainer--hoverno')
        } else {
            this.form.classList.remove('formContainer--hoverno')
        }
    }
    onEmailHover(over){
        if(over){
            this.chat.classList.add('chat-email')
        } else {
            this.chat.classList.remove('chat-email')
        }
    }

    addLetterToDom(msgs) {
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
              this.postComplete();
              this.getCB(msg, false);
          })
          .catch((error) => {
            console.log(error);
          });
    }

    emptyForm(){
        this.form.elements["fname"].value = '';
        this.form.elements["femail"].value = '';
        this.form.elements["fmessage"].value='';
        this.main.classList.remove('active')
        this.chat.classList.remove('chat-thanks');
        this.chat.classList.remove('chat-error');
    }

    postComplete(){
        this.chat.classList.add('chat-thanks');
        this.resetDOM();
        gsap.to(this.form, {rotation: 10, y: "-150%", duration: 0.5, delay: 1, onComplete: ()=>{
            gsap.set(this.chat, {opacity: 0});
            this.emptyForm();
        }});
    }

    /*
    showOldLetter(idx){
        this.currentIdx = idx;
        this.main.classList.add('active')
        
        gsap.fromTo(
            this.letterDOMS[idx], 
            {rotation: -10, x: 0, y: "300%", opacity: 1}, 
            {rotation: -2,  x: 0, y: "15%", duration: 0.5}
        );
    }
     */

    onCloseLetter() {
       //let l = this.letterDOMS[this.currentIdx]; 
       this.resetDOM();
        gsap.to(
            this.form, 
            {rotation: 10, x: 0, 
                y: "300%", 
                opacity: 1, 
                duration: 0.8, 
                onComplete: ()=>{
                    this.main.classList.remove('active')
                    this.emptyForm();
                }
            }, 
        );
    }
   

    show(){
        this.main.classList.add('active')
        gsap.to(this.info, {rotation: 0, x: '0%', duration: 0.5, delay: 1});
        gsap.to(this.close, {rotation: 0, x: '0%', duration: 0.5, delay: 1});
        gsap.fromTo(
            this.form, 
            {rotation: -10, x: 0, y: "300%", opacity: 1}, 
            {rotation: -2,  x: 0, y: "15%", duration: 0.5}
        );
        gsap.fromTo(
            this.form, 
            {rotation: -10, x: 0, y: "300%", opacity: 1}, 
            {rotation: -2,  x: 0, y: "15%", duration: 0.5}
        );
    }

    validated(msg){
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(msg.data.email).toLowerCase());
    }

    onSubmit(e){
        e.preventDefault();
        let form = e.target;
        let name = form.elements["fname"].value;
        let email = form.elements["femail"].value;
        let message = form.elements["fmessage"].value;

        let msg = {
            id: email,
            data: {
                name: name,
                email: email,
                message: message,
            },
            hasPlayed: false,
            showOnShelf: true,
        }

        if(this.validated(msg)){
            this.chat.classList.remove('chat-error');
            this.postLetters(msg);
        } else {
            this.emailError();
        }
    }
    
    emailError(){
        this.chat.classList.add('chat-error');
    }

    setPos(pos){
        this.position = pos;
    }

    setSize(size){
        this.scale.set(size);
    }


}