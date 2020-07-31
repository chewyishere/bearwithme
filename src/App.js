import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import {ITEMS} from './json/items';
import Bear from './components/Bear';
import Item from './components/Item';

export default class App extends PIXI.Application {
    constructor(){
        super({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0xf6d9b1,
        });
        document.body.appendChild(this.view);

        this.items = [];
        this.prevAnim = 0;
        this.currentItem = {};

        this.ticker = PIXI.Ticker.shared;
        this.scenes = [new PIXI.Container(), new PIXI.Container()];
        this.init();

        this.getBear = this.getBear.bind(this);
        this.walkBear = this.walkBear.bind(this);
    }

    init() {
        window.addEventListener('resize', this.onResize.bind(this))
        this.setupWorld();
        this.getBear()
    }

    setupWorld() {
        this.scenes.forEach(scene => {
            scene.width = this.renderer.width;
            scene.height = this.renderer.height;
            scene.x = 0;
            scene.y = 0;
            this.stage.addChild(scene)
        });
    }
    getStartIdx(){
        let idx = 5;
        let h = new Date().getHours();
        if(h < 9){
        } else if (h >= 9 || h < 12){
           return idx + 3;
        } else if (h >= 12 || h < 14){
            return idx + 2;
        } else if (h >= 14 || h < 19){
            return idx + 3;
        } else if (h >= 19 || h < 21){
            return idx + 2;
        } else {
            return idx + 1;
        }
    }

    getBear() {
        this.loader.add('bears', './assets/bear/bear.json').load(this.onBearLoaded.bind(this));
    }
    onBearLoaded(loader, res) {
        this.bear = new Bear(
            res.bears.spineData,
            this.animate.bind(this)
        );
       // this.view.addEventListener('tap', this.openDoor.bind(this));
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
       // this.setActiveScene(0);
        this.updateSession(ITEMS[this.getStartIdx()])
        this.checkReachedItem(true)
        this.bear.setPos(this.getCurAvatarPos()); 
        this.bear.setSize(this.getSize(0.5)); 
        this.stage.addChild(this.bear) 
        this.items.forEach(_item => {
            this.scenes[_item.scene].addChild(_item);
        });
    }

    // openDoor(e) {
    //     if (directions.left && this.onView < 1) {
    //         this.onView += 1;
    //         gsap.to(this.view, {x: -x, duration: 1.2, ease: "elastic.out(0.7, 0.6)"});
    //     }
        
    //     if (directions.right && this.onView > 0) {
    //         this.onView -= 1;
    //         gsap.to(this.view, {x: -x, duration: 1.2, ease: "elastic.out(0.7, 0.6)"});
    //     }
    // }

    getPos(item, posName){
        let pos = {
            x: this.renderer.width * item[posName].x,
            y: this.renderer.height * item[posName].y
        };
        return pos;
    }

    getSize(size){
        return this.renderer.width * size * 0.0007;
    }

    updateSession(item){
        this.items.forEach( (_item, _idx) => {
           if (_item.name === item.session) {
                this.currentItem = {
                    idx: _idx,
                    session: _item,
                };
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
        if(idx === 2) {
           this.openDoor();
        } else {
            this.toggleItemAnim(1);
            this.prevAnim = 0;
            this.updateSession(ITEMS[idx]);
            this.bear.move(this.getPos(this.currentItem.session, 'avatarPos'), this.checkReachedItem.bind(this))
        }
    }

    openDoor(){
        this.setActiveScene(1);
    }
    
    toggleItemAnim(val){
        this.currentItem.session.setActive(val);
        if (this.currentItem.session.interaction === 'fade'){
            gsap.to(this.currentItem.session, {alpha: val, duration: 0.2});    
        }
        if (this.currentItem.session.hasAnim === true){
            let fadeItem = this.items[this.currentItem.idx + 1];
            gsap.to(fadeItem, {alpha: val, duration: 0.2});  
            this.animate(val); 
        }
    }
    checkReachedItem(init){
        this.toggleItemAnim(0);
        this.bear.setCurrentAnim(this.currentItem.session.avatarAnim, init)
        this.bear.setHitArea(this.getCurAvatarPos(), this.currentItem.session.hitAreaOffset); 
    }

    getCurAvatarPos(){
        return this.getPos(this.currentItem.session, 'avatarPos');
    }

    onResize() {
        if(window.innerWidth > 1024 && window.innerWidth < 1900){
        this.renderer.resize(window.innerWidth, window.innerHeight)
        this.bear.setPos(this.getCurAvatarPos()); 
        this.bear.setSize(this.getSize(0.5)); 
        this.items.forEach(item => {
            let itemPos = this.getPos(item, 'itemPos');
            let itemSize = this.getSize(item.size);
            item.setPos(itemPos);
            item.setSize(itemSize);
        });
        this.bear.setHitArea(this.getCurAvatarPos, this.currentItem.session.hitAreaOffset);
        }
    }

    animate(play) {
        if(this.currentItem.session.hasAnim) {
            switch(play) {
                case 0:
                    this.currentItem.session.play('active');    
                break;
                case 1:
                    this.currentItem.session.stop();
                break;
                case 2:
                    this.currentItem.session.play('active-look');
                break;
                default:
                    this.currentItem.session.play('active');
            }
        };
    }

}

