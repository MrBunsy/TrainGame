/* 
 * Copyright Luke Wallin 2012
 */

var TrainGame = function(div){
    var self=this;
    this.div=div;
    
    
    this.width=parseInt(this.div.style.width);
    this.height=parseInt(this.div.style.height);
    this.pos = new Vector(this.div.offsetLeft,this.div.offsetTop);
    
    
    this.thread=false;
    this.running=false;
    
    this.framerate=30;
    
    this.interval=1000/this.framerate;
    this.dt = this.interval/1000;
    
    this.state="new";
    
    this.canvases=[];
    //[background, entities, animations, hud]
    this.ctxs=[];
    
    for(var i=0;i<1;i++){
        this.canvases[i] = document.createElement("canvas");
        this.canvases[i].width=this.width;
        this.canvases[i].height=this.height;
        this.canvases[i].style.position="absolute";
        this.canvases[i].style.top=this.pos.y+1;
        this.canvases[i].style.left=this.pos.x+1;
        
        this.div.appendChild(this.canvases[i]);
        
        this.ctxs[i]=this.canvases[i].getContext("2d");
    }
    
    this.animationController=new AnimationController(this.ctxs[2], 30,this.width,this.height);
    
    //we'll call the animation loop from here
    //this.animationController.setSelfRunning(false);
    
    //how many cells can be viewed at once
    this.cellsWide = 10;
    this.cellsHigh = 10;
    this.cellSize=10;
    
    
    this.generateCellSize=function(cellsWide,cellsHigh){
        this.cellsWide = cellsWide;
        this.cellsHigh = cellsHigh;
        
        this.cellSize=this.width/this.cellsWide;
        //this.cellHeighth=this.height/this.cellsHigh;
    }
    
    
    this.blocks=[];
    
    this.draw=function(){
        
        this.ctxs[0].clearRect(0,0,this.width,this.height);
        
        //draw a grid
        for(var x=0;x<this.cellsWide+1;x++){
            this.ctxs[0].beginPath();
            
            this.ctxs[0].moveTo(this.cellSize*x,0);
            this.ctxs[0].lineTo(this.cellSize*x,this.height);
            
            this.ctxs[0].stroke();
        }
        
        for(var y=0;y<this.cellsHigh+1;y++){
            this.ctxs[0].beginPath();
            
            this.ctxs[0].moveTo(0,this.cellSize*y);
            this.ctxs[0].lineTo(this.width, this.cellSize*y);
            
            this.ctxs[0].stroke();
        }
        
        
        for(var i=0;i<this.blocks.length;i++){
            
            
            
            this.ctxs[0].save();
            
            var blockPos = this.blocks[i].pos.multiply(this.cellSize);
            
            this.ctxs[0].translate(blockPos.x+this.cellSize/2, blockPos.y+this.cellSize/2);
            this.ctxs[0].scale(this.cellSize/100,this.cellSize/100);
            //this.ctxs[0].scale(0.1);
            
            this.blocks[i].draw(this.ctxs[0]);
            
            this.ctxs[0].restore();
            
        }
    }
    
    
    this.generateCellSize(10,10);
   
}