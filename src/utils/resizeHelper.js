export default class ResizeHelper {
    constructor(width, height, mobile){
         this.width = width;
         this.height = height;
         this.mobile = mobile
    }

    resize(width, height, mobile){
        this.width = width;
        this.height = height;
        this.mobile = mobile
    }

    getPos(item, posName, hug){
        if(this.mobile && !hug){
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

