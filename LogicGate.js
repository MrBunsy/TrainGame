/* 
 * Copyright Luke Wallin 2012
 */

/**
 * A logic gate has one output and up to three inputs
 * 
 * Idea of using one class is to avoid too much duplication
 *
 **/
var LogicGate = function(){
    
    
    //function(a,b,c){returns Boolean}
    //this.logic=LogicGate.not;
    
    /*
     *"not"
     *"or"
     *"and"
     *"nand"
     *"nor" -- same as not?
     */
    this.logicType="not"
    
    //will always draw as a 100x100 with the top left at -50,-50
    this.draw=function(ctx){
        ctx.strokeStyle="rgb(0,0,0)"
        ctx.lineWidth=5;
        ctx.strokeRect(-50,-50,100,100)
        
        ctx.fillStyle="rgb(0,0,0)";
        ctx.font="25pt Arial bold, sans-serif";
        ctx.textBaseline="middle";
        ctx.textAlign="center";
        
        //placeholder
        ctx.fillText(this.logicType,0,0);
        
        switch(this.logicType){
            case "not":
                
                break;
        }
    }
    
    /*
     * "track"
     * "empty"
     * "power"
     * "wire"
     * "repeater"
     * "block"
     */
    this.getType=function(){
        return "empty"
    }
    
    //nearBy = array of cells directly next to [top, right, bottom, left]
    //time = current time of simulation
    //onTop = array of any objects currently on top of this cell (eg minecart)
    this.update=function(nearBy,time,onTop){
        //return true if anything changed
        return false;
    }
    
    //returns int, 0 = no power, increasing numbers is increasing quantity
    this.providesPower=function(ourPos){
        return 0;
    }
    
    //ourPos is our position relative to them.  Eg, 2 = they are above us
    this.connectsPower=function(ourPos){
        return false;
    }
}

LogicGate.or=function(a,b,c){
    return a || b || c;
}

//ors the inputs and nots the output
LogicGate.not=function(a,b,c){
    return !LogicGate.or(a,b,c);
}

LogicGate.and=function(a,b,c){
    return a && b && c;
}