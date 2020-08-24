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

        this.bear.interactive = true;
        this.currentAnim = 'walk';
        this.prevAnim = '';

        this.hitSqr = new PIXI.Graphics(0,0,1,1);
        this.addChild(this.hitSqr)
        this.glowFilter = new GlowFilter();
        this.hitSqr.on('pointerover',this.look.bind(this));
        this.hitSqr.on('pointerdown', this.onClick.bind(this));
        this.hitSqr.on('pointerout', this.lookAway.bind(this));

        this.hint = new PIXI.Sprite.from(`assets/bear/hint.png`);
        this.hint.scale.set(0.6);
        this.hint.anchor.x = 0.5;
        this.hint.anchor.y = 1.5;
        this.hint.alpha = 0;
        this.addChild(this.hint)

        this.lookCB = lookCB;
        this.loveCB = loveCB;
    }

    move(pos, _itemCB){
        this.setCurrentAnim('walk');
        gsap.to(this.bear.position, { x: pos.x, y:pos.y, duration: 1, 
            onComplete: () => {
                _itemCB();
            }
        });
    }

    setPos(pos){
        this.bear.position = pos;
    }

    setSize(size){
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
        this.hint.position.x = x + w/2;
        this.hint.position.y = y;
    }

    setCurrentAnim(anim, init){
        if (typeof(anim) === 'string') {
            this.prevAnim = this.currentAnim;
            this.currentAnim = anim;
            if(!init){
                this.bear.stateData.setMix(anim, this.prevAnim, 0.1);
                this.bear.stateData.setMix(this.prevAnim, anim, 0.1);
            }
            this.bear.state.setAnimation(0, anim, true);
        }
    }

    look(){
        if(this.currentAnim !== 'walk'){
            this.hint.alpha = 1;
            this.hint.filters = [this.glowFilter];
            this.bear.stateData.setMix(this.currentAnim, this.currentAnim + '-look', 0.1);
            this.bear.stateData.setMix(this.currentAnim + '-look', this.currentAnim, 0.1);
            this.bear.state.setAnimation(0, this.currentAnim + '-look', true);
            this.lookCB(2);
        }
    }

    lookAway(){
        if(this.currentAnim !== 'walk'){
            this.hint.alpha = 0;
            this.hint.filters = [];
            this.setCurrentAnim(this.currentAnim);
            this.lookCB(0);
        }
    }

    onClick(){
        this.loveCB();
    }

}
