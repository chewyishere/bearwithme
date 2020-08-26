import gsap from 'gsap';
const axios = require('axios');
const apiPath = 'https://iot.dukefromearth.com/products/bearwithme'


export default class Form {
    constructor(_getCB, _sentCB) {
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
        this.sentCB = _sentCB;
        this.showingOldLetter = false;
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
        letterContainer.classList.add('oldLetter');
        main.appendChild(letterContainer);

        let msgField = document.createElement("p");
        msgField.classList.add('oldLetterText');
        msgField.innerHTML = msgs.data.message ? msgs.data.message : '...';
        letterContainer.appendChild(msgField);

        let nameField = document.createElement("p");
        nameField.classList.add('oldLetterName');
        nameField.innerHTML = msgs.data.name ? msgs.data.name : 'mystery person';
        letterContainer.appendChild(nameField);

        let locationField = document.createElement("p");
        locationField.classList.add('oldLetterLocation');
        locationField.innerHTML = msgs.data.location ? msgs.data.location : 'somewhere in the world';
        letterContainer.appendChild(locationField);

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
        this.main.classList.remove('active-form');
        this.main.classList.remove('active-letter')
        this.chat.classList.remove('chat-thanks');
        this.chat.classList.remove('chat-error');
    }

    postComplete(){
        this.chat.classList.add('chat-thanks');
        this.resetDOM();
        gsap.to(this.form, {rotation: 10, y: "-150%", duration: 0.5, delay: 1, onComplete: ()=>{
            gsap.set(this.chat, {opacity: 0});
            this.emptyForm();
            this.sentCB();
        }});
    }

    
    showOldLetter(idx){
        this.currentIdx = idx;
        this.main.classList.add('active-letter');
        this.showingOldLetter = true;
        gsap.fromTo(
            this.letterDOMS[idx], {
                rotation: 10, 
                x: 0,
                y: "-200%", 
                opacity: 1,
            }, 
            { 
                rotation: -10, 
                x: 0, 
                y: "20%", 
                duration: 1,
                ease: "power3.out",
            }
        );
    }

    hideOldLetter(){
        let l = this.letterDOMS[this.currentIdx]; 
        gsap.to(
            l, {
                rotation: 10, 
                x: 0, 
                y: "-200%", 
                opacity: 0, 
                duration: 0.75, 
                ease: "power3.in",
                onComplete: ()=>{
                    this.showingOldLetter = false;
                    this.main.classList.remove('active-letter')
                }
            }, 
        );
    }
     

    onCloseLetter() {
       if (this.showingOldLetter){
        this.hideOldLetter();
       } else {
        this.resetDOM();
        gsap.to(
            this.form, {
                rotation: 10, 
                x: 0, 
                y: "300%", 
                opacity: 1, 
                duration: 0.75, 
                ease: "power3.in",
                onComplete: ()=>{
                    this.main.classList.remove('active-form')
                    this.emptyForm();
                }
            }, 
        );
       }
    }
   

    show(){
        this.main.classList.add('active-form')
        gsap.to(this.info, {rotation: 0, x: '0%', duration: 0.5, delay: 1, ease: "power3.out",});
        gsap.to(this.close, {rotation: 0, x: '0%', duration: 0.5, delay: 1, ease: "power3.out",});
        gsap.fromTo(
            this.form, 
            {rotation: -10, x: 0, y: "300%", opacity: 1}, 
            {rotation: -2,  x: 0, y: "15%", duration: 1, ease: "power3.out"}
        );
    }

    validated(email){
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    onSubmit(e){
        e.preventDefault();
        let form = e.target;
        let name = form.elements["fname"].value;
        let email = form.elements["femail"].value;
        let message = form.elements["fmessage"].value;
        let location = form.elements["flocation"].value;

        let msg = {
            id: Date.now() + Math.floor(Math.random() * 100),
            data: {
                name: name,
                email: email,
                message: message,
                location: location,
            },
            hasPlayed: "false",
            showOnShelf: true,
        }

        if(msg.data.email === '' || this.validated(msg.data.email)){
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