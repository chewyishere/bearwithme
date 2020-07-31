import * as PIXI from 'pixi.js';
import './utils/SpinePreparer' 
import 'pixi-spine';
import gsap from "gsap";
import Draggable from "gsap/Draggable";
import App from './App'

gsap.registerPlugin(Draggable); 

new App()