import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import {OTHERS} from '../json/items';
import Bear from './Bear';
import Item from './Item';
import { shadowVert, shadowFrag} from './glsl/shadow'

export default class BearScene extends PIXI.Container{
    constructor(bearData, name, ticker, size, helper, objectLayer, form){
        super();
        this.ticker = ticker;
        this.size = size;
        this.name = name;
        this.helper = helper;
        this.objectLayer = objectLayer;
        this.form = form;
        this.items = [];
        this.prevAnim = 0;
        this.currentItem = null;
        this.currentIdx = 0; 
        this.mobile = window.innerWidth < 600;
        
        this.walkBear = this.walkBear.bind(this);

        this.bear = new Bear(bearData, this.animate.bind(this), this.sendLove.bind(this), this.mobile);    
        this.bear.name = name;
    }

    loadItems(loader, rawItems){
        this.rawItems = rawItems;
        rawItems.forEach((_item,idx) => {
            let pos = this.helper.getPos(_item, 'itemPos');
            let size = this.helper.getSize(_item.size);
            let item = new Item(_item, pos, size, idx, this.walkBear.bind(this));
            if(_item.subAssetsName){
               loader.add('seq', `assets/items/${_item.session}/${_item.subAssetsName}.json`).load(item.loadSubAssets);
            }
            this.items.push(item);
        })
        
    }
    doneLoading(){
        this.items.forEach(_item=>{
            !this.mobile && _item.addShadow();
            this.objectLayer.addChild(_item);
        })
    
        this.initFilter();
        this.initSession(); 
    }

    initFilter(){
        this.shadowFilter = new PIXI.Filter(shadowVert, shadowFrag);
        this.shadowFilter.padding = 500;
        this.bear.filters = !this.mobile && [this.shadowFilter];
    }

    initSession() {
        this.updateSession(this.rawItems[this.getStartIdx()])
        this.checkReachedItem(true)
        let size = this.helper.getSize(this.size);
        this.bear.setTransform(this.getCurAvatarPos(), size); 
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
        //     idx 
        // } else {
        //     idx = 0;
        // }
        let n = this.name === 'stephen' ? 3 : 4;

        return n;
    }

    updateSession(item){
        this.items.forEach( (_item, _idx) => {
           if (_item.name === item.session) {
                this.currentItem = _item;
                this.currentIdx = _idx;
                this.currentBear = _item.scene;
           }
        });
    }

    walkBear(idx){
        this.updateShadow(true);
        this.toggleItemAnim(1);
        this.prevAnim = 0;
        if(idx === 99) {
            this.currentIdx = idx;
            let x = this.bear.bear.position.x < window.innerWidth/2 ? 
            this.helper.getPos(OTHERS[1], 'avatarPos') : this.helper.getPos(OTHERS[1], 'avatarPos2')
            this.bear.move(x, this.playhug.bind(this));
        } else {
            this.updateSession(this.rawItems[idx]);
            this.bear.move(this.helper.getPos(this.currentItem, 'avatarPos'), this.checkReachedItem.bind(this))
        }
    }
    
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
        this.bear.setCurrentAnim(this.currentItem.avatarAnim, init, true)
        this.bear.setHitArea(this.getCurAvatarPos(), this.currentItem.hitAreaOffset, this.helper.getSize(1)); 
        this.updateShadow(false);
    }

    playhug(){
        this.objectLayer.children.forEach(_child =>{
            _child._item.interactive = false;
        })

        gsap.to(this.objectLayer, {alpha: 0, duration: 1.5, ease: "power2.out", onComplete: ()=>{
            this.bear.hug();
        }});   
    
        this.updateShadow(false);
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

        this.objectLayer.children.forEach(_child =>{
            _child._item.interactive = false;
        })

        gsap.to(this.objectLayer, {alpha: 1, duration: 1.5, ease: "power2.out", onComplete: ()=>{
            this.walkBear(this.getStartIdx());
            this.updateSession(this.rawItems[this.getStartIdx()]);
        }});   
       
    }

    resize(mobile) {
        this.bear.setTransform(this.getCurAvatarPos(), this.helper.getSize(this.size));
        this.bear.setHitArea(this.getCurAvatarPos(), this.currentItem.hitAreaOffset, this.helper.getSize(1));

        if (mobile){

        }
        if(this.currentIdx !== 99){
            this.items.forEach(item => {
                let itemPos = this.helper.getPos(item, 'itemPos');
                let itemSize = this.helper.getSize(item.size);
                item.setPos(itemPos);
                item.setSize(itemSize);
                item.updateShadowY();
            });
            
        }
    }

    addItemShadow(dir, y){
        this.shadowFilter.uniforms.shadowDirection = dir;
        this.shadowFilter.uniforms.floorY = y;
    }

    shadowTicker() {
        let y = this.name === 'stephen' ? 0.2 : 0.1
        this.shadowFilter.uniforms.floorY =  this.bear.bear.toGlobal(new PIXI.Point(0, 0)).y + this.getShadowY(y)
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
                this.shadowTicker && this.ticker.remove(this.shadowTicker, this);
                let shadowY = this.getCurAvatarPos().y + this.getShadowY(this.currentItem.avatarShadowY);
                this.shadowFilter.uniforms.shadowDirection = this.currentItem.avatarShadowDir;
                this.shadowFilter.uniforms.floorY =  shadowY;
            };
        }
    }

    getShadowY(y){
        return this.bear.height * y;
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
       this.form.show(this.name);
    }

    getCurAvatarPos(){
        let pos = this.currentIdx === 99 ? this.helper.getPos(OTHERS[1], 'avatarPos') : this.helper.getPos(this.currentItem, 'avatarPos');
        return pos
    }
}

