/* 
 * Copyright Luke Wallin 2012
 */


var Cart = function(x,y,dir){
    this.dir=dir;
    //not integers.  (0,0) is the centre of cell (0,0);
    this.x=x;
    this.y=y;
    
    this.speed=0;
    this.momentum=0;
}