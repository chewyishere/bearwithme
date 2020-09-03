import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import {ITEMS_S, ITEMS_C, OTHERS} from './json/items';
import Form from './components/Form';
import Letter from './components/Letter';
import UI from './components/UI';
import ResizeHelper from './utils/resizeHelper'
import {map} from './utils/math';
import { shadowVert, shadowFrag} from './components/glsl/shadow'
import { OldFilmFilter } from 'pixi-filters';
import BearScene from './components/BearScene';


export default class App extends PIXI.Application {
    constructor(){
        super({
            width: window.innerWidth * 2,
            height: window.innerHeight,
            backgroundColor: 0xf6d9b1,
            resolution: 1,
            antialias: true,
            transparent: true
        });

        document.body.appendChild(this.view);
        this.baseW = window.innerWidth;
        
        this.letters = [];
        this.ticker = PIXI.Ticker.shared;
        this.currentBear = 0;
        this.scene = new PIXI.Container();
        this.objectLayer = new PIXI.Container();
        this.mobile = window.innerWidth < 600;
        this.stage.addChild(this.scene);
        this.scene.addChild(this.objectLayer);
        this.helper = new ResizeHelper(this.renderer.width, this.renderer.height, this.mobile);
        this.init();

        this.openLetter = this.openLetter.bind(this);
        this.allAssetsLoaded = this.allAssetsLoaded.bind(this)
        this.afterHug = this.afterHug.bind(this)
    }

    init() {
        this.stop();
        window.addEventListener('resize', this.onResize.bind(this))
        this.setScene();
        this.getBears()
       this.initFilters();
       this.form = new Form(this.setupLetters.bind(this), this.sentLetter.bind(this));
       this.UI = new UI(this.scene);
    }

    setScene() {
        this.scene.width = this.renderer.width;
        this.scene.height = this.renderer.height;
        this.scene.x = 0;
        this.scene.y = 0;
    }

    getBears() {
        this.loader.add('bears', './assets/bear/bear.json')
                .add('chewy', './assets/bear/chewy.json');
        this.loader.load(this.onBearsLoaded.bind(this));
    }
    onBearsLoaded(loader, res) {
        this.chewy = new BearScene(res.chewy.spineData, 'chewy', this.ticker, 0.35, this.helper, this.objectLayer, this.form, this.afterHug, this.updateMusic.bind(this));
        this.stephen = new BearScene(res.bears.spineData, 'stephen', this.ticker, 0.29, this.helper, this.objectLayer, this.form, this.afterHug, this.updateMusic.bind(this));
        this.chewy.loadItems(this.loader, ITEMS_C, ()=>{
            this.stephen.loadItems(this.loader, ITEMS_S, ()=>{
                this.allAssetsLoaded();
            })
        })  
    }

    allAssetsLoaded(){
        this.chewy.doneLoading();
        this.stephen.doneLoading();
        this.scene.addChild(this.chewy.bear);
        this.scene.addChild(this.stephen.bear);
        this.letters.forEach(_item => {
            this.objectLayer.addChild(_item);
        });
        this.onResize()
        this.start();
        this.UI.loadingComplete();
    }
    
    setupLetters(msgs, init){
        let _item = OTHERS[0];
        let pos = this.helper.getPos(_item, 'itemPos');
        let size = this.helper.getSize(_item.size);
        let color =  Math.random() * 0xFFFFFF;

        if(init === true){
            let idx = -1;
            msgs.forEach((_msg)=>{
                if(_msg.id !== 'empty' && _msg.data.message !== ''){
                    idx ++;
                    let l = new Letter(_item, pos, size, idx, color, _msg, this.openLetter); 
                    this.letters.push(l);
                    this.form.addLetterToDom(_msg);
                }
            })
        } else {
            let _idx = this.letters.length;
            let l = new Letter(_item, pos, size, _idx, color, msgs, this.openLetter);
            this.letters.push(l);
            this.objectLayer.addChild(l);
            this.form.addLetterToDom(msgs);
        }
    
    }

    sentLetter(){
        if(this.form.forBear === 'stephen'){
            gsap.to(this.chewy.bear, {alpha: 0, duration: 1.5, ease: "power2.out" });   
            this.stephen.bear.interactive = false;
            this.stephen.bear.hint.alpha = 0;
            this.stephen.walkBear(99);
            gsap.to(this.objectLayer, {alpha: 0, duration: 3, ease: "power2.out" });
        } else {
            gsap.to(this.stephen.bear, {alpha: 0, duration: 1.5, ease: "power2.out" });   
            this.chewy.bear.interactive = false;
            this.chewy.bear.hint.alpha = 0;
            this.chewy.walkBear(99);
            gsap.to(this.objectLayer, {alpha: 0, duration: 3, ease: "power2.out"});
        }
        
        this.objectLayer.children.forEach(_child =>{
            _child._item.interactive = false;
        })

        gsap.to(this.UI.next, {alpha: 0, duration: 3, ease: "power2.out"});
        
    }

    afterHug(){
        gsap.to(this.UI.next, {alpha: 1, duration: 3, ease: "power2.out"});
        if(this.form.forBear === 'stephen'){
            gsap.to(this.chewy.bear, {alpha: 1, duration: 1, delay: 2.5, ease: "power2.out" });   
        } else {
            gsap.to(this.stephen.bear, {alpha: 1, duration: 1, delay: 2.5, ease: "power2.out" });   
        }
    }

    updateMusic(song){
        this.UI.switchMusic(song);
    }

    openLetter(idx){
       this.form.showOldLetter(idx);
    }

    initFilters(){
        this.shadowFilter = new PIXI.Filter(shadowVert, shadowFrag);
        this.shadowFilter.padding = 500;
        let vig = map(window.innerWidth, 764, 1400, 0, 0.3);
        this.oldFilmFilter = new OldFilmFilter({
            sepia: 0,
            noise: this.mobile ? 0 : .11,
            vignetting: vig,
            scratch: this.mobile ? 0 : .3,
          }, 0)

        this.scene.filters = [this.oldFilmFilter]
        this.ticker.add(()=>{
            this.oldFilmFilter.seed = Math.random()
        })
    }
    
    onResize() {
        let w = window.innerWidth;
        let h = window.innerHeight;
        this.mobile = w < 600;
        this.renderer.resize(w * 2, h)
        
        this.view.style.width = w * 2;
        this.view.style.height = h;
    
        let vig = map(w, 764, 1400, 0, 0.3);
        this.oldFilmFilter.vignetting = vig

        this.helper.resize(this.renderer.width, h, this.mobile)
        this.scene.position.x = this.UI.on2ndPage ? -w : 0;

        this.chewy.resize(this.mobile);
        this.stephen.resize(this.mobile)

        this.letters.forEach(item => {
            let pos = this.helper.getPos(item, 'itemPos');
            let scale = this.helper.getSize(item.size);
            item.setTransform(pos, scale, w)
        });  

    }

}

