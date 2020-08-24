import * as PIXI from 'pixi.js';
import { shadowVert, shadowFrag} from './glsl/shadow'

export default class Music extends PIXI.Container {
    constructor(item, pos, size) {
        super()
        Object.assign(this, item);
       // this._item = PIXI.Sprite.from(`assets/items/letters/letter.png`);
       const tStyle = new PIXI.TextStyle({
            fontSize: 50,
        });
        this._item = new PIXI.Text('music box here', tStyle);
        this._item.anchor.set(item.anchor)
        this._item.buttonMode = true;
        this.sound = document.getElementById("music");
        this.sound.volume = 0.4;

        this.soundBTN = document.getElementById("musicCTA");
        this.isPlaying = true;
    
        this.shadow = new PIXI.Filter(shadowVert, shadowFrag);

       
        this.sound = document.getElementById("music");
        
        this._item.on('pointerdown',this.toggleMusic.bind(this));
        this._item.interactive = true;
        this.setTransform(pos, size);
        
        this.addShadow();
        this.addChild(this._item);
        this.sound.play();
       
    }

    addShadow(){
        this.shadow.padding = 100;
        this.shadow.uniforms.shadowDirection = 10;
        this.updateShadowY();
        this.filters = [this.shadow];
    }

    updateShadowY(){
        this.shadow.uniforms.floorY  = this._item.toGlobal(new PIXI.Point(0, 0)).y + this._item.height * this.itemShadowY;
    }

    setTransform(pos,scale){
        this._item.position = pos;
        this._item.scale.set(scale);
    }

    toggleMusic(){
        this.sound.muted = this.isPlaying;
        this.isPlaying = !this.isPlaying;
    }
    
}

