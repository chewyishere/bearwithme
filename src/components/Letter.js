import * as PIXI from 'pixi.js';
import { shadowVert, shadowFrag} from './glsl/shadow'

export default class Letter extends PIXI.Container {
    constructor(item, pos, size, index, color, content, _tapcb) {
        super()
        Object.assign(this, item);
        this._item = PIXI.Sprite.from(`assets/items/letters/letter.png`);
        this._item.anchor.set(item.anchor)
        this._item.buttonMode = true;
        this.index = index;
        this.color = color;
        this.content = content;
        
        this._stamp = PIXI.Sprite.from(`assets/items/letters/stamp.png`);
        this._stamp.anchor.set(0.5)

        let name = content.data.name ? content.data.name : content.data.firstName;

        this._initial = new PIXI.Text(name.charAt(0));
        this._initial.anchor.set(0.5)
        this._initial.style.fontSize = 20;

        this.tapcb = _tapcb;
        this.play = this.play.bind(this);
        this.shadow = new PIXI.Filter(shadowVert, shadowFrag);

        // this._item.on('pointerdown',this.onClick.bind(this));
       // this._item.interactive = true;
        this.setTransform(pos, size);
        this.addChild(this._item);
        this.addChild(this._stamp);
        this.addChild(this._initial);

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
        let rowNum = 6;
        let disX = this.index > rowNum * 2 ? (this.index - rowNum * 2 - 1) : this.index > rowNum ? (this.index - rowNum - 1 )* 23 : this.index * 23;
        let disY = this.index > rowNum * 2 ? 700 * scale * 2 - 8 : this.index > rowNum ? 700 * scale : 5;
        let row = pos.y + disY;

        this._item.scale.set(scale);
        this._item.position.x = pos.x + disX;
        this._item.position.y = row;

        this._stamp.scale.set(scale);
        this._stamp.position.x = pos.x + 450 * scale / 2 + disX;
        this._stamp.position.y = row + 291 * scale / 2 + 2;

        this._initial.position.x =  this._stamp.position.x - 1;
        this._initial.position.y =  this._stamp.position.y - 1;
    }

    onClick(e) {
        this.tapcb(this.index);
    }

    play(){
        console.log('play animation?')
    }
    stop(){
        
    }
    
}

