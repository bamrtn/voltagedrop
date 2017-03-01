// Similar to resistor.js, see comments there
var vsource = function(type,posX,posY){
  var vsource = document.createElement('img');
  if (type == 'up') vsource.className = 'vsourceUp';
  if (type == 'down') vsource.className = 'vsourceDown';
  if (type == 'left') vsource.className = 'vsourceLeft';
  if (type == 'right') vsource.className = 'vsourceRight';
  if (type == 'up') vsource.src = 'svg/vsourceUp2.svg';
  if (type == 'down') vsource.src = 'svg/vsourceDown2.svg';
  if (type == 'left') vsource.src = 'svg/vsourceLeft2.svg';
  if (type == 'right') vsource.src = 'svg/vsourceRight2.svg';
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
      this.style.left = this.posX*zoom+offsetX + 'px';
      this.style.top = this.posY*zoom+offsetY-zoom/6 + 'px';
      this.style.width = zoom + 'px';
  		this.style.height = zoom/3 + 'px';
    }else{
      this.style.left = this.posX*zoom+offsetX-zoom/6 + 'px';
      this.style.top = this.posY*zoom+offsetY + 'px';
      this.style.height = zoom + 'px';
  		this.style.width = zoom/3 + 'px';
    }
  };
  vsource.position();

  document.body.appendChild(vsource);

  vsource.snap = function(){
    if (type == 'left' || type == 'right'){
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
  vsource.del = function(){
    nCalc.disconnect(this.conn[0],this.conn[1]);
    this.node1.del();
    this.node2.del();
    this.model.del();
    this.parentNode.removeChild(this);
  };
  vsource.firstDrag = true;
  vsource.moved = false;
  vsource.dragStart = function (event,object){
    this.moved = false;
    select(this);
    if (this.firstDrag){
      this.firstDrag = false;
      this.style.left = event.clientX +'px';
  		this.style.top = event.clientY + 'px';
    }
    event.preventDefault();
  };
  vsource.dragWhile = function(event,object){
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
  vsource.dragEnd = function (event,object){
    this.snap();
    if (this.moved){
      this.createNodes();
      this.model = new scene.vsource(this.type,this.posX,this.posY);
    }
    event.preventDefault();
  };
  vsource.addDTListener(vsource.dragStart,vsource.dragWhile,vsource.dragEnd,undefined);
  return vsource;
};
