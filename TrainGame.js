/* 
 * Copyright Luke Wallin 2012
 */

var TrainGame = function(div,div2){
    var self=this;
    
    this.div=div;
    
    this.mainDiv = new DivController(div,1);
    
    this.width = this.mainDiv.width;
    this.height = this.mainDiv.width;
    
    this.thread=false;
    this.running=false;
    
    this.framerate=30;
    
    this.interval=1000/this.framerate;
    this.dt = this.interval/1000;
    
    this.state="new";
    
    
    
    //this.animationController=new AnimationController(this.mainDiv.ctxs[2], 30,this.width,this.height);
    
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
        
        for(var x=0;x<this.cellsWide;x++){
            this.cells[x] = [];
            for(var y=0;y<this.cellsHigh;y++){
                this.cells[x][y] = new Cell();
            }
        }
    }
    
    //run through everything and update everything
    this.updateCells=function(){
        var anythingChanged=false;
        var count=0;
        
        do{
            for(var x=0;x<this.cellsWide;x++){
                for(var y=0;y<this.cellsHigh;y++){
                    var nearBy = this.getNeighbours(x,y);
                    
                    if(this.cells[x][y].update(nearBy)){
                        anythingChanged=true;
                    }
                }
            }
            
            count++;
        //check count so we can't get stuck in inifinite loop
        }while(anythingChanged && count < 10)
        
    }
    
    this.tidyCoords = function(x,y){
        x+=this.cellsWide;
        x%=this.cellsWide;
        
        y+=this.cellsHigh;
        y%=this.cellsHigh;
        
        return new Coords(x,y);
    }
    
    this.getNeighbours=function(x,y){
        var near = new Array(4);
        near[0] = this.getCell(this.tidyCoords(x,y-1));
        near[1] = this.getCell(this.tidyCoords(x+1,y));
        near[2] = this.getCell(this.tidyCoords(x,y+1));
        near[3] = this.getCell(this.tidyCoords(x-1,y));
        
        return near;
    }
    
    this.getCell=function(coords){
        return this.cells[coords.x][coords.y];
    }
    
    this.cells=[];
    
    this.draw=function(){
        
        this.mainDiv.ctxs[0].clearRect(0,0,this.width+1,this.height+1);
        this.mainDiv.ctxs[0].lineWidth=0.5;
        //draw a grid
        for(var x=0;x<this.cellsWide+1;x++){
            this.mainDiv.ctxs[0].beginPath();
            
            this.mainDiv.ctxs[0].moveTo(Math.round(this.cellSize*x)+0.5,0);
            this.mainDiv.ctxs[0].lineTo(Math.round(this.cellSize*x)+0.5,this.height+0.5);
            
            this.mainDiv.ctxs[0].stroke();
        }
        
        for(var y=0;y<this.cellsHigh+1;y++){
            this.mainDiv.ctxs[0].beginPath();
            
            this.mainDiv.ctxs[0].moveTo(0,Math.round(this.cellSize*y)+0.5);
            this.mainDiv.ctxs[0].lineTo(this.width+0.5, Math.round(this.cellSize*y)+0.5);
            
            this.mainDiv.ctxs[0].stroke();
        }
        
        
        for(var x=0;x<this.cellsWide;x++){
            for(var y=0;y<this.cellsHigh;y++){
            
            
            
                this.mainDiv.ctxs[0].save();

                //var blockPos = this.cells[i].pos.multiply(this.cellSize);

                this.mainDiv.ctxs[0].translate(x*this.cellSize+this.cellSize/2, y*this.cellSize+this.cellSize/2);
                this.mainDiv.ctxs[0].scale(this.cellSize/100,this.cellSize/100);
                //this.ctxs[0].scale(0.1);

                this.cells[x][y].draw(this.mainDiv.ctxs[0]);

                this.mainDiv.ctxs[0].restore();
            }
            
        }
    }
    //the user has clicked a cell
    this.cellPressed=function(x,y){
        if(self.cells[x][y].getType()=="track"){
            self.cells[x][y] = new Cell();
        }else{
            self.cells[x][y] = new Track();
        }
        
        self.updateCells();
        self.draw();
    }
    
    this.mousePressed=false;
    this.mouseLastCell=new Coords(-1,-1);
    
//    this.getMousePos=function(e){
//        var x,y;
//                
//        if(e.pageX || e.pageY){
//            x=e.pageX;
//            y=e.pageY;
//        }else {
//            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
//            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
//        }
//        
//        var canvasPos = $("#"+this.div.id).offset();
//        //var canvasPos = $(this.canvas).offset();
//        
////        x-=self.canvas.offsetLeft;
////        y-=self.canvas.offsetTop;
//        x-=canvasPos.left;
//        y-=canvasPos.top;
//        
//        //if we're  using an inverted y axis, readjust mouse click pos
//        if(self.inverted){
//            y+=(self.height/2-y)*2
//        }
//        
//        return new Vector(x,y);
//    }
    
    
    
    this.mouseDown=function(mousePos){
        var x = Math.floor(mousePos.x/self.cellSize);
        var y = Math.floor(mousePos.y/self.cellSize);
        
        self.cellPressed(x,y);
        
        self.mouseLastCell.x=x;
        self.mouseLastCell.y=y;
        self.mousePressed=true;
    }
    
    this.mouseMove=function(mousePos){
        //var mousePos = self.getMousePos(e);
        var x = Math.floor(mousePos.x/self.cellSize);
        var y = Math.floor(mousePos.y/self.cellSize);
        
        if(self.mousePressed){
            //mouse is being dragged
            if(x!=self.mouseLastCell.x || y !=self.mouseLastCell.y){
                //now over a different cell
                self.mouseLastCell.x=x;
                self.mouseLastCell.y=y;
                self.cellPressed(x,y);
            }
        }
    }
    
    this.mouseUp=function(mousePos){
        self.mousePressed=false;
    }
    
    this.generateCellSize(25,25);
    
//    this.div.addEventListener("mousedown", this.mouseDown,false);
//    this.div.addEventListener("mouseup", this.mouseUp,false);
//    this.div.addEventListener("mousemove", this.mouseMove,false);

    this.mainDiv.setMouseDown(this.mouseDown);
    this.mainDiv.setMouseUp(this.mouseUp);
    this.mainDiv.setMouseMove(this.mouseMove);
   
}

var Coords = function(x,y){
    this.x=x;
    this.y=y;
}

var DivController = function(div,canvases){
    var self=this;
    
    this.div=div;
    
    this.width=parseInt(this.div.style.width);
    this.height=parseInt(this.div.style.height);
    this.pos = new Vector(this.div.offsetLeft,this.div.offsetTop);
    
    this.mouseDownCallback=function(pos){
    }
    
    this.mouseMoveCallback=function(pos){
    }
    
    this.mouseUpCallback=function(pos){
    }
    
    this.setMouseDown=function(callback){
        this.mouseDownCallback=callback;
    }
    
    this.setMouseUp=function(callback){
        this.mouseUpCallback=callback;
    }
    
    this.setMouseMove=function(callback){
        this.mouseMoveCallback=callback;
    }
    
    this.canvases=[];
    //[background, entities, animations, hud]
    this.ctxs=[];
    
    for(var i=0;i<canvases;i++){
        this.canvases[i] = document.createElement("canvas");
        this.canvases[i].width=this.width+1;
        this.canvases[i].height=this.height+1;
        this.canvases[i].style.position="absolute";
        this.canvases[i].style.top=this.pos.y+1;
        this.canvases[i].style.left=this.pos.x+1;
        
        this.div.appendChild(this.canvases[i]);
        
        this.ctxs[i]=this.canvases[i].getContext("2d");
    }
    
    
    
    
    this.getMousePos=function(e){
        var x,y;
                
        if(e.pageX || e.pageY){
            x=e.pageX;
            y=e.pageY;
        }else {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        
        var canvasPos = $("#"+self.div.id).offset();
        x-=canvasPos.left;
        y-=canvasPos.top;
        
        return new Vector(x,y);
    }
    
    
    
    this.mouseDown=function(e){
        var mousePos = self.getMousePos(e);
        self.mouseDownCallback(mousePos);
    }
    
    this.mouseMove=function(e){
        var mousePos = self.getMousePos(e);
        self.mouseMoveCallback(mousePos);
    }
    
    this.mouseUp=function(e){
        var mousePos = self.getMousePos(e);
        self.mouseUpCallback(mousePos);
    }
    
//    //not sure if to use this or not
//    this.assignEventHandler = function(event,handler){
//        this.div.addEventListener(event, handler,false);
//    }
    
    
    this.div.addEventListener("mousedown", this.mouseDown,false);
    this.div.addEventListener("mouseup", this.mouseUp,false);
    this.div.addEventListener("mousemove", this.mouseMove,false);
}