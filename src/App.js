import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import {ITEMS, OTHERS} from './json/items';
import Bear from './components/Bear';
import Item from './components/Item';
import Form from './components/Form';
import Letter from './components/Letter';
import UI from './components/UI';
import {map} from './utils/math';
import { shadowVert, shadowFrag} from './components/glsl/shadow'
import { OldFilmFilter } from 'pixi-filters';


export default class App extends PIXI.Application {
    constructor(){
        super({
            width: window.innerWidth * 2,
            height: window.innerHeight,
            backgroundColor: 0xf6d9b1,
            resolution: 1,
            antialias: true,
        });

        document.body.appendChild(this.view);
        
        this.items = [];
        this.bears=[];
        this.mobile = window.innerWidth <= 768;
        this.letters = [];
        this.prevAnim = 0;
        this.currentItem = null;
        this.currentIdx = 0;

        this.ticker = PIXI.Ticker.shared;
        this.scenes = [new PIXI.Container(), new PIXI.Container()];
        this.objectLayer = new PIXI.Container();
     
        this.init();
        this.walkBear = this.walkBear.bind(this);
       
    }

    init() {
        this.stop();
       // window.addEventListener('resize', this.onResize.bind(this))
        this.setupWorld();
        this.getBears()
        this.initFilters();
        this.form = new Form(this.setupLetters.bind(this), this.sentLetter.bind(this));
    }

    initFilters(){
        this.shadowFilter = new PIXI.Filter(shadowVert, shadowFrag);
        this.shadowFilter.padding = 500;
        let vig = map(window.innerWidth, 764, 1400, 0, 0.3);
        this.oldFilmFilter = new OldFilmFilter({
            sepia: 0,
            noise: this.mobile ? 0 : .11,
            vignetting: vig,
            scratch: this.mobile ? 0 : .3,
          }, 0)

        this.scenes[0].filters = [this.oldFilmFilter]
        this.ticker.add(()=>{
            this.oldFilmFilter.seed = Math.random()
        })
        
    }

    setupWorld() {
        this.scenes.forEach(scene => {
            scene.width = this.renderer.width;
            scene.height = this.renderer.height;
            scene.x = 0;
            scene.y = 0;
            this.stage.addChild(scene)
        });
        this.scenes[0].addChild(this.objectLayer);
    }

    setupLetters(msgs, init){
        let _item = OTHERS[0];
        let pos = this.getPos(_item, 'itemPos');
        let size = this.getSize(_item.size);
        let color =  Math.random() * 0xFFFFFF;

        if(init === true){
            msgs.forEach((_msg,idx)=>{
                let l = new Letter(_item, pos, size, idx, color, _msg, this.openLetter.bind(this)); 
                this.letters.push(l);
                this.form.addLetterToDom(_msg);
            })
        } else {
            let _idx = this.letters.length;
            let l = new Letter(_item, pos, size, _idx, color, msgs, this.openLetter.bind(this));
            this.letters.push(l);
            !this.mobile && l.addShadow();
            this.objectLayer.addChild(l);
            this.form.addLetterToDom(msgs);
        }
    }

    sentLetter(){
        this.bears[0].bear.interactive = false;
        this.walkBear(99);
        this.bears[0].hint.alpha = 0;
    }

    openLetter(idx){
       this.form.showOldLetter(idx);
    }

      //0: bed 1: guitar 2:computer 4:pizza
    getStartIdx(){
        // let idx = 0;
        // let h = new Date().getHours();

        // if (h >= 9 && h < 11){
        //    idx = 2; 
        // } else if (h >= 11 && h < 14){
        //     idx = 2; 
        // } else if (h >= 14 && h < 18){
        //     idx = 4;
        // } else if (h >= 18 && h < 20){
        //     idx = 2;
        // } else if (h >= 20 && h < 22){
        //     idx = 1;
        // } else {
        //     idx = 0;
        // }

        return 7;
    }

    getBears() {
        this.loader.add('bears', './assets/bear/bear.json').load(this.onStephenLoaded.bind(this));
    }
    onStephenLoaded(loader, res) {
        this.stephen = new Bear(
            res.bears.spineData,
            this.animate.bind(this),
            this.sendLove.bind(this),
            this.mobile,
        );
        this.bears.push(this.stephen);
        this.loader.add('chewy', './assets/bear/chewy.json').load(this.onChewyLoaded.bind(this));
    }
    onChewyLoaded(loader, res) {
        this.chewy = new Bear(
            res.bears.spineData,
            this.animate.bind(this),
            this.sendLove.bind(this),
            this.mobile,
        );
        this.bears.push(this.chewy);

        this.bears.forEach((bear=>{
            bear.filters = !this.mobile && [this.shadowFilter];
        }))
        
        this.getAsset();
    }
        
    getAsset() {
        ITEMS.forEach((_item,idx) => {
            let pos = this.getPos(_item, 'itemPos');
            let size = this.getSize(_item.size);
            let item = new Item(_item, pos, size, idx, this.walkBear, this.subAssetsLoaded.bind(this));
            if(_item.subAssetsName){
                this.loader.add('seq', `assets/items/${_item.session}/${_item.subAssetsName}.json`).load(item.loadSubAssets);
            }
            this.items.push(item);
        })
    }

    subAssetsLoaded() {
        this.updateSession(ITEMS[this.getStartIdx()])
      
        this.checkReachedItem(true)
        this.bears[0].setPos(this.getCurAvatarPos()); 
        this.bears[0].setSize(this.getSize(0.3)); 
        this.items.forEach(_item => {
            !this.mobile && _item.addShadow();
            this.objectLayer.addChild(_item);
        });
        this.letters.forEach(_item => {
            !this.mobile && _item.addShadow();
            this.objectLayer.addChild(_item);
        });
        this.scenes[0].addChild(this.bears[0]);
        this.UI = new UI(this.scenes[0]);
        this.updateShadow(false);
        this.start();
    }

    updateShadow(walk){
        if (!this.mobile){
            if (walk){
                this.shadowFilter.uniforms.shadowDirection = [0, -0.3]
                this.ticker.add(this.shadowTicker, this);
            } else if (this.currentIdx === 99){
                this.ticker.remove(this.shadowTicker, this);
                 let shadowY = this.getCurAvatarPos().y + this.getShadowY(OTHERS[1].avatarShadowY);
                 this.shadowFilter.uniforms.floorY =  shadowY;
            } else { 
                this.ticker.remove(this.shadowTicker, this);
                let shadowY = this.getCurAvatarPos().y + this.getShadowY(this.currentItem.avatarShadowY);
                this.shadowFilter.uniforms.shadowDirection = this.currentItem.avatarShadowDir;
                this.shadowFilter.uniforms.floorY =  shadowY;
            };
        }
    }

    updateSession(item){
        this.items.forEach( (_item, _idx) => {
           if (_item.name === item.session) {
                this.currentItem = _item;
                this.currentIdx = _idx;
           }
        });
    }

    setActiveScene(idx){
        this.scenes.forEach((_scene, _idx)=>{
            let active = _idx === idx; 
            _scene.alpha = active;
            _scene.children.forEach(child =>{
                child.setActive(active);
            })
        });
    }

    walkBear(idx){
        this.updateShadow(true);
        this.toggleItemAnim(1);
        this.prevAnim = 0;
        if(idx === 99) {
            this.currentIdx = idx;
            this.bears[0].move(this.getPos(OTHERS[1], 'avatarPos'), this.playhug.bind(this));
        } else {
            this.updateSession(ITEMS[idx]);
            this.bears[0].move(this.getPos(this.currentItem, 'avatarPos'), this.checkReachedItem.bind(this))
        }
    }

    // openDoor(){
    //     this.setActiveScene(1);
    // }
    
    toggleItemAnim(val){
        this.currentItem.setActive(val);
        if (this.currentItem.interaction === 'fade'){
            gsap.to(this.currentItem, {alpha: val, duration: 0.2});    
        }
        if (this.currentItem.hasAnim === true){
            let fadeItem = this.items[this.currentIdx + 1];
            gsap.to(fadeItem, {alpha: val, duration: 0.2});  
            this.animate(val); 
        }
    }
    checkReachedItem(init){
        this.toggleItemAnim(0);
        this.bears[0].setCurrentAnim(this.currentItem.avatarAnim, init, true)
        this.bears[0].setHitArea(this.getCurAvatarPos(), this.currentItem.hitAreaOffset, this.getSize(1)); 
        this.updateShadow(false);
    }

    playhug(){
        this.items.forEach(_item=>{
            _item._item.interactive = false;
        });

        this.letters.forEach(_letter=>{
            _letter._item.interactive = false;
        })
        gsap.to(this.objectLayer, {alpha: 0, duration: 1.5, ease: "power2.out", onComplete: ()=>{
            this.bears[0].hug();
        }});   
    
        this.updateShadow();
        this.showHugPage();
    }


    showHugPage(){
        let hugPage = document.getElementById("hugPage");
        let hugMsgs = hugPage.querySelectorAll("h1");
        gsap.to(hugPage, {zIndex: 1});
        gsap.to(hugMsgs, {
            opacity: 1,
            ease: "power2.in",
            stagger: 1.5,
            delay: 5,
            onComplete: ()=>{
                setTimeout(()=>{ 
                    this.afterHug();
                }, 3000);
            }
        })
    }

    afterHug(){
        let hugPage = document.getElementById("hugPage");
        let hugMsgs = hugPage.querySelectorAll("h1");
        gsap.to(hugMsgs, {
            opacity: 0,
            ease: "power2.out",
            duration: 0.5,
            onComplete: ()=>{
                gsap.to(hugPage, {zIndex: 1});
            }
        })

        this.items.forEach(_item=>{
            _item._item.interactive = true;
        });

        this.letters.forEach(_letter=>{
            _letter._item.interactive = true;
        })

        gsap.to(this.objectLayer, {alpha: 1, duration: 1.5, ease: "power2.out", onComplete: ()=>{
            this.walkBear(this.getStartIdx());
            this.updateSession(ITEMS[this.getStartIdx()]);
        }});   
       
    }

    onResize() {
        this.mobile = window.innerWidth < 600;
        this.view.style.width = window.innerWidth;
        this.view.style.height = window.innerHeight;
    
        let vig = map(window.innerWidth, 764, 1400, 0, 0.3);
        this.oldFilmFilter.vignetting = vig
        this.renderer.resize(window.innerWidth, window.innerHeight)
        this.bears[0].setPos(this.getCurAvatarPos()); 
        this.bears[0].setSize(this.getSize(0.5));

        if(this.currentIdx !== 99){
            this.items.forEach(item => {
                let itemPos = this.getPos(item, 'itemPos');
                let itemSize = this.getSize(item.size);
                item.setPos(itemPos);
                item.setSize(itemSize);
                item.updateShadowY();
            });
            
            this.letters.forEach(item => {
                let pos = this.getPos(item, 'itemPos');
                let scale = this.getSize(item.size);
                item.setTransform(pos, scale, window.innerWidth)
                item.updateShadowY();
            });

            this.bears[0].setHitArea(this.getCurAvatarPos(), this.currentItem.hitAreaOffset,this.getSize(1));
        }

        this.updateShadow();
        
    }

    addItemShadow(dir, y){
        this.shadowFilter.uniforms.shadowDirection = dir;
        this.shadowFilter.uniforms.floorY = y;
    }

    animate(play) {
        if(this.currentItem.hasAnim) {
            switch(play) {
                case 0:
                    this.currentItem.play('active');    
                break;
                case 1:
                    this.currentItem.stop();
                break;
                case 2:
                    this.currentItem.play('active-look');
                break;
                default:
                    this.currentItem.play('active');
            }
        };
    }

    sendLove(){
       this.form.show();
    }

    shadowTicker() {
        this.shadowFilter.uniforms.floorY =  this.bears[0].bear.toGlobal(new PIXI.Point(0, 0)).y + this.getShadowY(0.2)
    }

    getCurAvatarPos(){
        let pos = this.currentIdx === 99 ? this.getPos(OTHERS[1], 'avatarPos') : this.getPos(this.currentItem, 'avatarPos');
        return pos
    }

    getPos(item, posName){
        if(this.mobile){
            return {
                x: this.renderer.width * item.mobilePos.x,
                y: this.renderer.height * item.mobilePos.y
            }
        } else {
            if (posName){
                return {
                    x: this.renderer.width * item[posName].x,
                    y: this.renderer.height * item[posName].y
                };
            } else {
                return {
                    x: this.renderer.width * item.x,
                    y: this.renderer.height * item.y
                }
            }
        } 
    }

    getShadowY(y){
        return this.bears[0].height * y;
    }

    getSize(size){
        let magicN = this.mobile ? 0.0011 : 0.0007;
        return this.renderer.width * size * magicN;
    }


}

