var resistor = function(type,posX,posY){
  // Create canvasvg element
  var resistor = {t:'image',x:posX*100,y:posY*100,
    src:(type == 'vertical'?imgResVer:imgResHor)};
  resistor.model = new scene.resistor(type,posX,posY);
  resistor.type = type;
  resistor.posX = posX;
  resistor.posY = posY;
  resistor.voltage = 0;
  resistor.current = 0;
  resistor.power = 0;
  resistor.param = 10;
  // Create nodes, lines are created by them
  resistor.createNodes = function(){
    if (this.type == 'horizontal'){
      this.node1 = new node('left',this.posX,this.posY,this);
      this.node2 = new node('right',this.posX+1,this.posY,this);
    }else{
      this.node1 = new node('top',this.posX,this.posY,this);
      this.node2 = new node('bottom',this.posX,this.posY+1,this);
    }
    this.conn = nCalc.connect(this.node1,this.node2,this);
  };
  resistor.createNodes();

  // Reposition resistor
  resistor.position = function(){
    if (this.type == 'horizontal'){
      this.x = this.posX*100-10;
      this.y = this.posY*100-13;
    }else{
      this.x = this.posX*100-13;
      this.y = this.posY*100-10;
    }
  };
  resistor.position();

  eImage.ch[1].ch[0].addChild(resistor);

  // Snap resistor to grid on repositioning
  resistor.snap = function(){
    if (type == 'horizontal'){
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
  // Delete resistor
  resistor.del = function(){
    nCalc.disconnect(this.conn[0],this.conn[1]);
    this.node1.del();
    this.node2.del();
    this.model.del();
    eImage.ch[1].ch[0].delChild(this);
  };
  // Handle resistor dragging
  resistor.moved = false;
  resistor.dragStart = function (event,object){
    event.preventDefault();
    this.moved = false;
    select(this);
    eImage.ch[1].ch[0].delChild(this);
    eImage.ch[2].ch[1].addChild(this);
    this.x = offsetX+zoom*this.posX-(this.type == 'horizontal'?0.1*zoom:0.13*zoom);
		this.y = offsetY+zoom*this.posY-(this.type == 'vertical'?0.1*zoom:0.13*zoom);
  };
  resistor.dragWhile = function(event,object){
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
  resistor.dragEnd = function (event,object){
    event.preventDefault();
    this.snap();
    eImage.ch[2].ch[1].delChild(this);
    eImage.ch[1].ch[0].addChild(this);
    this.position();
    if (this.moved){
      this.createNodes();
      this.model = new scene.resistor(this.type,this.posX,this.posY);
    }
  };
  dtCanvas.addDTListener(resistor,resistor.dragStart,resistor.dragWhile,resistor.dragEnd,undefined);
  return resistor;
};
