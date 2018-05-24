
/**
 * Vector class, used for position and velocity
 */
class Vector{
    constructor(x,y){
        this.vector = [x,y];
    }
    plus(vector2){
        this.vector[0] += vector2.vector[0];
        this.vector[1] += vector2.vector[1];
    }
}

/**
 * Actor has properties:
 *   --pos [Vector]
 *   --vel [Vector]
 *   --height [Number]
 *   --width [Number]
 *   --color [String]
 */
class Actor{
    constructor(w,h,velx,vely){
        this.startpos = new Vector(0,0);
        this.pos = new Vector(0,0);
        this.vel = new Vector(velx,vely) || [0,0];
        this.height = h || 0;
        this.width = w || 0;
        this.color = 'red';
        this.drawColor = 'red';
        this.mworld = world1;
        this.shear = 0;
    }
    move(){
        this.pos.plus(this.vel);
    }
    draw(){
        ctx.fillStyle = this.drawColor;
        ctx.fillRect(this.pos.vector[0],this.pos.vector[1],this.width,this.height);
    }
    collidesWith(obj){
        /**positions array contains (in order):
         * -upper left corner
         * -upper right corner
         * -lower left
         * -lower right
         * -center
        */
        let positions = [
            [this.pos.vector[0] + 1 + this.shear,  this.pos.vector[1] + 1],
            [this.pos.vector[0]+this.width - 1 + this.shear ,  this.pos.vector[1] + 1],
            [this.pos.vector[0] + 1 ,  this.pos.vector[1]+this.height - 1],
            [this.pos.vector[0]+this.width - 1 ,  this.pos.vector[1] + this.width - 1],
            [this.pos.vector[0] + this.width/2  ,  this.pos.vector[1] + this.height/2]
        ],
        xcollides = false,
        ycollides = false;

        let ulo = [obj.pos.vector[0] + 2 - this.mworld.xpos,  obj.pos.vector[1] + 2 - this.mworld.ypos];
        let uro = [obj.pos.vector[0]+obj.width - 2 - this.mworld.xpos,  obj.pos.vector[1] + 2 - this.mworld.ypos];
        let llo = [obj.pos.vector[0] + 2 - this.mworld.xpos,  obj.pos.vector[1]+obj.height - 2 - this.mworld.ypos];
        let lro = [obj.pos.vector[0]+obj.width - 2 - this.mworld.xpos ,  obj.pos.vector[1] + obj.width - 2 - this.mworld.ypos];
        for(let i = 0; i < positions.length; i++){
            if(positions[i][0] > ulo[0] && positions[i][0] < uro[0]){
                xcollides = true;
            }
            if(positions[i][1] > ulo[1] && positions[i][1] < llo[1]){
                ycollides = true;
            }
        }

        return(xcollides&&ycollides);
    }
}

//HERE WE DEFINE THE ACTOR CLASSES
//--------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------

class StillLava extends Actor{
    constructor(w,h,mworld){
        super(w,h,0,0);
        this.color = 'red';
        this.drawcolor = 'red';
    }
    playerCol(player){
        if(player.color != "#FF3333"){
            player.health -= 1;
            player.color = '#FF3333';
        }
    }
    draw(){
        ctx.fillStyle = this.drawColor;
        ctx.fillRect(this.pos.vector[0] - this.mworld.xpos,this.pos.vector[1] - this.mworld.ypos,this.width,this.height);
    }
}

class LavaDrip extends Actor{
    constructor(w,h,velx,vely,world){
        super(w,h,velx,vely);
        this.mworld = world;
        this.color = "black";
        this.drawColor = 'red';
        this.accel = 0.3;
        this.counter = 0;
    }
    playerCol(player){
        if(player.color != '#FF3333'){
            player.health -= 1;
            player.color = '#FF3333';
        };
    }
    //this counts while increasing the height of the lava block. If the counter reaches a certain number, the block will fall.
    move(){
        if(this.counter <= 80){
            this.height = (this.counter*this.mworld.sqsize)/80;
            this.counter += 1;
        }
        else{
            this.vel.vector[1] += this.accel;
            this.pos.plus(this.vel);
            //ul is Upper Left Corner, UR upper right, ll lower left, lr lower right
            let ul = [this.pos.vector[0]  ,  this.pos.vector[1]];
            let ur = [this.pos.vector[0]+this.width  ,  this.pos.vector[1]];
            let ll = [this.pos.vector[0]  ,  this.pos.vector[1]+this.height];
            let lr = [this.pos.vector[0]+this.width ,  this.pos.vector[1] + this.width];
            if(this.mworld.legendSolid(ll[0] + 2 ,ll[1] - 3)  || this.mworld.legendSolid(lr[0] - 2,lr[1] - 3)){
                this.pos.vector[0] = this.startpos.vector[0];
                this.pos.vector[1] = this.startpos.vector[1];
                this.vel.vector[1] = 0;
                this.height = 0;
                this.counter = 0;
            }
        }
    }
    draw(){
        ctx.fillStyle = this.drawColor;
        ctx.fillRect(this.pos.vector[0] - this.mworld.xpos,this.pos.vector[1] - this.mworld.ypos,this.width,this.height);
    }
}

class LavaHorizontal extends Actor{
    constructor(w,h,velx,vely,world){
        super(w,h,velx,vely);
        this.mworld = world;
        this.color = "black";
        this.drawColor = 'red';
        this.accel = 0.2;
    }
    playerCol(player){
        if(player.color != '#FF3333'){
            player.health -= 1;
            player.color = '#FF3333';
            console.log('collision detected');
        };
    }
    //this counts while increasing the height of the lava block. If the counter reaches a certain number, the block will fall.
    move(){
        this.vel.vector[1] = 0;
        this.pos.plus(this.vel);
        if(this.mworld.legendSolid(this.pos.vector[0], this.pos.vector[1]+2) == 1 || this.mworld.legendSolid(this.pos.vector[0]+this.width,this.pos.vector[1]+2) == 1){
            this.vel.vector[0] = 0 - this.vel.vector[0];
        }
    }
    draw(){
        ctx.fillStyle = this.drawColor;
        ctx.fillRect(this.pos.vector[0] - this.mworld.xpos,this.pos.vector[1] - this.mworld.ypos,this.width,this.height);
    }
}

class Lift extends Actor{
    constructor(w,h,velx,vely,world){
        super(w,h,0,0);
        this.liftvx = velx;
        this.liftvy = vely;
        this.mworld = world1;
        this.color = "#448888";
        this.drawColor = '#448888';
    }
    playerCol(player){
        player.gravity = 0;
        player.vel.vector[1] = 0-this.liftvy;
    }
    move(){}
    draw(){
        ctx.fillStyle = this.drawColor;
        ctx.fillRect(this.pos.vector[0] - this.mworld.xpos, this.pos.vector[1] - this.mworld.ypos, this.width, this.height);
    }
}

class DoorSwitch extends Actor{
    constructor(w,h,char1,char2,color,world){
        super(w,h,0,0);
        this.color = color;
        this.drawColor = color;
        this.mworld = world;
        this.char1 = char1;
        this.char2 = char2;
    }
    reset() {
      this.mworld.legend[this.char1].solid = 1;
      this.mworld.legend[this.char1].color = "white";
    }
    playerCol(player){
                this.mworld.legend[this.char1].solid = 0;
                this.mworld.legend[this.char1].color = "black";

                this.mworld.legend[this.char2].solid = 1;
                this.mworld.legend[this.char2].color = 'darkgray';
    }
    antiCol(){
        this.mworld.legend[this.char1].solid = 1;
        this.mworld.legend[this.char1].color = "white";

        this.mworld.legend[this.char2].solid = 0;
        this.mworld.legend[this.char2].color = "white";
    }
    draw(){
        ctx.fillStyle = this.drawColor;
        ctx.fillRect(this.pos.vector[0] - this.mworld.xpos ,this.pos.vector[1] - this.mworld.ypos,this.width,this.height);  
    }
}


class MakeOrange extends Actor{
    constructor(w,h,velx,vely,world){
        super(w,h,velx,vely);
        this.pos = new Vector(0,0);
        this.vel = new Vector(velx,vely);
        this.color = 'black';
        this.drawColor = 'black';
        this.mworld = world;
    }
    playerCol(player){
        if(player.color != '#33CCFF')
        player.color = "#FFCC33";
    }
    draw(){
        ctx.fillStyle = this.drawColor;
        ctx.fillRect(this.pos.vector[0] - this.mworld.xpos ,this.pos.vector[1] - this.mworld.ypos,this.width,this.height);
    }
}

class MakeGreen extends Actor{
    constructor(w,h,velx,vely,world){
        super(w,h,velx,vely);
        this.pos = new Vector(0,0);
        this.vel = new Vector(velx,vely);
        this.color = '#99FF33';
        this.drawColor = '#99FF33';
        this.mworld = world;
    }
    playerCol(player){
        player.color = "#33EE99";
        player.counter = 0;
    }
    draw(){
        ctx.fillStyle = this.drawColor;
        ctx.fillRect(this.pos.vector[0] - this.mworld.xpos ,this.pos.vector[1] - this.mworld.ypos,this.width+1,this.height+1);
    }
}

class Water extends Actor{
    constructor(w,h,g,mworld){
        super(w,h,0,0);
        this.pos = new Vector(0,0);
        this.vel = new Vector(0,0);
        this.color = "#4444FF";
        this.mworld = mworld;
        this.drawColor = "#4444FF";
        this.gravity = g;
    }
    playerCol(player){
        player.xstep = this.gravity * 30;
        player.jumph = this.gravity * 40;
        player.gravity = this.gravity;
        if(player.grounded == false && player.vel.vector[1] >= (0 - 0.2*player.jumph) && (keys[32] || keys[38] || keys[90]) && this.mworld.legendSolid(player.pos.vector[0],player.pos.vector[1]) != 1){
            player.vel.vector[1] -= player.jumph;
        }
        if(player.vel.vector[0] > player.xstep || player.vel.vector[0] < 0-player.xstep){
            player.vel.vector[0] *= 0.8;
        }
        if(player.vel.vector[1] > player.jumph || player.vel.vector[1] < 0-player.jumph){
            player.vel.vector[1] *= 0.8;
        }
    }
    draw(){
        ctx.fillStyle = this.drawColor;
        ctx.fillRect(this.pos.vector[0] - this.mworld.xpos ,this.pos.vector[1] - this.mworld.ypos,this.width+1,this.height+1);
    }
}

class AddLife extends Actor{
    constructor(w,h,world){
        super(w,h,0,0);
        this.color = "black";
        this.pos = new Vector(0,0);
        this.vel = new Vector(0,0);
        this.drawColor = '#FF44AA';
        this.mworld = world;
        this.collected = 0;
        this.offsety = 0;
    }
    playerCol(player){
        if(this.collected == 0){
            player.health += 1;
            this.collected = 1;
        }
    }
    move(){
        this.offsety += Math.PI/20;
        if(this.offsety >= 2*Math.PI){
            this.offsety = 0;
        }
    }
    draw(){
        this.offsety += Math.PI/40;
        let ypos = 6*Math.sin(this.offsety);
        if(this.collected == 0){
            ctx.fillStyle = this.drawColor;
            let centerPos = [this.pos.vector[0] + this.width/2 - world1.xpos, this.pos.vector[1] + this.height/2 - world1.ypos + ypos];
            ctx.beginPath();
            ctx.arc(centerPos[0],centerPos[1],this.height/4,0,Math.PI*2);
            ctx.closePath();
            ctx.fill();
        }
    }
}


/**
 * A very important block. This makes the level of the world go up by one, so that game progress
 * is possible.
 */
class FinishLine extends Actor{
    constructor(w,h,velx,vely,world,spawnPos){
        super(w,h,velx,vely);
        this.color = 'gold';
        this.drawColor = 'gold';
        this.mworld = world;
        this.spawnPos = spawnPos;
    }
    playerCol(player){
        if(player.color == "#33EE99"){
            this.mworld.level += 1;
            this.mworld.xpos = 0;
            this.mworld.ypos = 0;
            player.pos.vector = this.spawnPos;
            checkLevel(world1);
            this.mworld.initScripts();
            console.log('level up! New level: ' + world1.level);
            player.color = '#FFCC33';
            for(let i = 0; i < this.mworld.actors.length; i++){
                if(this.mworld.actors[i] instanceof DoorSwitch){
                    this.mworld.actors[i].reset();
                }
             }
        }
    }
    draw(){
        ctx.fillStyle = this.drawColor;
        ctx.fillRect(this.pos.vector[0] - this.mworld.xpos,this.pos.vector[1] - this.mworld.ypos,this.width,this.height);
    }
}




//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------



/**
 *   -- PLAYER CLASS --
 */
class Player extends Actor{
    constructor(width,height,x,y,color){
      super(x,y,height,width,0,0);
      this.pos = new Vector(x,y);
      this.health = 7;
      this.maxhealth = 7;
      this.height = height;
      this.width = width;
      this.grounded;
      this.wallRight;
      this.wallLeft;
      this.color = color || 'white';
      this.accel = 1;
      this.gravity = 0.6;
      this.xfriction = 0.7;
      this.xstep = 6;
      this.jumph = 10;
      this.counter = 0;
      this.shear = 0;
    }
    drawHealth(){
      let size = 30;
      ctx.fillStyle = 'white';
      ctx.font = "15px Arial";
      if(this.maxhealth >= this.health){
        ctx.fillText('HEALTH: ',10, 30);
      }
      if(this.health > this.maxhealth){
        ctx.fillText('HEALTH: ',10, 30);
      }
      ctx.fillStyle = 'red';
      for(let i = 0; i <= this.health; i++){
        ctx.fillRect(80+(size/2 + 3)*i, 10, size/2, size);
      }
    }
    draw(){
        if(this.health > 0){
            ctx.beginPath();
            ctx.moveTo(this.pos.vector[0] + this.shear,this.pos.vector[1]);
            ctx.lineTo(this.pos.vector[0], this.pos.vector[1] + this.height);
            ctx.lineTo(this.pos.vector[0]+this.width, this.pos.vector[1] + this.height);
            ctx.lineTo(this.pos.vector[0] + this.shear + this.width, this.pos.vector[1]);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        else{
            ctx.fillStyle = "#991111";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.font = "30px Impact";
            ctx.fillStyle = "black";
            ctx.fillText('YOU DIED. Press R to restart.',canvas.width/2 - 170,canvas.height/2 - 15);
            player1.pos.vector = [canvas.width/2 - this.width/2, canvas.height*0.75];
            player1.color = "white";
            if(keys[82]){
              this.health = this.maxhealth;
              this.color = "#FFCC33";
            }
          }
    }
    drawvector(length){
      ctx.beginPath();
      ctx.moveTo(this.pos[0]+0.5*this.width,this.pos[1]+0.5*this.height);
      ctx.lineTo(this.pos[0]+length*this.vel[0]+0.5*this.width,this.pos[1]+length*this.vel[1]+0.5*this.height);
      ctx.strokeStyle = '#FF6633';
      ctx.lineWidth = 3;
      ctx.stroke();
    } 
    //Arrow or z/q/d keys to move.
    nextFrame(){
        if(this.health > 0){
            this.shear =  this.vel.vector[0] / 2.5;
            /*
        --HERE' S A LITTLE KEY INDEX THING--
        -32: SPACEBAR
        -37: LEFT ARROW
        -38: UP ARROW
        -39: RIGHT ARROW
        -68: 'D' KEY
        -81: 'Q' KEY
        -90: 'Z' KEY
        */
            if(this.color == '#FF3333'){
                this.counter += 1;
                if(this.counter >= 180){
                    this.counter = 0;
                    this.color = "#FFCC33"
                }
            }
            if(keys[37] || keys[81]){
                this.vel.vector[0] += 0 - ((this.vel.vector[0] >= 0 - this.xstep) && !this.wallLeft ? this.accel : 0);
            }
            if(keys[39] || keys[68]){
                this.vel.vector[0] += ((this.vel.vector[0] <= this.xstep) && !this.wallRight ? this.accel : 0);
            }
            if(!keys[39] && !keys[37] && !keys[68] && !keys[81]){
                this.vel.vector[0] = this.vel.vector[0] * this.xfriction;
            }
        
                //check if thing is at borders of screen to set x-vel 0
            if(this.pos.vector[0] < 0){
                this.pos.vector[0] = 0;
                this.vel.vector[0] = 0;
            }
            if(this.pos.vector[0] > canvas.width - this.width){
                this.pos.vector[0] = canvas.width - this.width;
                this.vel.vector[0] = 0;
            }
            if((keys[38] || keys[32] || keys[90]) && this.grounded){
                this.vel.vector[1] -= this.jumph;
            }
                this.vel.vector[1] += this.grounded ? 0 : this.gravity;
                this.pos.plus(this.vel);
        }
    }
    colCheck(world){
        let vector = [this.vel.vector[0]  ,   this.vel.vector[1]];
        let lefttop = [this.pos.vector[0] + world.xpos   ,   this.pos.vector[1] + world.ypos];
        let leftbottom = [this.pos.vector[0]+world.xpos   ,   this.pos.vector[1] + this.height + world.ypos];
        let righttop = [this.pos.vector[0] + this.width + world.xpos   ,   this.pos.vector[1] + world.ypos];
        let rightbottom = [this.pos.vector[0] + this.width + world.xpos   ,   this.pos.vector[1] + this.height + world.ypos];
        
        let nextlefttop = [this.pos.vector[0]+this.vel.vector[0] + world.xpos   ,   this.pos.vector[1]+this.vel.vector[1] + world.ypos];
        let nextleftbottom = [this.pos.vector[0]+this.vel.vector[0] + world.xpos   ,   this.pos.vector[1]+this.height+this.vel.vector[1] + world.ypos];
        let nextrighttop = [this.pos.vector[0] + this.width+this.vel.vector[0] + world.xpos   ,   this.pos.vector[1]+this.vel.vector[1] + world.ypos];
        let nextrightbottom = [this.pos.vector[0] + this.width + this.vel.vector[0] + world.xpos   ,   this.pos.vector[1] + this.height + this.vel.vector[1] + world.ypos];
        
        
        //checks if the player is about to hit the ground on the bottom
        if(world.legendSolid(rightbottom[0]-2,nextrightbottom[1]) == 1 || world.legendSolid((leftbottom[0]+2),nextleftbottom[1]) == 1){
          this.vel.vector[1] = 0;
          this.grounded = true;
        }
        else{this.grounded = false;}
        
        //checks if bottom or top right collides with side of block
        if(world.legendSolid(nextrightbottom[0],(rightbottom[1]-2)) == 1 || world.legendSolid(nextrighttop[0],(righttop[1] + 2)) == 1){
          this.vel.vector[0] = 0;
          this.wallRight = true;
        }
        else{this.wallRight = false}
        
        //checks if left top or left bottom collide with side of block
        if(world.legendSolid(nextleftbottom[0], (leftbottom[1]-1)) == 1 || world.legendSolid(nextlefttop[0], (lefttop[1] + 2)) == 1){
          this.wallLeft = true;
          this.vel.vector[0] = 0;
        }
        else{this.wallLeft = false;}
        
        //checks if top corner collides with bottom of block
        if(world.legendSolid(righttop[0]-2,nextrighttop[1]) == 1){
          this.vel.vector[1] = 0.2;
          keys[38] = false;
          keys[32] = false;
        }
        
        //checks if left top collides with top of block
        if(world.legendSolid((lefttop[0]+2),nextlefttop[1])==1){
          this.vel.vector[1] = 0.2;
        }
      }
    checkActorCols(world){
          for(let i = 0; i < world.actors.length; i++){
              if(this.collidesWith(world.actors[i]) && typeof world.actors[i].playerCol === 'function'){
                  world.actors[i].playerCol(this);
              }
          }
    }
  }

/*
*  --WORLD CLASS--
*  EVERY ELEMENT IN LEGEND NEEDS 'ACTOR' PROPERTY
*  IMPORTANT -- TO ADD A MOVING TILE / NEW ACTOR, YOU NEED TO ADD A LITTLE 'SETUP'-TYPE SCRIPT
*               SO THE OBJECT YOU'RE TRYING TO ADD HAS THE CORRECT POSITION ETC.
*               THE SCRIPT --HAS TO-- ACCEPT X- AND Y- ARGUMENTS!
*/
class World{
    constructor(map,legend){
        //sets the level
        this.level = 0;
        this.pause = false;
        //simply sets a background color
        this.backgcolor = 'black';
        /*
        * xpos and ypos are there to make the camera move
        */
        this.xpos = 0;
        this.ypos = 0;
        /*
        *  Make sure the map is an array OF ARRAYS
        */
        this.map = map;
        this.legend = legend;
        /* 
        *  sqsize is set to max height for now. It's able to draw wider than the canvas so that
        *  the map is able to scroll (horizontally).
        *  sqsize is the size of the squares when drawing the world.
        */
        this.sqsize = window.innerHeight / this.map.length;
        /*
        *  THE ACTORS ARRAY IS IMPORTANT
        *  Make sure EVERY item in it is an object from the
        *  'world.legend', and that every item in it has a 'move' function/path.
        * 
        *  Actors contains OBJECTS of type ACTOR. Every Actor has to have a clearly defined path.
        *  If no path is given, the actor you're trying to add will have the actor prototype's path.
        */
        this.actors = [];
    }
    /*
    *   getChar SAFELY gets a character from the map.
    *   If no character is found at the coordinates you're looking at, it will
    *   return a black square that's not solid.
    */
    getChar(x,y){
        if(this.map[y] != undefined && this.map[y][x] != undefined){
            return(this.map[y][x]);
        }
        else{
            return({color: this.backgcolor, solid: 1});
        }
    }
    /** 
    *  LegendChar RETURNS AN OBJECT. It returns the
    *  object (from the legend) that refers to the character with certain coordinates (x,y)
    *  in the map.
    */
    legendChar(x,y){
        if(this.legend[this.getChar(x,y)] != undefined){
            return(this.legend[this.getChar(x,y)]);
        }
        else{
            return({color: this.backgcolor, actor:0, solid: 1});
        }
    }
    /**
     * legendSolid returns is basically legendChar.solid
     */
    legendSolid(x,y){
        if(this.legend[this.getChar(Math.floor(x/this.sqsize),Math.floor(y/this.sqsize))] != undefined){
            return(this.legend[this.getChar(Math.floor(x/this.sqsize),Math.floor(y/this.sqsize))].solid);
        }
        else{
            return(1);
        }
    }
    /**
     * Draw function, very important.
     * Double loop over the map.
     * If the character the loop is looking at is not an 'actor', it'll draw a square.
     * If it IS an actor, it will add the object to the actors array. 
     */
    draw(){
        for(let y = 0; y < this.map.length; y++){
            for(let x = 0; x < this.map[y].length; x++){
                    ctx.fillStyle = this.legendChar(x,y).color;
                    ctx.fillRect(x*this.sqsize - this.xpos,y*this.sqsize - this.ypos,this.sqsize +1,this.sqsize+1);
            }
        }
    }
    getLongestRow(){
        let lo = 0;
        for(let i = 0; i<this.map.length; i++){
            if(this.map[i].length > lo){lo = this.map[i].length};
        }
        return(lo);
    }
    camfollow(player){
        /**
         * This might be kinda hard to wrap your head around, but give it a try.
         * It's kinda hard to make meaningful comments on the camera tracker.
         */
        if(player.pos.vector[0] >= canvas.width*0.5 && (keys[39] || keys[68]) && (this.getLongestRow()*this.sqsize - this.xpos) > canvas.width){
            if(player.pos.vector[0] >= canvas.width*0.5 && player.pos.vector[0] <= canvas.width*0.6){
                let dist = canvas.width*0.1;
                let playerdist = (-(canvas.width*0.5 - player.pos.vector[0])/dist);
                this.xpos += playerdist * player.vel.vector[0];
                player.pos.vector[0] -= playerdist * player.vel.vector[0];
            }
            if(player.pos.vector[0] >= canvas.width * 0.6){
                this.xpos += player.vel.vector[0];
                player.pos.vector[0] -= player.vel.vector[0]
            }
        }
        if(player.pos.vector[0] <= canvas.width*0.3 && (keys[37] || keys[81]) && this.xpos > 0){
            if(player.pos.vector[0] >= canvas.width*0.2 && player.pos.vector[0] <= canvas.width*0.3){
                let dist = canvas.width * 0.1;
                let playerdist = (canvas.width * 0.3 - player.pos.vector[0])/dist;
                this.xpos += playerdist * player.vel.vector[0];
                player.pos.vector[0] -= playerdist * player.vel.vector[0];
            }
            if(player.pos.vector[0] <= canvas.width * 0.2){
                this.xpos += player.vel.vector[0];
                player.pos.vector[0] -= player.vel.vector[0];
            }
        }

        if(player.pos.vector[1] >= canvas.height * 0.7 && (this.map.length * this.sqsize - this.ypos) >= canvas.height && player.vel.vector[1] > 0){
            this.ypos += player.vel.vector[1];
            player.pos.vector[1] -= player.vel.vector[1];
        }
        if(player.pos.vector[1] <= canvas.height * 0.2 &&  this.ypos > 0 && player.vel.vector[1] < 0){
            this.ypos += player.vel.vector[1];
            player.pos.vector[1] -= player.vel.vector[1];
        } 

        /**
         * this piece of code kinda centers the player slowly when standing still.
         */
        if(player.vel.vector[0] < 0.5 && player.vel.vector[0] > -0.5 && this.xpos > 0){
            if(player.pos.vector[0] < 0.49*canvas.width){
                this.xpos -= 0.2;
                player.pos.vector[0] += 0.2;
            }
            if(player.pos.vector[0] > 0.51*canvas.width  && (this.getLongestRow()*this.sqsize - this.xpos) > canvas.width){
                this.xpos += 0.2;
                player.pos.vector[0] -= 0.2;
            }
        }

    }
    initScripts(){
        world1.actors = [];
        for(let y = 0; y < this.map.length; y++){
            for(let x = 0; x < this.map[y].length; x++){
                if(this.legendChar(x,y).hasOwnProperty('script')){
                    this.legendChar(x,y).script(x,y);
                }
            }
        }
    }
    moveActors(){
        for(let i = 0; i < this.actors.length; i++){
            this.actors[i].move();
            this.actors[i].draw();
        }
    }
}


//------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------

//INITIAL SETUP OF WORLD1
world1 = new World([
[' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ', 0 ],
[' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ', 0 ],
[' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ', 0 ],
['c',' ',' ',' ',' ',' ','d',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ', 0 ],
[ 0 , 0 , 0 ,' ',' ', 0 , 0 , 0 , 0 ,' ',' ', 0 ,' ', 0 , 0 ,' ',' ',' ', 0 ],
[' ',' ',' ',113,113,' ',' ',' ',111,' ',' ',111,' ',' ',' ',' ',' ',' ', 0 ],
[' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ', 0 ,' ',' ', 0 ],
[' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ', 0 ],
[' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ', 0 , 0 ,' ',' ',' ', 0 ],
[' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ', 0 , 0 ,' ',' ',' ',' ', 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
[' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ', 0 , 0 , 0 ,' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ', 0 ],
[' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',111,' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ', 0 ],
[' ',' ',' ',' ',' ',' ',' ',' ',' ',' ', 0 ,' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ', 0 ,' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ', 0 ],
[' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ', 0 ],
[' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ', 0 ,' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ', 0 ,' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ', 0 ],
[' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ', 0 ],
[' ',' ',' ',' ',' ', 0 ,' ',' ',' ',' ', 0 ,' ',' ',' ',' ',' ', 0 ,' ',' ',' ',' ',' ',' ', 0 ,' ',' ',' ',' ', 0 ,' ',' ',' ',' ',' ', 0 ,' ',' ',' ',' ',' ',' ', 0 ,' ',' ',' ',' ', 0 ,' ',' ',' ',' ',' ', 0 ,' ',' ',' ',' ',' ',' ', 0 ,' ',' ',' ',' ', 0 ,' ',' ',' ',' ',' ','c', 0 ],
[ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ]
],{
}
);
world1.legend = {
    ' ': {color: world1.backgcolor, solid: 0},
    '|': {color: 'white', solid: 1},
    '-': {color: 'white', solid: 1},
    001: {color: 'blue', solid: 0, script: function(x,y){
            let w = new Water(world1.sqsize,world1.sqsize,0.05,world1);
            w.pos.vector = [x*world1.sqsize, y*world1.sqsize];
            world1.actors.push(w);
            let d = new MakeGreen(world1.sqsize,world1.sqsize,0,0,world1);
            d.pos.vector = [world1.sqsize*x,world1.sqsize*y];
            world1.actors.push(d);
        }
    },
    002: {color: world1.backgcolor,solid: 0, script: function(x,y){
            let al = new AddLife(world1.sqsize/1.5,world1.sqsize/1.5,world1);
            al.pos.vector = [x*world1.sqsize + world1.sqsize/4,y*world1.sqsize];
            world1.actors.push(al);
        }
    },
    003: {color: 'blue',solid: 0 , script: function(x,y){
            let al = new AddLife(world1.sqsize/1.5,world1.sqsize/1.5,world1);
            al.pos.vector = [x*world1.sqsize + world1.sqsize/4,y*world1.sqsize];
            world1.actors.push(al);
            let w = new Water(world1.sqsize,world1.sqsize,0.05,world1);
            w.pos.vector = [x*world1.sqsize,y*world1.sqsize];
            world1.actors.unshift(w);
        }
    },
    004: {color: '#44AA88', solid: 0, script: function(x,y){
        let sw = new DoorSwitch(world1.sqsize,world1.sqsize,'|','-','#44AA88',world1);
        sw.pos = new Vector(world1.sqsize*x,world1.sqsize*y);
        world1.actors.push(sw);
        }
    },
    005: {color: "#8844AA", solid: 0, script: function(x,y){
        let sww = new DoorSwitch(world1.sqsize,world1.sqsize,'-','|','#8844AA',world1);
        sww.pos = new Vector(world1.sqsize*x,world1.sqsize*y);
        world1.actors.push(sww);
        }
    },
    111: {color: world1.backgcolor, solid: 0, script: function(x,y){
                let ld = new LavaDrip(world1.sqsize, world1.sqsize,0,0,world1);
                ld.pos.vector = [x*world1.sqsize,y*world1.sqsize];
                ld.startpos.vector = [x*world1.sqsize, y * world1.sqsize];
                ld.counter = Math.floor(Math.random*180);
                world1.actors.push(ld);
            }  
        },
    112: {color: world1.backgcolor, solid: 0, script: function(x,y){
            let spx = Math.random() - 0.5 < 0 ? Math.random()*2 + 1.5 : 0 - (Math.random()*2 +1.5);
            let lh = new LavaHorizontal(world1.sqsize, world1.sqsize,spx,0,world1);
            lh.pos.vector = [x*world1.sqsize,y*world1.sqsize];
            world1.actors.push(lh);
        }  
    },
    113: {color: 'red', solid: 0, script: function(x,y){
            let sl = new StillLava(world1.sqsize,world1.sqsize,world1);
            sl.pos.vector = [x*world1.sqsize,y*world1.sqsize];
            world1.actors.push(sl);
        }
    },
    114: {color: 'blue', solid: 0,script: function(x,y){
            let spx = Math.random() - 0.5 < 0 ? Math.random()*2 + 1.5 : 0 - (Math.random()*2 +1.5);
            let lh = new LavaHorizontal(world1.sqsize,world1.sqsize,spx,0,world1);
            lh.pos.vector = [x*world1.sqsize,y*world1.sqsize];
            world1.actors.push(lh);
            let w = new Water(world1.sqsize,world1.sqsize,0.05,world1);
            w.pos.vector = [x*world1.sqsize,y*world1.sqsize];
            world1.actors.unshift(w);
        }
    },
    201: {color: '#4477CC', solid: 0, script: function(x,y){
            let lift = new Lift(world1.sqsize,world1.sqsize,0,world1.sqsize/10,world1);
            lift.pos.vector = [world1.sqsize*x,world1.sqsize*y];
            world1.actors.push(lift);
        }
    },
    0  : {color: 'white', solid: 1}, 
    'c': {color: 'gold', solid: 0, script: function(x,y){
        let fl = new FinishLine(world1.sqsize, world1.sqsize,0,0,world1,[20,20]);
        fl.pos.vector = [x*world1.sqsize,y*world1.sqsize];
        world1.actors.push(fl);
        }
    },
    'd': {color: 'blue', solid: 0, script: function(x,y){
        let mb = new MakeGreen(world1.sqsize, world1.sqsize,0,0,world1);
        mb.pos.vector = [x*world1.sqsize,y*world1.sqsize];
        world1.actors.push(mb);
        } 
    },
    'a': {color: world1.backgcolor, solid: 0, script: function(x,y){
        let mo = new MakeOrange(world1.sqsize, world1.sqsize,0,0,world1);
        mo.pos.vector = [x*world1.sqsize,y*world1.sqsize];
        world1.actors.push(mo);
        }
    },
    'w': {color: '#5599FF', solid: 0, script: function(x,y){
        let w = new Water(world1.sqsize,world1.sqsize,0.05,world1);
        w.pos.vector = [x*world1.sqsize, y*world1.sqsize];
        world1.actors.unshift(w);
        }
    }
}
world1.sqsize = window.innerHeight / world1.map.length;
world1.level = 0;

//INITIAL SETUP OF PLAYER1
let player1 = new Player(world1.sqsize/2.4, world1.sqsize/1.3, 20, window.innerHeight - 200,'#FFCC33');
player1.health = 5;
player1.xstep = world1.sqsize / 5;
player1.jumph = world1.sqsize/4;
player1.gravity = world1.sqsize / 80;
player1.maxhealth = 5;
//------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------



function animate(){
    if(player1.health <= 0){
        player1.pos.vector = [10,10];
        world1.level = 0;
        world1.xpos = 0;
        world1.ypos = 0;
        world1.initScripts();
        checkLevel(world1);
    }
    if(world1.pause == false){
        checkLevel(world1);
        player1.colCheck(world1);
        player1.checkActorCols(world1);
        player1.nextFrame();
        world1.camfollow(player1);

        ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
        world1.draw();
        world1.moveActors();
        player1.drawHealth();
        player1.draw();
    }
    requestAnimationFrame(animate);
};