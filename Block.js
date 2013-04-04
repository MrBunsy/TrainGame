/* 
 * Copyright Luke Wallin 2012
 */


var Block = function(){
    //will always draw as a 100x100 with the top left at -50,-50
    this.draw=function(ctx){
        ctx.fillStyle="rgb(96,64,32)";
        ctx.fillRect(-50,-50,100,100);
    }
    
    this.getType=function(){
        return "block"
    }
    
    this.update=function(nearBy,time,onTop){
        //return true if anything changed
        return false;
    }
    
    //returns int, 0 = no power, increasing numbers is increasing quantity
    this.providesPower=function(ourPos){
        return 0;
    }
    
    //ourPos is our position relative to them.  Eg, 2 = they are above us
    this.connectsPower=function(ourPos){
        return false;
    }
}