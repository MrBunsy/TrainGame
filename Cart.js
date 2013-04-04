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
        ctx.fillRect(-45,-35,90,70);
        
        
        ctx.fillStyle="rgb(100,100,100)";
        ctx.fillRect(-40,-30,80,60);
    }
    
    this.getType=function(){
        return "cart";
    }
    
    //where is cell?
    this.cellPos=cellPos;
    this.cell=cell;
    
    this.derailed=false;
    
    this.getPos=function(){
        return this.cellPos.add(this.dirAndProgressToPos(this.from, this.to, this.progress));
    }

    //angle to be drawn at, remembering that zero is heading left/right
    this.getAngle=function(){
        if(this.derailed){
            return -Math.PI/4;
        }
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
    this.maxSpeed=3;
    this.friction=0.1;
    this.progress=0;
    this.powerRailBoost = 5;
    
    //    this.fromDir=0;
    //    this.toDir=0;
    
    //neighbours of the cell that is below us and how much time has passed
    this.update=function(nearBy,dt){
        
        /*
         * general idea, if a rail follow it, turning abrumptly at corners.
         * look at neighbours of cellBelow to work out what it should do once it's passed the centre?
         */
        
        var oldProgress=this.progress;
        
        switch(this.cell.getType()){
            case "track":
                
                if(this.speed > 0){
                    this.progress += Math.min(this.speed,this.maxSpeed)*dt;
                    this.speed-=this.friction*dt;
                }
                    
                
                
                //this could happen if we've been sitting still for a while
                if(this.progress >= 0.5 && oldProgress <= 0.5){
                    //just passed the centre
                    switch(this.cell.getTrackType()){
                        case "powered":
                            if(this.cell.providesPower(-1)>0){
                                //rail is powered, boost the speed!
                                //TODO limit the maximum boost
                                if(this.speed > 0){
                                    //if already moving, boost speed
                                    this.speed+=this.powerRailBoost;
                                }else{
                                    //not moving, don't do anything unless there's a solid block on one side
                                    
                                    if(nearBy[this.from].getType()=="block"){
                                        //block behind is solid
                                        //GOGOGO!
                                        this.speed+=this.powerRailBoost;
                                    }else if(nearBy[this.from].getType()=="block"){
                                        //block in front is solid, turn around and
                                        //then GO!
                                        var oldFrom=this.from;
                                        this.from=this.to;
                                        this.to = oldFrom;
                                        this.speed+=this.powerRailBoost;
                                    }
                                    
                                    
                                }
                            }else{
                                //not powered, stop the cart
                                this.speed=0;
                                this.progress=0.5;
                            }
                            break;
                    }
                    //check what is coming next
                    switch(nearBy[this.to].getType()){
                        case "track":
                            //carry on

                            break;
                        case "block":
                            //bounce
                            var oldFrom=this.from;
                            this.from=this.to;
                            this.to = oldFrom;
                            break;
                        case "empty":
                            //derail, TODO
                            break;
                    }
                }
                
                
                if(this.speed > 0){
                //we are (still) actually moving
                    
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
                        
                        switch(this.cell.getType()){
                            case "track":
                                this.to = this.getConnectionThatIsnt(this.cell.getConnections(), this.from);
                                this.progress-=1;
                                break;
                            default:
                                this.progress=0.5;
                                this.speed=0;
                                this.derailed=true;
                                break;
                        }
                        //atm assuming next cell is a rail
                        

                    }
                        
                        
                        
                    
                //                    if(this.progress < 0.5){
                //                        //moving towards centre of cell
                //                        //nothing complicated here
                //                    }else{
                //                        //TODO depending on the neighbour in the to direction, decide what happens
                //                        //also if we've just passed progress of 0.5, check if anything needs to happen based on THIS cell.
                //                    }
                    
                    
                    
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
    
    this.firstPlaced=function(){
        
        this.from=-1;
        this.to=-1;
        
        if(this.cell!=null){
            //we're actually on a cell
            //set from and to from the connections of the cell
            //doens't really matter which is which
            for(var i=0;i<4;i++){
                if(this.cell.getConnections()[i]){
                    if(this.from<0){
                        this.from=i;
                    }else{
                        this.to=i;
                    }
                }
            }
        }
        
        this.progress=0.5;
        this.speed=0;
    }
    
    
    this.firstPlaced();
    
}