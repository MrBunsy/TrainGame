/* 
 * Copyright Luke Wallin 2012
 */


var Repeater = function(){
    
    this.on=false;
    this.delay=0;
    //the time when power was first provided
    this.time=0;
    
     //will always draw as a 100x100 with the top left at -50,-50
    this.draw=function(ctx){
        var colour = this.on ? "rgb(255,0,0)" : "rgb(0,0,0)";
        
        ctx.lineWidth=10;
        
        ctx.strokeStyle=colour;
        //line to output
        ctx.beginPath();
        ctx.moveTo(25,0);
        ctx.lineTo(50,0);
        ctx.stroke();
        
        
        ctx.strokeRect(-25,-25,50,50);
        
        ctx.fillStyle="rgb(0,0,0)";
        ctx.font="25pt Arial bold, sans-serif";
        ctx.textBaseline="middle";
        ctx.textAlign="center";
        
        
        ctx.fillText(this.delay,0,0);
    }
    
    this.getType=function(){
        return "repeater"
    }
    
    //increment the delay and return true if we've just looped
    this.incrementDelay=function(){
        this.delay++;
        this.delay%=4;
        this.time=0;
        return this.delay==0;
    }
    
    this.update=function(nearBy,time,onTop){
        //return true if anything changed
        
        
        
        var change=false;
        var oldOn = this.on;
        
        var powered=false;
        this.on=false;
        
        for(var i=0;i<4;i++){
            if(i!=1){
                if(nearBy[i].providesPower(i) > 0){
                    powered=true;
                }
            }
        }
        
        
        //if we have no power, reset the delay back to zero
        if(!powered || this.time==0){
            this.time=time;
        }
        
        if(time >=this.time+this.delay && powered){
            this.on=true;
        }
        
        
        
        change = change || this.on!=oldOn
        
        return change;
    }
    
    //returns int, 0 = no power, increasing numbers is increasing quantity
    this.providesPower=function(ourPos){
        if(ourPos == 3){
            //they are to our right
            return this.on ? 16:0;
        }
        return 0;
    }
    
    //ourPos is our position relative to them.  Eg, 2 = they are above us
    this.connectsPower=function(ourPos){
        //if they are anywhere except our right
        //return ourPos!=3;
        return true;
    }
}