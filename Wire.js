/* 
 * Copyright Luke Wallin 2012
 */


var Wire = function(){
    //connections stuff is straight from the rails
    this.connections=[false,false,false,false];
    
    //returns true if new connections are different to old
    this.setConnections=function(connections){
        
        var changed=false;
        for(var i=0;i<4;i++){
            if(connections[i]!=this.connections[i]){
                changed=true;
            }
        }
        
        this.connections = connections
        
        return changed;
    }
    
    this.power=0;
    
    this.draw=function(ctx){
        
        //var colour = this.power > 0 ? "rgb("+this.power*+",0,0)" : "rgb(0,0,0)";
        
        var red = Math.max(0,this.power*16-1);
        
        var colour = "rgb("+red+",0,0)";
        
        ctx.lineWidth=10;
        ctx.fillStyle=colour;
        ctx.strokeStyle=colour;
        
        //only two connections
        var angle = -Math.PI/2;
        for(var i=0;i<4;i++){
            if(this.connections[i]){
                ctx.beginPath();

                ctx.moveTo(0,0);
                ctx.lineTo(50*Math.cos(angle),50*Math.sin(angle));

                ctx.stroke();

            }
            angle+=Math.PI/2;
        }
        
        ctx.beginPath();
        ctx.arc(0,0,20,0,Math.PI*2,false);
        ctx.fill();
    }
    
    /*
     * "track"
     * "empty"
     * "power"
     */
    this.getType=function(){
        return "wire"
    }
    
    this.update=function(nearBy,dT){
        //return true if anything changed
        
        var changed=false;
        var connects=[false,false,false,false];
        
        var oldPower=this.power;
        this.power=0;
        
        for(var i=0;i<4;i++){
            //check for nearby power
            if(nearBy[i].providesPower(i)-1 > this.power){
                //this is now powered!
                this.power=nearBy[i].providesPower(i)-1;
                connects[i]=true;
            }
            
            if(nearBy[i].connectsPower(i)){
                connects[i]=true;
            }
        }
        
        if(this.power != oldPower){
            //didn't used to be, so we've chagned
            changed=true;
        }
        
        changed = this.setConnections(connects) || changed;
        return changed;
    }
    
    this.providesPower=function(ourPos){
        return this.power;
    }
    
    this.connectsPower=function(ourPos){
        return true;
    }
}