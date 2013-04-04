/* 
 * Copyright Luke Wallin 2012
 * 
 * idea - when jumping across a set of 'points' how about some sparks?
 * 
 */


var Cart = function(cellPos,cell){
    //this.dir=dir;
    //not integers.  (0,0) is the top left of cell (0,0);
    //this.pos=pos;
    
    //will always draw as a 100x100 with the top left at -50,-50
    this.draw=function(ctx){
        ctx.fillStyle="rgb(128,128,128)";
        
        //facing left-right
        ctx.fillRect(-40,-30,80,60);
        
        
        ctx.fillStyle="rgb(100,100,100)";
        ctx.fillRect(-35,-25,70,50);
    }
    
    
    //where is cell?
    this.cellPos=cellPos;
    this.cell=cell;
    
    this.getPos=function(){
        return this.cellPos.add(this.dirAndProgressToPos(this.from, this.to, this.progress));
    }

    //angle to be drawn at, remembering that zero is heading left/right
    this.getAngle=function(){
        return -Math.PI/2 + this.getDir()*Math.PI/2;
    }

    this.getDir=function(){
        //todo make more fancy for curves
        return this.progress < 0.5 ? (this.from+2)%4 : this.to;

    }
    
    this.getCellPos=function(){
        //return new Coords(Math.floor(this.pos.x), Math.floor(this.pos.y));
        return this.cellPos;
    }
    
    //speed in blocks per second
    this.speed=0;
    this.progress=0;
    
//    this.fromDir=0;
//    this.toDir=0;
    
    //neighbours of the cell that is below us and how much time has passed
    this.update=function(nearBy,dT){
        
        /*
         * general idea, if a rail follow it, turning abrumptly at corners.
         * look at neighbours of cellBelow to work out what it should do once it's passed the centre?
         */
        
        var oldProgress=this.progress;
        
        switch(this.cell.getType()){
            case "track":
                if(this.speed > 0){
                    //we are actually moving
                    
                    this.progress += this.speed*dT;
                    
                    if(this.progress > 1){
                        //passed onto the next cell
                        
                        //update the cell position based on where we were headed
                        switch(this.to){
                            case 0:
                                this.cellPos.y--;
                                break;
                            case 1:
                                this.cellPos.x++;
                                break;
                            case 2:
                                this.cellPos.y++;
                                break;
                            case 3:
                                this.cellPos.x--;
                                break;
                        }
                        
                        //set our cell to this new cell we've moved into
                        this.cell = nearBy[this.to];
                        
                        //from is based on where we entered this new cell from
                        this.from = (this.to+2)%4;
                        
                        //atm assuming next cell is a rail
                        this.to = this.getConnectionThatIsnt(this.cell.getConnections(), this.from);
                        this.progress-=1;
                        
                    }
                    
                    
                    if(this.progress < 0.5){
                        //moving towards centre of cell
                        //nothing complicated here
                    }else{
                        //TODO depending on the neighbour in the to direction, decide what happens
                        //also if we've just passed progress of 0.5, check if anything needs to happen based on THIS cell.
                    }
                    
                    
                    
                }
                break;
        }
    }
    
    //given a direction, produce a unit vector in that direction
    this.dirToVector=function(dir){
        var angle = -Math.PI/2 + dir*Math.PI/2;
        
        return new Vector(Math.cos(angle),Math.sin(angle));
    }
    
    //given from, to and progress, give a relative (to top left) position of the cart
    this.dirAndProgressToPos=function(from,to,progress){
        
        var centre = new Vector(0.5,0.5);
        
        //crude atm
        //TODO improve for curves
        //if(progress<0.5){
            var angle = this.dirToVector(progress > 0.5 ? to : from).multiply(Math.abs(progress-0.5));
            
            return centre.add(angle);
            
        //}
    }
    //from a list of (rail) connections return the one that isn't isnt
    this.getConnectionThatIsnt=function(connections,isnt){
        for(var i=0;i<4;i++){
            if(connections[i] && i!=isnt){
                return i;
            }
        }
        throw "weren't enough connections";
        return -1;
    }
}