import * as PIXI from 'pixi.js';
export default class Item extends PIXI.Container {
    constructor(item, pos, size, index, _tapcb, _loadcb) {
        super()
        Object.assign(this, item);
        this._item = PIXI.Sprite.from(`assets/items/${item.session}/${item.name}.png`);
        this._item.position = pos;
        this._item.scale.set(size)
        this._item.anchor.set(item.anchor)
        this._item.interactive = true;
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
        this.loadCB = _loadcb;

        if(this.clickable){
            this._item.on('pointerdown',this.onClick.bind(this));
        }
    }

    loadSubAssets(loader, res) {
        let spineData = res.seq.spineData;
        this.subAsset =  new PIXI.spine.Spine(spineData)
        this.subAsset.skeleton.setSkinByName('default') 
        this.subAsset.position = this._item.position;
        this.subAsset.alpha = 0;
        this.subAsset.scale = this._item.scale;
       // this.subAsset.scale.set(this._item.scale)
        this.addChild(this.subAsset);
        this.loadCB();
    }
    setPos(pos){
        this._item.position = pos;
        if(this.subAsset) {
            this.subAsset.position = pos
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
        console.log(this.name + ' is playing:' + track)
        console.log(this.subAsset)
        if(this.subAsset){
            this.subAsset.alpha = 1;
            this.subAsset.state.setAnimation(0, track, true);
        }
        
    }
    stop(){
        console.log(this.name + 'stops')
        if(this.subAsset){
            this.subAsset.alpha = 0;
            this.subAsset.state.setAnimation(0, 'active-look', true);
        }
    }

    
}

