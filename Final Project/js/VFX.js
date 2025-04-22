/*
Generating the visuals of an explosion.
*/

class VFX extends Globe{
    constructor(){
        super();

        this.size = 0;
        this.maxSize = random(75,100);
        this.animatingRate = 5;

        this.color ={
          r:250,
          g:0,
          b:0,
        }

        this.boom = true;
    }

    resetPosition(){//randomized position at the surface of the globe

        const theta = random(0, 2 * Math.PI);
        const z = random(-1, 1);
        const r_xy = Math.sqrt(1 - z * z);

        this.x = 300 * r_xy * Math.cos(theta);
        this.y = 300 * r_xy * Math.sin(theta);
        this.z = 300 * z;
    }

    bombVisual(){
        push();
            stroke(this.color.r,this.color.g,this.color.b);
            fill(255,100,0);
            translate(this.x, this.y, this.z);
            sphere(this.size);
        pop();
    }

    bombAnimation(){
        push();
            if( this.size < this.maxSize && this.size >= 0) {
                this.size += this.animatingRate;
            }else{
                this.size = 0;
                this.boom = false;
            }
        pop();
    }

}
