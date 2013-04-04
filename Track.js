/* 
 * Copyright Luke Wallin 2012
 */


var Track = function(){
    
    this.connections=[false,false,false,false];
    
    //powered, detect, normal
    this.trackType="normal";
    
    //returns true if new connections are different to old
    this.setConnections=function(connections){
        
        var changed=false;
        for(var i=0;i<4;i++){
            if(connections[i]!=this.connections[i]){
                changed=true;
            }
        }
        
        this.connections = connections
        
        var connects=0;
        for(var i=0;i<4;i++){
            if(connections[i]){
                connects++;
            }
        }
        if(connects !=2){
            throw "Invalid connections: "+connects;
        }
        return changed;
    }
    
    this.getTrackType=function(){
        return this.trackType;
    }
    
    this.getType=function(){
        return "track"
    }
    
    //return true when we've got back to normal rail
    this.incrementType=function(){
        if(this.trackType=="normal"){
            this.trackType="powered";
            return false;
        }
        if(this.trackType=="powered"){
            this.trackType="detect";
            return false;
        }
        
        if(this.trackType=="detect"){
            this.trackType="normal";
            return true;
        }
        return false;
    }
    
    this.getConnections=function(){
        return this.connections;
    }
    
    
    /**
     * connects: [t,r,b,l]
     * t - top has track?
     * r - right
     * b - bottom
     * l - left
     */
    //drawing a 100x100 rail,centred around 0,0
    this.draw=function(ctx){

        ctx.save();
        //ctx.lineWidth=10;
        
        //the curved rail's sleepers slightly go over the edge, so clip them!
        ctx.beginPath();
        ctx.moveTo(-50,-50);
        ctx.lineTo(50,-50);
        ctx.lineTo(50,50);
        ctx.lineTo(-50,50);
        ctx.clip();
        
        var straight=false;
        var dirs=[];
        
        var distFromEdge = 20;
        var distFromCentre=50-distFromEdge;
        var width=10;
        var sleepers=4;
        //var sleeperDist=(100-2*distFromEdge)/(sleepers-1);
        var sleeperDist = 100/4;
        
        ctx.lineWidth=width;
        ctx.lineCap="butt";
        
        //only two connections
        //var angle = -Math.PI/2;
        for(var i=0;i<4;i++){
            if(this.connections[i]){
                dirs[0]=i;
                if(this.connections[(i+2)%4]){
                    //this is a straight peice of track!
                    straight=true;
                    dirs[1]=(i+2)%4;
                }else{
                    dirs[1] = this.connections[(i+1)%4] ? (i+1)%4 : (i+3)%4;
                }
                break;
//                ctx.beginPath();
//
//                ctx.moveTo(0,0);
//                ctx.lineTo(50*Math.cos(angle),50*Math.sin(angle));
//
//                ctx.stroke();

            }
            //angle+=Math.PI/2;
        }
        
        var railColour="rgb(128,128,128)";
        var sleeperColour="rgb(96,64,32)";
        var powerColour= this.power>0 ? "rgb(255,128,0)" : "rgb(128,64,0)";
        
        var from=[];
        var to=[];
        if(straight){
            if(dirs[0]!=0){
                //horizontal
                ctx.rotate(Math.PI/2);
            }
            
            //sleepers
            ctx.strokeStyle=sleeperColour;
            var y=-distFromCentre;
            for(var i=0;i<sleepers;i++){
                ctx.beginPath();
                ctx.moveTo(-50,-50+sleeperDist/2 + sleeperDist*i);
                ctx.lineTo(50,-50+sleeperDist/2 + sleeperDist*i);
                ctx.stroke();
            }
            
            //the two rails:
            ctx.strokeStyle=railColour;
            ctx.beginPath();
            ctx.moveTo(-distFromCentre,-50);
            ctx.lineTo(-distFromCentre,50);

            ctx.moveTo(distFromCentre,-50);
            ctx.lineTo(distFromCentre,50);
            ctx.stroke();
            
            switch(this.trackType){
                case "powered":
                    //orange third rail
                    ctx.strokeStyle=powerColour;
                    ctx.beginPath();
                    ctx.moveTo(0,-50);
                    ctx.lineTo(0,50);
                    ctx.stroke();
                    break;
                case "detect":
                    //grey square in centre
                    ctx.fillStyle=railColour;
                    ctx.fillRect(-20,-20,40,40);
                    break;
            }
            
        }else{
            //curve!
            var offset = 0;
            if((dirs[0]+1)%4 != dirs[1]){
                //the first dir is NOT the first one in our dirs array, going clockwise
                offset = -Math.PI/2;
            }
            
            var angle = dirs[0]*Math.PI/2 + offset;
            ctx.rotate(angle);
            //draw a curve going from top to right, and it'll be rotated accordingly
            
            var dAngle = (Math.PI/2)/(sleepers);
            
            ctx.strokeStyle=sleeperColour;
            
            var topCorner=50;
            var length = 100;
            
            for(var i=0;i<sleepers;i++){
                ctx.beginPath();
                //top right
                ctx.moveTo(topCorner,-topCorner);
                ctx.lineTo(topCorner + length*Math.cos(Math.PI/2 + dAngle/2 + dAngle*i), -topCorner + length*Math.sin(Math.PI/2 + dAngle/2 + dAngle*i))
                ctx.stroke();
            }
            
            ctx.strokeStyle=railColour;
            ctx.beginPath();
            ctx.arc(50,-50,distFromEdge,Math.PI,Math.PI/2,true);
            ctx.stroke();
            
            
            ctx.beginPath();
            ctx.arc(50,-50,100-distFromEdge,Math.PI,Math.PI/2,true);
            ctx.stroke();
            
        }
        
        ctx.restore();
    }
    
    
    //are we happily connecting two other rails both pointing at us?
    this.happy=false;
    this.previousPower=false;
    
    this.getHappy=function(){
        return this.happy;
    }
    
    //this.powered=false;
    this.power=0;
    //is this track one that will change direction if it is powered?
    this.canReceivePower=false;
    
    this.update=function(nearBy,time,onTop){
     
        var oldPower = this.power;
        this.power=0;
        //need to record how much power so it can be transmitted?
        //this.power=0;
        
        //find out how many nearby rails point towards us
        var pointAtUs=0;
        var pointDirs=[];
     
        //find how many rails nearby, that aren't yet in an ideal position
        var nearRails = 0;
        var nearDirs = [];
        
        for(var i=0;i<4;i++){
            if(nearBy[i].getType()=="track" && !nearBy[i].getHappy()){
                nearRails++;
                nearDirs.push(i);
            }
            if(nearBy[i].getType()=="track" && nearBy[i].getConnections()[(i+2)%4]){
                pointAtUs++;
                pointDirs.push(i);
            }
            
            if(nearBy[i].providesPower(i)-1 > this.power && (this.canReceivePower || this.trackType!="normal")){
                this.power=nearBy[i].providesPower(i)-1;
                //this.power = nearBy[i].providesPower(i)-1;
            }
        }
        
        //check for carts on top
        if(this.trackType=="detect"){
            for(var i=0;i<onTop.length;i++){
                if(onTop[i].getType()=="cart"){
                    //cart on top, act as power source
                    this.power=16;
                }
            }
        }
        
        //this.power=power;
        
        var oldReceiverPower=this.canReceivePower;
        this.canReceivePower=false;
        
        if(pointAtUs>2){
            //power didn't used to be able to affect this peice of track'
            if(!oldReceiverPower){
                changed=true;
            }
            //power will affect this peice of track, so set this
            this.canReceivePower=true;
        }
        
        //if this rail was previously happy, and is still connected to the ones it was, don't override it with the south-east rule
        //AND the power status is still the same
        if(this.happy && pointAtUs>=2 && this.power==this.previousPower){
            //check that the rails pointing at us are the same as the old ones
            for(var i=0;i<4;i++){
                if(this.connections[i] && pointDirs.indexOf(i)<0){
                    //if something in our connections is no longer pointing at us, we don't want to be happy naymore
                    this.happy=false;
                }
            }
            if(this.happy){
                //if we are still happy, return that we haven't changed
                return false;
            }
            
        }
        
        
        
        var connects = [false,false,false,false];
        var changed = false;
        
        if(this.power!=oldPower){
            changed = true;
        }
        
        this.happy=false;
        
        if(pointAtUs>=2){
            //enough stuff pointing directly at us
            
            
            if(this.power>0){
                //work backwards, anti-clockwise
                for(var i=pointAtUs-1;i>=pointAtUs-2;i--){
                    connects[pointDirs[i]]=true;
                }
            }else{
                //work clockwise
                connects[pointDirs[0]]=true;
                connects[pointDirs[1]]=true;
            }
            
            
            changed = this.setConnections(connects) || changed;
            this.happy=true;
        }else if(pointAtUs==1){
            connects[pointDirs[0]]=true;
            if(nearRails==1 && nearDirs[0]!=pointDirs[0]){
                //one other is near us and not pointing at us
                connects[nearDirs[0]]=true;
            }else
            if(nearRails>1){
                //there are others nearby, albeit not pointing at us
                for(var i=0;i<4;i++){
                    if(nearDirs[i]!=pointDirs[0]){
                        //point the other side of the rail at the first nearby rail that isn't pointed at us
                        connects[nearDirs[i]]=true;
                        break;
                    }
                }
            }else{
                //be striaght
                connects[(pointDirs[0]+2)%4]=true;
            }
            changed = this.setConnections(connects) || changed;
        }else{
            //0 pointing at us
            if(nearRails==1){
                connects[nearDirs[0]]=true;
                connects[(nearDirs[0]+2)%4]=true;
                changed = this.setConnections(connects) || changed;
            }else
            if(nearRails>=2){
                //link the two together
               
                connects[nearDirs[0]]=true;
                connects[nearDirs[1]]=true;
               
                changed = this.setConnections(connects) || changed;
            }
            
        }
        
        this.prevNearRails=nearRails;
        this.previousPower=this.power;
        
        return changed;
    }
    
    this.providesPower=function(ourPos){
        return this.power;
//        switch(this.trackType){
//            case "powered":
//                //powered rails act like normal wire for transmitting power
//                return this.power;
//                break;
//            case "detect":
//                //detectors when activated act as a power source
//                if(this.powered){
//                    return 16;
//                }else{
//                    return 0;
//                }
//                break;
//            default:
//                return 0;
//                break;
//        }
    }
    
    //TODO
    this.connectsPower=function(ourPos){
        return this.canReceivePower || this.trackType=="powered" || this.trackType=="detect";
    }
    
    this.prevNearRails=0;
    
    //    if(connections!=null){
    //        this.setConnections(connections);
    //    }else{
    this.setConnections([true,false,true,false]);
//    }
    
    
}