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
    
//    if(connections!=null){
//        this.setConnections(connections);
//    }else{
        this.setConnections([true,false,true,false]);
//    }
    
    
}