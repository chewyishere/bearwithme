export default class ResizeHelper {
    constructor(width, height){
         this.width = width;
         this.height = height;
         this.mobile = this.width / 2 <= 768;
    }

    resize(width, height){
        this.width = width;
        this.height = height;
        this.mobile = width / 2 <= 768;
    }

    getPos(item, posName){
        if(this.mobile){
            return {
                x: this.width * item.mobilePos.x,
                y: this.height * item.mobilePos.y
            }
        } else {
            if (posName){
                return {
                    x: this.width * item[posName].x,
                    y: this.height * item[posName].y
                };
            } else {
                return {
                    x: this.width * item.x,
                    y: this.height * item.y
                }
            }
        } 
    }

    getSize(size){
        let magicN = this.mobile ? 0.0011 : 0.0007;
        return this.width * size * magicN;
    }
}

