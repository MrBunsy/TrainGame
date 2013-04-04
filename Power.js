/* 
 * Copyright Luke Wallin 2012
 */

var Power = function(){
    this.draw=function(ctx){
        ctx.save();
        
        ctx.fillStyle="rgb(255,0,0)";
        
        ctx.beginPath();
        ctx.arc(0,0,25,0,Math.PI*2,false);
        ctx.fill();
        
        ctx.restore();
    }
    
    this.getType=function(){
        return "power"
    }
    
    this.update=function(nearBy,time,onTop){
        //return true if anything changed
        return false;
    }
    
    this.providesPower=function(ourPos){
        return 16;
    }
    
    this.connectsPower=function(ourPos){
        return false;
    }
}
