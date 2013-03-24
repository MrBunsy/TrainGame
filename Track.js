/* 
 * Copyright Luke Wallin 2012
 */


var Track = function(pos,connects){
    
    var connections=0;
    for(var i=0;i<4;i++){
        if(connects[i]){
            connections++;
        }
    }
        
    if(connections !=2){
        throw "Invalid connections";
    }
    
    this.pos=pos;
    
     /**
     * x - xcoord
     * y - ycoord
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
            if(connects[i]){
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
}