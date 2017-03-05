var node = function(type,posX,posY,obj){
  // Creating html object
  var node = {t:'circle',x:posX*100,y:posY*100,r:12,stroke:{color:'#E0E0E0',width:'2'},fill:{color:'rgba(0,0,0,0)'}}
  // Normal nodes are in the background and responsible for the white fill of
  // active nodes.
  if (type !== 'normal'){
    node.lineX = new lineX(posY,posX,posX);
    node.lineY = new lineY(posX,posY,posY);
    var o = nCalc.add(node,posX,posY);
    node.calcID = o.calcID;
    node.gNode = o.gNode;
    eImage.ch[1].ch[3].addChild(node);
  }else{
    node.fill.color = '#E0E0E0';
    node.model = scene.node(posX,posY);
    eImage.ch[1].ch[2].addChild(node);
  }
  node.origX = node.posX = posX;
  node.origY = node.posY = posY;
  node.type = type;
  node.obj = obj;

  // Repositioning
  node.position = function(){
    this.x = this.posX*100;
    this.y = this.posY*100;
    // Handling lines
    if (this.type == 'top' || this.type == 'bottom'){
      this.lineY.posY2 = this.posY;
      this.lineX.posY = this.posY;
      this.lineX.posX2 = this.posX;
      this.lineY.position();
      this.lineX.position();
    }
    if (this.type == 'left' || this.type == 'right'){
      this.lineX.posX2 = this.posX;
      this.lineY.posX = this.posX;
      this.lineY.posY2 = this.posY;
      this.lineY.position();
      this.lineX.position();
    }
    // Updating object for calculations
    nCalc.del(this.calcID);
    var o = nCalc.add(node,this.posX,this.posY);
    this.calcID = o.calcID;
    this.gNode = o.gNode;
    nCalc.disconnect(this.obj.conn[0],this.obj.conn[1]);
    this.obj.conn = nCalc.connect(this.obj.node1,this.obj.node2,this.obj);
  };

  // Snapping to node to grid on repositioning
  node.snap = function(){
    this.posX = Math.round((this.x+zoom/10-offsetX)/zoom);
    this.posY = Math.round((this.y+zoom/10-offsetY)/zoom);
    if (this.posX<0) this.posX = 0;
    if (this.posX>size) this.posX = size;
    if (this.posY<0) this.posY = 0;
    if (this.posY>size) this.posY = size;
  };

  // Deleting node
  node.del = function(){
    if (this.type != 'normal'){
      this.lineX.del();
      this.lineY.del();
      nCalc.del(this.calcID);
      eImage.ch[1].ch[3].delChild(this);
    }else{
      this.model.del();
      eImage.ch[1].ch[2].delChild(this);
    }
  };

  // Handle node drag
  node.dragStart = function (event,object){
    event.preventDefault();
    eImage.ch[1].ch[3].delChild(this);
    eImage.ch[2].ch[1].addChild(this);
    this.x = offsetX+zoom*this.posX;
		this.y = offsetY+zoom*this.posY;
    this.r = 0.12*zoom;
  };
  node.dragWhile = function (event,object){
    event.preventDefault();
    this.x += object.movementX;
		this.y += object.movementY;
  };
  node.dragEnd = function (event,object){
    event.preventDefault();
    this.snap();
    eImage.ch[2].ch[1].delChild(this);
    eImage.ch[1].ch[3].addChild(this);
    this.position();
    this.r = 12;
  };

  dtCanvas.addDTListener(node,node.dragStart,node.dragWhile,node.dragEnd,undefined);
  return node;
};
