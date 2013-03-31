/* 
 * Copyright Luke Wallin 2012
 */


var Track = function(connections){
    
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
    
    
    
    this.getType=function(){
        return "track"
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
    
    this.getHappy=function(){
        return this.happy;
    }
    
    this.update=function(nearBy){
     
        var nearRails = 0;
        var nearDirs = [];
        //find how many rails nearby, that aren't yet in an ideal position
        for(var i=0;i<4;i++){
            if(nearBy[i].getType()=="track" && !nearBy[i].getHappy()){
                nearRails++;
                nearDirs.push(i);
            }
        }
        
        //find out how many nearby rails point towards us
        var pointAtUs=0;
        var pointDirs=[];
        for(var i=0;i<4;i++){
            if(nearBy[i].getType()=="track" && nearBy[i].getConnections()[(i+2)%4]){
                pointAtUs++;
                pointDirs.push(i);
            }
        }
        
        //if this rail was previously happy, and is still connected to the ones it was, don't override it with the south-east rule
        if(this.happy && pointAtUs>=2){
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
        
        this.happy=false;
        
        if(pointAtUs>=2){
            //enough stuff pointing directly at us
            connects[pointDirs[0]]=true;
            connects[pointDirs[1]]=true;
            changed = this.setConnections(connects);
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
            changed = this.setConnections(connects);
        }else{
            //0 pointing at us
            if(nearRails==1){
                connects[nearDirs[0]]=true;
                connects[(nearDirs[0]+2)%4]=true;
                changed = this.setConnections(connects);
            }else
            if(nearRails>=2){
                //link the two together
               
                connects[nearDirs[0]]=true;
                connects[nearDirs[1]]=true;
               
                changed = this.setConnections(connects);
            }
            
        }
        
        this.prevNearRails=nearRails;
        
        return changed;
    }
    
    this.prevNearRails=0;
    
    //    if(connections!=null){
    //        this.setConnections(connections);
    //    }else{
    this.setConnections([true,false,true,false]);
//    }
    
    
}