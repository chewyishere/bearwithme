import * as PIXI from 'pixi.js';
import gsap from 'gsap';

export default class Bear extends PIXI.Container {
    constructor(spineData, scale, pos, lookCB) {
        super()

        this.bear = new PIXI.spine.Spine(spineData)
        this.bear.skeleton.setSkinByName('default') 
        this.zIndex = 1;

        this.bear.position = pos;
        this.bear.scale.set(scale)
        this.bear.interactive = true;

        this.addChild(this.bear)

        this.bear.interactive = true;
        this.currentAnim = 'walk';
        this.prevAnim = '';

        this.hitSqr = new PIXI.Graphics(0,0,1,1);
        this.addChild(this.hitSqr)

        this.hitSqr.on('pointerover',this.look.bind(this));
        this.hitSqr.on('pointerout', this.lookAway.bind(this));
        this.lookCB = lookCB;

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

    setHitArea(avatarPos, offsetSq){
        this.hitSqr.clear();
        this.hitSqr.beginFill(0xDE3249);
        this.hitSqr.alpha = 0;
        this.hitSqr.drawRect(avatarPos.x+offsetSq[0], avatarPos.y+offsetSq[1], offsetSq[2], offsetSq[3]);
        this.hitSqr.endFill();
        this.hitSqr.interactive = true;
    }

    setCurrentAnim(anim){
        if (typeof(anim) === 'string') {
            this.prevAnim = this.currentAnim;
            this.currentAnim = anim;
            this.bear.stateData.setMix(anim, this.prevAnim, 0.1);
            this.bear.stateData.setMix(this.prevAnim, anim, 0.1);
            this.bear.state.setAnimation(0, anim, true);
        }
    }

    look(){
        if(this.currentAnim !== 'walk'){
            this.bear.stateData.setMix(this.currentAnim, this.currentAnim + '-look', 0.1);
            this.bear.stateData.setMix(this.currentAnim + '-look', this.currentAnim, 0.1);
            this.bear.state.setAnimation(0, this.currentAnim + '-look', true);
            this.lookCB(2);
        }
    }

    lookAway(){
        if(this.currentAnim !== 'walk'){
            this.setCurrentAnim(this.currentAnim);
            this.lookCB(0);
        }
    }

}
