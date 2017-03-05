var lineX = function(posY,posX1,posX2){
  // Creating line canvasvg object
  var lineX = {t:'line',x1:posX1*100,x2:posX2*100,y1:posY*100,y2:posY*100};
  lineX.posY = posY;
  lineX.posX1 = posX1;
  lineX.posX2 = posX2;

  // Repositioning function
  lineX.position = function(){
    this.y1 = this.y2 = this.posY*100;
    this.x1 = this.posX1*100;
    this.x2 = this.posX2*100;
  };

  // Deletion function
  lineX.del = function(){
    eImage.ch[1].ch[1].delChild(this);
  };

  // Adding to canvasvg tree
  eImage.ch[1].ch[1].addChild(lineX);
  return lineX;
};

var lineY = function(posX,posY1,posY2){
  // Creating line canvasvg object
  var lineY = {t:'line',x1:posX*100,x2:posX*100,y1:posY1*100,y2:posY2*100};
  lineY.posX = posX;
  lineY.posY1 = posY1;
  lineY.posY2 = posY2;

  // Repositioning function
  lineY.position = function(){
    this.x1 = this.x2 = this.posX*100;
    this.y1 = this.posY1*100;
    this.y2 = this.posY2*100;
  };

  // Deletion function
  lineY.del = function(){
    eImage.ch[1].ch[1].delChild(this);
  };

  // Adding to canvasvg tree
  eImage.ch[1].ch[1].addChild(lineY);
  return lineY;
};
