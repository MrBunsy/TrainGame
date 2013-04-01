/* 
 * Copyright Luke Wallin 2012
 * 
 * idea - when jumping across a set of 'points' how about some sparks?
 * 
 */


var Cart = function(pos,dir){
    this.dir=dir;
    //not integers.  (0,0) is the centre of cell (0,0);
    this.pos=pos;
    
    this.getPos=function(){
        return this.pos;
    }
    
    this.speed=0;
    
    //which cell is below us and how much time has passed
    this.update=function(cellBelow,dT){
        
        /*
         * general idea, if a rail follow it, turning abrumptly at corners.
         * look at neighbours of cellBelow to work out what it should do once it's passed the centre?
         */
        
        switch(this.cellBelow.getType()){
            case "track":
                
                break;
        }
    }
    
}