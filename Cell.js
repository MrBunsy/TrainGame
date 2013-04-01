/* 
 * Copyright Luke Wallin 2012
 */

//this is an empty cell also acting as a fake interface - so I know what methods will need to be implemented
var Cell = function(){
    
    //will always draw as a 100x100 with the top left at -50,-50
    this.draw=function(ctx){
        
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
    
    this.update=function(nearBy,dT){
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