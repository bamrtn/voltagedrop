// Similar to resistor.js, see comments there
var vsource = function(type,posX,posY){
  var vsource = {t:'image',x:posX*100,y:posY*100};
  if (type == 'up') vsource.src = imgVsrUp;
  if (type == 'down') vsource.src = imgVsrDown;
  if (type == 'left') vsource.src = imgVsrLeft;
  if (type == 'right') vsource.src = imgVsrRight;
  vsource.model = new scene.vsource(type,posX,posY);
  vsource.type = type;
  vsource.posX = posX;
  vsource.posY = posY;
  vsource.voltage = 0;
  vsource.current = 0;
  vsource.power = 0;
  vsource.param = 10;
  vsource.createNodes = function(){
    if (this.type == 'left'){
      this.node2 = new node('left',this.posX,this.posY,this);
      this.node1 = new node('right',this.posX+1,this.posY,this);
    }
    if (this.type == 'right'){
      this.node1 = new node('left',this.posX,this.posY,this);
      this.node2 = new node('right',this.posX+1,this.posY,this);
    }
    if (this.type == 'up'){
      this.node2 = new node('top',this.posX,this.posY,this);
      this.node1 = new node('bottom',this.posX,this.posY+1,this);
    }
    if (this.type == 'down'){
      this.node1 = new node('top',this.posX,this.posY,this);
      this.node2 = new node('bottom',this.posX,this.posY+1,this);
    }
    this.conn = nCalc.connect(this.node1,this.node2,this);
  };
  vsource.createNodes();

  vsource.position = function(){
    if (type == 'left' || type == 'right'){
      this.x = this.posX*100-10;
      this.y = this.posY*100-13;
    }else{
      this.x = this.posX*100-13;
      this.y = this.posY*100-10;
    }
  };
  vsource.position();

  eImage.ch[1].ch[0].addChild(vsource);

  vsource.snap = function(){
    if (this.type == 'left' || this.type == 'right'){
      this.posX = Math.round((this.x-offsetX)/zoom);
  		this.posY = Math.round((this.y+zoom/10-offsetY)/zoom);
      if (this.posX>=size) this.posX = size - 1;
      if (this.posX<0) this.posX = 0;
      if (this.posY>size) this.posY = size;
      if (this.posY<0) this.posY = 0;
    }else{
      this.posX = Math.round((this.x+zoom/10-offsetX)/zoom);
      this.posY = Math.round((this.y-offsetY)/zoom);
      if (this.posX>size) this.posX = size;
      if (this.posX<0) this.posX = 0;
      if (this.posY>size-1) this.posY = size - 1;
      if (this.posY<0) this.posY = 0;
    }
  };
  vsource.del = function(){
    nCalc.disconnect(this.conn[0],this.conn[1]);
    this.node1.del();
    this.node2.del();
    this.model.del();
    eImage.ch[1].ch[0].delChild(this);
  };

  vsource.moved = false;
  vsource.dragStart = function (event,object){
    event.preventDefault();
    this.moved = false;
    select(this);
    eImage.ch[1].ch[0].delChild(this);
    eImage.ch[2].ch[1].addChild(this);
    this.x = offsetX+zoom*this.posX-(this.type == 'left' || this.type == 'right'?0.1*zoom:0.13*zoom);
		this.y = offsetY+zoom*this.posY-(this.type == 'up' || this.type == 'down'?0.1*zoom:0.13*zoom);
  };
  vsource.dragWhile = function(event,object){
    event.preventDefault();
    if ((object.startX-object.x)*(object.startX-object.x)+(object.startY-object.y)*(object.startY-object.y)>70 && !this.moved){
      nCalc.disconnect(this.conn[0],this.conn[1]);
      this.node1.del();
      this.node2.del();
      this.model.del();
      this.moved = true;
    }
		this.x += object.movementX;
		this.y += object.movementY;
  };
  vsource.dragEnd = function (event,object){
    event.preventDefault();
    this.snap();
    eImage.ch[2].ch[1].delChild(this);
    eImage.ch[1].ch[0].addChild(this);
    this.position();
    if (this.moved){
      this.createNodes();
      this.model = new scene.vsource(this.type,this.posX,this.posY);
    }
  };
  dtCanvas.addDTListener(vsource,vsource.dragStart,vsource.dragWhile,vsource.dragEnd,undefined);
  return vsource;
};
