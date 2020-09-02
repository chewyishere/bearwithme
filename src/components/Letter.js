import * as PIXI from 'pixi.js';
import {map} from '../utils/math';
import { debounce } from "debounce";

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

        let name = content.data.name ? content.data.name : content.data.firstName ? content.data.firstName : '?';

        this._initial = new PIXI.Text(name.charAt(0));
        this._initial.anchor.set(0.5)
        this._initial.style.fontSize = 20;

        this.tapcb = _tapcb;

        this._item.interactive = true;
        this._item.on('pointerdown',debounce(this.onClick.bind(this),200));
            
        this.setTransform(pos, size, window.innerWidth);
        this.addChild(this._item);
        this.addChild(this._stamp);
        this.addChild(this._initial);
    }


    setTransform(pos,scale, w){
        let offsetY = w < 600 ? map(w, 300, 600, 10, 15) : map(w, 764, 1300, 15, -5);
        
        let rowNum = 10;
        let letterW = map(rowNum, 6, 15, 160, 40) * scale;
        let disX = this.index > rowNum * 2 ? (this.index - rowNum * 2 - 1)* letterW : this.index > rowNum ? (this.index - rowNum - 1 )*letterW : this.index * letterW;
        let disY = this.index > rowNum * 2 ? 700 * scale * 2: this.index > rowNum ? 710 * scale : 5;
        let row = pos.y + disY + offsetY;
        
        let fs = w < 600 ? map(w, 300, 600, 9, 14) : map(w, 764, 1300, 14, 20);
        this._initial.style.fontSize = fs;

        this._item.scale.set(scale);
        this._item.position.x = pos.x + disX;
        this._item.position.y = row;

        this._stamp.scale.set(scale);
        this._stamp.position.x = pos.x + 450 * scale / 2 + disX;
        this._stamp.position.y = row + 291 * scale / 2 + 2;

        this._initial.position.x =  this._stamp.position.x;
        this._initial.position.y =  this._stamp.position.y - 0.5;
    }

    onClick(e) {
        this.tapcb(this.index);
    }
}

