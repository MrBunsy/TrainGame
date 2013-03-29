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
     */
    this.getType=function(){
        return "empty"
    }
    
    this.update=function(nearBy){
        //return true if anything changed
        return false;
    }
}