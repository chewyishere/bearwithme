import * as PIXI from 'pixi.js';
import { shadowVert, shadowFrag} from './glsl/shadow'
import { GlowFilter } from 'pixi-filters';

export default class Item extends PIXI.Container {
    constructor(item, pos, size, index, _tapcb) {
        super()
        Object.assign(this, item);
        this._item = PIXI.Sprite.from(`assets/items/${item.session}/${item.name}.png`);
        this._item.position = pos;
        this._item.scale.set(size)
        this.mobile = global.devicePixelRatio === 3;
        this.mobile && this.anchorMobile ? this._item.anchor.set(item.anchorMobile[0], item.anchorMobile[1]) : this._item.anchor.set(item.anchor[0], item.anchor[1])
        this._item.interactive = item.clickable;
        this._item.buttonMode = true;
        this.name = item.name;
        this.interaction = item.interaction;
        this.zIndex = item.zOrder;
        this.index = index;
        this.addChild(this._item);
        this.tapcb = _tapcb;
        this.play = this.play.bind(this);
        this.loadSubAssets = this.loadSubAssets.bind(this)
        this.setActive = this.setActive.bind(this);
        this.shadow = new PIXI.Filter(shadowVert, shadowFrag);
        this.glow = new GlowFilter();

        if(this.clickable){
            this._item.on('pointerover',this.onHover.bind(this, true));
            this._item.on('pointerout',this.onHover.bind(this, false));
            this._item.on('pointerdown',this.onClick.bind(this));
        }
    }

    addShadow(){
        this.shadow.padding = 200;
        this.shadow.uniforms.shadowDirection = this.itemShadowDir;
        this.updateShadowY();
        this.filters = [this.shadow];
    }

    onHover(over){
        this.filters = [this.shadow, over && this.glow];
    }

    updateShadowY(){
        this.shadow.uniforms.floorY  = this._item.toGlobal(new PIXI.Point(0, 0)).y + this._item.height * this.itemShadowY;
    }

    loadSubAssets(res) {
        let spineData = res.spineData;
        this.subAsset =  new PIXI.spine.Spine(spineData)
        this.subAsset.skeleton.setSkinByName('default') 
        this.subAsset.position = this._item.position;
        this.subAsset.alpha = 0;
        this.subAsset.scale = this._item.scale;
        this.subAsset.pivot.x = this.subAssetsOffset.x;
        this.addChild(this.subAsset);
    } 

    setAnchor(mobile){
        if(mobile && this.anchorMobile ) {
            this._item.anchor.set(this.anchorMobile[0], this.anchorMobile[1])
        } else{
            this._item.anchor.set(this.anchor[0], this.anchor[1])
        }

        if(this.subAsset) {
            this.subAsset.pivot.x = mobile ? 0 : this.subAssetsOffset.x;
        };
    }


    setPos(pos){
        this._item.position = pos;
        
        if(this.subAsset) {
            this.subAsset.position = pos
            this.subAsset.pivot.x = 0;
        };
    }

    setSize(size){
        this._item.scale.set(size);
        if(this.subAsset) {
            this.subAsset.scale.set(size);
        };
    }

    onClick(e) {
        this.tapcb(this.index);
    }

    setActive(active){
        this._item.interactive = active;
    }

    play(track){
        if(this.subAsset){
            this.subAsset.alpha = 1;
            this.subAsset.state.setAnimation(0, track, true);
        }
        
    }
    stop(){
        if(this.subAsset){
            this.subAsset.alpha = 0;
            this.subAsset.state.setAnimation(0, 'active-look', true);
        }
    }

    
}

