/* 
 * Copyright Luke Wallin 2012
 * 
 * TODO:
 * 
 * buttons + hand tool for pressing buttons
 * levers
 * logic blocks
 * 
 * pickaxe for deleting blocks?
 * 
 * atm it is possible to change the cell under the cart and it won't have any idea.
 * 
 */

var TrainGame = function(div,div2){
    var self=this;
    
    //this.div=div;
    
    this.mainDiv = new DivController(div,1);
    this.toolBoxDiv = new DivController(div2, 1);
    
    
    this.width = this.mainDiv.width;
    this.height = this.mainDiv.width;
    
    this.toolWidth = this.toolBoxDiv.width;
    this.toolHeight = this.toolBoxDiv.height;
    
    this.thread=false;
    this.running=false;
    
    this.framerate=10;
    
    //interval is in milliseconds
    this.interval=1000/this.framerate;
    //time difference, in seconds between each frame
    this.dt = this.interval/1000;
    this.time=0;
    
    //this.state="new";
    
    this.tools=["track","power","wire","repeater","block","delete","cart"];
    this.selectedTool="track";
    
    //stuff that can move/do things
    this.entities=[];
    
    //this.animationController=new AnimationController(this.mainDiv.ctxs[2], 30,this.width,this.height);
    
    //we'll call the animation loop from here
    //this.animationController.setSelfRunning(false);
    
    //how many cells can be viewed at once
    this.cellsWide = 10;
    this.cellsHigh = 10;
    this.cellSize=10;
    
    this.toolsWide=4;
    this.toolsHigh=4;
    this.toolsSize=10;
    
    this.generateCellSize=function(cellsWide,cellsHigh){
        this.cellsWide = cellsWide;
        this.cellsHigh = cellsHigh;
        
        this.cellSize=this.width/this.cellsWide;
        
        this.toolSize = this.toolWidth/this.toolsWide;
        //this.cellHeighth=this.height/this.cellsHigh;
        
        for(var x=0;x<this.cellsWide;x++){
            this.cells[x] = [];
            for(var y=0;y<this.cellsHigh;y++){
                this.cells[x][y] = new Cell();
            }
        }
    }
    
    
    this.start=function(){
        //little hack so that when this.update is called 'this' works as you expect
        this.thread = setInterval(function(){
            self.update.call(self)
        }, this.interval);
    }
    
    this.update=function(){
        this.time+=this.dt;
        
        this.updateCells();
        this.updateEntities();
        
        this.draw();
    }
    
    this.updateEntities=function(){
        for(var i=0;i<this.entities.length;i++){
            var e = this.entities[i];
            //where is this entity?
            var cellPos = e.getCellPos();
            //give it neighbours and get it to update
            e.update(this.getNeighbours(cellPos.x,cellPos.y), this.dt);
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
                    
                    if(this.cells[x][y].update(nearBy,this.time,this.getEntitiesHere(x,y))){
                        anythingChanged=true;
                    }
                }
            }
            
            count++;
        //check count so we can't get stuck in inifinite loop
        }while(anythingChanged && count < 100)
        
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
    
    this.getNewCell=function(name){
        switch(name){
            case "track":
                return  new Track();
                break;
            case "power":
                return  new Power();
                break;
            case "wire":
                return  new Wire();
                break;
            case "repeater":
                return  new Repeater();
                break;
            case "block":
                return  new Block();
                break;
            case "cart":
                //not strictly a block
                return new Cart(null, null);
                break;
            default:
                return new Cell();
                break;
                
        }
    }
    
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
        
        //draw all the cells
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
        
        //draw the entities
        for(var i=0;i<this.entities.length;i++){
            
            
            //var cellPos = this.entities[i].getCellPos();
            var pos = this.entities[i].getPos();
            
            this.mainDiv.ctxs[0].save();

            //var blockPos = this.cells[i].pos.multiply(this.cellSize);

            var angle = this.entities[i].getAngle();
                
            this.mainDiv.ctxs[0].translate(pos.x*this.cellSize, pos.y*this.cellSize);
            this.mainDiv.ctxs[0].scale(this.cellSize/100,this.cellSize/100);
            
            this.mainDiv.ctxs[0].rotate(angle);
            
            this.entities[i].draw(this.mainDiv.ctxs[0]);

            this.mainDiv.ctxs[0].restore();
        }
        
        //draw the toolbox
        this.toolBoxDiv.ctxs[0].clearRect(0,0,this.toolBoxDiv.width+1,this.toolBoxDiv.height+1);
        //        for(var i=0;i<this.tools.length;i++){
        //            this.toolBoxDiv.ctxs[0].strokeRect(i*this.cellSize,0,this.cellSize,this.cellSize);
        //            
        //        }

        //draw a grid
        for(var x=0;x<this.toolsWide;x++){
            this.toolBoxDiv.ctxs[0].beginPath();
            
            this.toolBoxDiv.ctxs[0].moveTo(Math.floor(this.toolSize*x)+0.5,0);
            this.toolBoxDiv.ctxs[0].lineTo(Math.floor(this.toolSize*x)+0.5,this.toolHeight+0.5);
            
            this.toolBoxDiv.ctxs[0].stroke();
        }
        
        for(var y=0;y<this.toolsHigh;y++){
            this.toolBoxDiv.ctxs[0].beginPath();
            
            this.toolBoxDiv.ctxs[0].moveTo(0,Math.floor(this.toolSize*y)+0.5);
            this.toolBoxDiv.ctxs[0].lineTo(this.toolWidth+0.5, Math.floor(this.toolSize*y)+0.5);
            
            this.toolBoxDiv.ctxs[0].stroke();
        }
        
        for(var i=0;i<this.tools.length;i++){
            var x=i%this.toolsWide;
            var y = Math.floor(i/this.toolsWide);
            
            this.toolBoxDiv.ctxs[0].save();

            //var blockPos = this.tools[i].pos.multiply(this.toolSize);

            this.toolBoxDiv.ctxs[0].translate(x*this.toolSize+this.toolSize/2, y*this.toolSize+this.toolSize/2);
            this.toolBoxDiv.ctxs[0].scale(this.toolSize/100,this.toolSize/100);
            //this.ctxs[0].scale(0.1);
            
            //if this is the tool currently selected, highlight the background with 
            if(this.selectedTool==this.tools[i]){
                this.toolBoxDiv.ctxs[0].fillStyle="rgb(255,255,0)";
                this.toolBoxDiv.ctxs[0].fillRect(-50,-50,100,100);
            }
            
            var cell = this.getNewCell(this.tools[i]);
            
            //anything special for any of the tools' icons?
            switch(this.tools[i]){
                case "wire":
                    cell.setConnections([true,true,true,true]);
                    break;
            }
            
            cell.draw(this.toolBoxDiv.ctxs[0]);
            

            this.toolBoxDiv.ctxs[0].restore();
            
        }
        
    }
    
    //not sure yet if more than one entity will ever be allowed on the same cell
    this.getEntitiesHere=function(x,y){
        var entities=[];
        for(var i=0;i<this.entities.length;i++){
            var cellPos = this.entities[i].getCellPos();
            if(cellPos.x == x && cellPos.y == y){
                //this entity is on this block
                //remove it
                entities.push(this.entities[i]);
            }
        }
        return entities;
    }
    
    //the user has clicked a cell
    this.cellPressed=function(x,y){
        switch(self.selectedTool){
            case "cart":
                
                var c = new Cart(new Vector(x,y), self.cells[x][y]);
                //                c.speed = 0.5;
                //                c.from=3;
                //                c.to=1;
                //                c.progress=0.5;
                
                self.entities.push(c)
                
                break;
            case "delete":
                //if entity is present, remove it,
                //otherwise remove teh block
                var removedEntity=false;
                
                //TODO use getEntities
                for(var i=0;i<self.entities.length;i++){
                    var cellPos = self.entities[i].getCellPos();
                    if(cellPos.x == x && cellPos.y == y){
                        //this entity is on this block
                        //remove it
                        self.entities.splice(i, 1);
                        removedEntity=true;
                        break;
                    }
                }
                
                if(!removedEntity){
                    if(self.cells[x][y].getType()!="empty"){
                        self.cells[x][y]=new Cell();
                    }
                }
                
                break;
            default:
                //block related things
                if(self.cells[x][y].getType()=="empty"){
                    //self.cells[x][y] = new Cell();
                    switch(self.selectedTool){
                        case "delete":
                            //don't do anything on an empty cell with the delete tool
                            break;
                        default:
                            self.cells[x][y] = this.getNewCell(self.selectedTool);
                            break;
                    }
                }
                else{
                    //pressed a cell with something already tehre
                    switch(self.selectedTool){
                        case "delete":
                            //empty this cell
                            self.cells[x][y] = new Cell();
                            break;
                        case "repeater":
                            //increment the delay of the repeater
                            if(self.cells[x][y].incrementDelay()){
                                //if it's gone back to zero, remove it
                                self.cells[x][y] = new Cell();
                            }
                            break;
                        case "track":
                            //go through the different types of track
                            if(self.cells[x][y].incrementType()){
                                //if it's gone back to normal track, remove it
                                self.cells[x][y] = new Cell();
                            }
                            break;
                        default:
                            //remove whatever it was
                            if(self.cells[x][y].getType()==self.selectedTool){
                                self.cells[x][y] = new Cell();
                            }
                            break;
                    }
                }
                break;
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
    
    
    this.toolPressed=function(mousePos){
        var x = Math.floor(mousePos.x/self.toolSize);
        var y = Math.floor(mousePos.y/self.toolSize);
        
        var t = x+self.toolsWide*y;
        if(t<self.tools.length){
            self.selectedTool = self.tools[t];
            self.draw();
        }
    }
    
    
    this.generateCellSize(25,25);
    
    //    this.div.addEventListener("mousedown", this.mouseDown,false);
    //    this.div.addEventListener("mouseup", this.mouseUp,false);
    //    this.div.addEventListener("mousemove", this.mouseMove,false);

    this.mainDiv.setMouseDown(this.mouseDown);
    this.mainDiv.setMouseUp(this.mouseUp);
    this.mainDiv.setMouseMove(this.mouseMove);
    
    this.toolBoxDiv.setMouseDown(this.toolPressed);
    
    this.start();
   
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