import * as PIXI from 'pixi.js';
import { GlowFilter } from 'pixi-filters';
import gsap from 'gsap';

export default class Bear extends PIXI.Container {
    constructor(spineData, lookCB, loveCB) {
        super()

        this.bear = new PIXI.spine.Spine(spineData)
        this.bear.skeleton.setSkinByName('default') 
        this.zIndex = 1;
        this.bear.interactive = true;
        this.addChild(this.bear)

        this.currentAnim = 'walk';
        this.prevAnim = '';

        this.setupHitSqr();
        this.setupHint();

        this.lookCB = lookCB;
        this.loveCB = loveCB;
    }

    setupHitSqr() {
        this.hitSqr = new PIXI.Graphics(0,0,1,1);
        this.hitSqr.on('pointerover',this.look.bind(this));
        this.hitSqr.on('pointerdown', this.onClick.bind(this));
        this.hitSqr.on('pointerout', this.lookAway.bind(this));
        this.addChild(this.hitSqr)
    }

    setupHint(){
        this.mobile = window.innerWidth < 600;
        this.hint = this.mobile? new PIXI.Sprite.from(`assets/bear/hint_mobile.png`) : new PIXI.Sprite.from(`assets/bear/hint.png`);
        this.hint.scale.set(0.6);
        this.hint.anchor.x = 0.5;
        this.hint.anchor.y = 1.5;
        this.hint.alpha =  this.mobile ? 1 : 0;
        let glow = new GlowFilter();
        this.hint.filters = [glow];
        this.addChild(this.hint)
    }

    move(pos, _itemCB){
        this.hint.alpha = 0;
        this.setCurrentAnim('walk');
        gsap.to(this.bear.position, { x: pos.x, y:pos.y, duration: 1, 
            onComplete: () => {
                _itemCB();
            }
        });
    }

    setTransform(pos, size){
        this.bear.position = pos;
        this.bear.scale.set(size);
    }

    setHitArea(avatarPos, offsetSq, size){
        let x = avatarPos.x+offsetSq[0]*size;
        let y = avatarPos.y+offsetSq[1]*size;
        let w = offsetSq[2]*size;
        let h = offsetSq[3]*size;
        this.hitSqr.clear();
        this.hitSqr.beginFill(0xDE3249);
        this.hitSqr.alpha = 0;
        this.hitSqr.drawRect(x, y, w, h);
        this.hitSqr.endFill();
        this.hitSqr.interactive = true;

        this.hint.position.x = this.mobile ? window.innerWidth/2 : x + w/2;
        this.hint.position.y = this.mobile ? window.innerHeight - 10 : y;
    }

    setCurrentAnim(anim, init){
        if (typeof(anim) === 'string') {
            this.prevAnim = this.currentAnim;
            this.currentAnim = anim;
            if(!init){
                this.bear.stateData.setMix(anim, this.prevAnim, 0.1);
                this.bear.stateData.setMix(this.prevAnim, anim, 0.1);
            }
            if(anim === 'walk'){
                this.hitSqr.clear();
            }
            if(anim === 'hug'){
                this.bear.state.setAnimation(0, anim, false);
            } else {
                this.bear.state.setAnimation(0, anim, true);
            }
            
        }

        if(anim !== 'hug' && anim !== 'walk' && this.mobile){
            this.hint.alpha = 1;
        }
    }
    hug(){
        this.setCurrentAnim('hug', false, false);
    }

    look(){
        if(this.currentAnim !== 'walk' && this.currentAnim !== 'hug'){
            this.hint.alpha = 1;
            this.bear.stateData.setMix(this.currentAnim, this.currentAnim + '-look', 0.1);
            this.bear.stateData.setMix(this.currentAnim + '-look', this.currentAnim, 0.1);
            this.bear.state.setAnimation(0, this.currentAnim + '-look', true);
            this.lookCB(2);
        }
    }

    lookAway(){
        if(this.currentAnim !== 'walk' && this.currentAnim !== 'hug'){
            this.hint.alpha = 0;
            this.setCurrentAnim(this.currentAnim);
            this.lookCB(0);
        }
    }

    onClick(){
        if(this.currentAnim !== 'walk' && this.currentAnim !== 'hug'){
            this.loveCB();
        }
    }
}
