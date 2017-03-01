var resistor = function(type,posX,posY){
  // Create html elements
  var legs = document.createElement('div');
  legs.className = (type == 'horizontal'?
    'horizontalResistorLegs':'verticalResistorLegs');
  var body = document.createElement('div');
  body.className = (type == 'horizontal'?
    'horizontalResistorBody':'verticalResistorBody');
  var resistor = document.createElement('div');
  resistor.className = (type == 'horizontal'?
    'horizontalResistor':'verticalResistor');
  resistor.appendChild(legs);
  resistor.appendChild(body);
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
      this.style.left = this.posX*zoom+offsetX-2 + 'px';
      this.style.top = this.posY*zoom+offsetY-zoom/10-2 + 'px';
      this.style.width = zoom + 'px';
  		this.style.height = zoom/5 + 'px';
    }else{
      this.style.left = this.posX*zoom+offsetX-zoom/10-2 + 'px';
      this.style.top = this.posY*zoom+offsetY-2 + 'px';
      this.style.height = zoom + 'px';
  		this.style.width = zoom/5 + 'px';
    }
  };
  resistor.position();

  document.body.appendChild(resistor);

  // Snap resistor to grid on repositioning
  resistor.snap = function(){
    if (type == 'horizontal'){
      this.posX = Math.round((this.offsetLeft-offsetX)/zoom);
  		this.posY = Math.round((this.offsetTop+zoom/10-offsetY)/zoom);
      if (this.posX>=size) this.posX = size - 1;
      if (this.posX<0) this.posX = 0;
      if (this.posY>size) this.posY = size;
      if (this.posY<0) this.posY = 0;
    }else{
      this.posX = Math.round((this.offsetLeft+zoom/10-offsetX)/zoom);
      this.posY = Math.round((this.offsetTop-offsetY)/zoom);
      if (this.posX>size) this.posX = size;
      if (this.posX<0) this.posX = 0;
      if (this.posY>size-1) this.posY = size - 1;
      if (this.posY<0) this.posY = 0;
    }
    this.position();
  };
  // Delete resistor
  resistor.del = function(){
    nCalc.disconnect(this.conn[0],this.conn[1]);
    this.node1.del();
    this.node2.del();
    this.model.del();
    this.parentNode.removeChild(this);
  };

  // Handle resistor dragging
  resistor.firstDrag = true;
  resistor.moved = false;
  resistor.dragStart = function (event,object){
    this.moved = false;
    select(this);
    if (this.firstDrag){
      this.firstDrag = false;
      this.style.left = event.clientX +'px';
  		this.style.top = event.clientY + 'px';
    }
    event.preventDefault();
  };
  resistor.dragWhile = function(event,object){
    if ((object.startX-object.x)*(object.startX-object.x)+(object.startY-object.y)*(object.startY-object.y)>zoom/7 && !this.moved){
      nCalc.disconnect(this.conn[0],this.conn[1]);
      this.node1.del();
      this.node2.del();
      this.model.del();
      this.moved = true;
    }
		this.style.left = this.offsetLeft+object.movementX + 'px';
		this.style.top = this.offsetTop+object.movementY + 'px';
    event.preventDefault();
  };
  resistor.dragEnd = function (event,object){
    this.snap();
    if (this.moved){
      this.createNodes();
      this.model = new scene.resistor(this.type,this.posX,this.posY);
    }
    event.preventDefault();
  };
  resistor.addDTListener(resistor.dragStart,resistor.dragWhile,resistor.dragEnd,undefined);
  return resistor;
};
