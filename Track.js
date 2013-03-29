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
    this.draw=function(ctx){
    {

        ctx.lineWidth=10;
        
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
            
            
    //            if((connects[0] && connects[2]) || (connects[1] && connects[3])){
    //                //straight
    //                
    //            }else{
    //                //curve
    //                
    //            }
        
    }
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
                   // if((this.connections[i] && pointDirs.indexOf(i)>-1)){
                        //if something in our connections is no longer pointing at us, we don't want to be happy naymore
                        this.happy=false;
                   // }
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
            
            if(nearBy>1){
                //there are others nearby, albeit not pointing at us
                for(var i=0;i<nearBy;i++){
                    if(nearDirs[i]!=pointDirs[0]){
                        //point the other side of the rail at the first nearby rail that isn't pointed at us
                        connects[nearDirs[i]]=true;
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
        
//        //console.log("x:"+x+",y:"+y+" nearrails:"+nearRails);
//        if(nearRails==1){
//            for(var j=0;j<4;j++){
//                if(nearBy[j].getType()=="track"){
//                    connects[j]=true;
//                    connects[(j+2)%4]=true;
//                }
//            }
//            this.setConnections(connects);
//        }else
////        if(nearRails==2){
////            //link the two together
////            for(var j=0;j<4;j++){
////                if(nearBy[j].getType()=="track"){
////                    connects[j]=true;
////                }
////            }
////            this.setConnections(connects);
////
////        }else 
//            if (nearRails >=2 && this.prevNearRails < 2){
//            //find how many nearby point towards this rail
//            
//            
//            //TODO compare this with minecraft
//            if(pointAtUs==1){
//                //if only one, link to that and be straight
//                connects[dirs[0]]=true;
//                connects[(dirs[0]+2)%4]=true;
//            }else if(pointAtUs == 2){
//                //if only two, link those
//                connects[dirs[0]]=true;
//                connects[dirs[1]]=true;
//            }else{
//                //if three, use the logic:
//            
//                //find the empty nearby and then make the next two linked
//                for(var j=0;j<4;j++){
//                    if(nearBy[j].getType()!="track"){
//                        connects[(j+1)%4]=true;
//                        connects[(j+2)%4]=true;
//                        break;
//                    }
//                }
//            }
//            this.setConnections(connects);
//        }
        //        else if(nearRails==4 && this.prevNearRails < 2){
        //            connects[0]=true;
        //            connects[2]=true;
        //            this.setConnections(connects);
        //        }
        
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