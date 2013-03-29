/* 
 * Copyright Luke Wallin 2012
 */


var Track = function(connections){
    
    this.setConnections=function(connections){
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
    
    this.update=function(nearBy){
     
        var nearRails = 0;
        //find how many rails nearby
        for(var i=0;i<4;i++){
            if(nearBy[i].getType()=="track"){
                nearRails++;
            }
        }
        
        //find out how many nearby rails point towards us
        var pointAtUs=0;
        var dirs=[];
        for(var i=0;i<4;i++){
            if(nearBy[i].getType()=="track" && nearBy[i].getConnections()[(i+2)%4]){
                pointAtUs++;
                dirs.push(i);
            }
        }
        
        var connects = [false,false,false,false];
        //console.log("x:"+x+",y:"+y+" nearrails:"+nearRails);
        if(nearRails==1){
            for(var j=0;j<4;j++){
                if(nearBy[j].getType()=="track"){
                    connects[j]=true;
                    connects[(j+2)%4]=true;
                }
            }
            this.setConnections(connects);
        }else
//        if(nearRails==2){
//            //link the two together
//            for(var j=0;j<4;j++){
//                if(nearBy[j].getType()=="track"){
//                    connects[j]=true;
//                }
//            }
//            this.setConnections(connects);
//
//        }else 
            if (nearRails >=2 && this.prevNearRails < 2){
            //find how many nearby point towards this rail
            
            
            //TODO compare this with minecraft
            if(pointAtUs==1){
                //if only one, link to that and be straight
                connects[dirs[0]]=true;
                connects[(dirs[0]+2)%4]=true;
            }else if(pointAtUs == 2){
                //if only two, link those
                connects[dirs[0]]=true;
                connects[dirs[1]]=true;
            }else{
                //if three, use the logic:
            
                //find the empty nearby and then make the next two linked
                for(var j=0;j<4;j++){
                    if(nearBy[j].getType()!="track"){
                        connects[(j+1)%4]=true;
                        connects[(j+2)%4]=true;
                        break;
                    }
                }
            }
            this.setConnections(connects);
        }
        //        else if(nearRails==4 && this.prevNearRails < 2){
        //            connects[0]=true;
        //            connects[2]=true;
        //            this.setConnections(connects);
        //        }
        
        this.prevNearRails=nearRails;
        
        //TODO does this need to matter?
        return false;
    }
    
    this.prevNearRails=0;
    
    //    if(connections!=null){
    //        this.setConnections(connections);
    //    }else{
    this.setConnections([true,false,true,false]);
//    }
    
    
}