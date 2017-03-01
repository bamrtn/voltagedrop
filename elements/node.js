var node = function(type,posX,posY,obj){
  // Creating html object
  var node = document.createElement('div');
  // Normal nodes are in the background and responsible for the white fill of
  // active nodes.
  if (type !== 'normal'){
    node.className = 'node';
    node.lineX = new lineX(posY,posX,posX);
    node.lineY = new lineY(posX,posY,posY);
    var o = nCalc.add(node,posX,posY);
    node.calcID = o.calcID;
    node.gNode = o.gNode;
  }else{
    node.className = 'nodeNormal';
    node.model = scene.node(posX,posY);
  }
  node.origX = node.posX = posX;
  node.origY = node.posY = posY;
  node.type = type;
  node.obj = obj;
  document.body.appendChild(node);

  // Repositioning only when zooming
  node.position = function(){
    this.style.left = this.posX*zoom+offsetX-zoom/10-2 + 'px';
    this.style.top = this.posY*zoom+offsetY-zoom/10-2 + 'px';
    this.style.width = zoom/5 + 'px';
    this.style.height = zoom/5 + 'px';
  };
  node.position();

  // Repositioning otherwise
  node.reposition = function(posX,posY){
    this.posX = posX;
    this.posY = posY;
    // Handling lines
    if (this.type == 'top' || this.type == 'bottom'){
      this.lineY.y2 = posY;
      this.lineX.y = posY;
      this.lineX.x2 = posX;
      this.lineY.position();
      this.lineX.position();
    }
    if (this.type == 'left' || this.type == 'right'){
      this.lineX.x2 = posX;
      this.lineY.x = posX;
      this.lineY.y2 = posY;
      this.lineY.position();
      this.lineX.position();
    }
    this.position();
    // Updating object for calculations
    nCalc.del(this.calcID);
    var o = nCalc.add(node,posX,posY);
    this.calcID = o.calcID;
    this.gNode = o.gNode;
  };

  // Snapping to node to grid on repositioning
  node.snap = function(){
    var posX = Math.round((this.offsetLeft+zoom/10-offsetX)/zoom);
    var posY = Math.round((this.offsetTop+zoom/10-offsetY)/zoom);
    if (posX<0) posX = 0;
    if (posX>size) posX = size;
    if (posY<0) posY = 0;
    if (posY>size) posY = size;
    this.reposition(posX,posY);
  };

  // Deleting node
  node.del = function(){
    if (this.type != 'normal'){
      this.lineX.del();
      this.lineY.del();
      nCalc.del(this.calcID);
    }else{
      this.model.del();
    }
    this.parentNode.removeChild(this);
  };


  // Handle node drag
  node.dragStart = function (event,object){

  };
  node.dragWhile = function (event,object){
    this.style.left = (this.offsetLeft + object.movementX) + 'px';
    this.style.top = (this.offsetTop + object.movementY) + 'px';
  };
  node.dragEnd = function (event,object){
    this.snap();
    nCalc.disconnect(this.obj.conn[0],this.obj.conn[1]);
    this.obj.conn = nCalc.connect(this.obj.node1,this.obj.node2,this.obj);
  };

  node.addDTListener(node.dragStart,node.dragWhile,node.dragEnd,undefined);
  return node;
};
