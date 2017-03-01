var lineX = function(y,x1,x2){
  // Creating line html object
  var lineX = document.createElement('div');
  lineX.className = 'lineX';
  lineX.y = y;
  lineX.x1 = x1;
  lineX.x2 = x2;
  // Repositioning function
  lineX.position = function(){
    if (this.x2>this.x1){
      this.style.width = (this.x2 - this.x1)*zoom + 'px';
      this.style.top = this.y*zoom+offsetY-2 + 'px';
      this.style.left = this.x1*zoom+offsetX-2 + 'px';
    }else{
      this.style.width = (this.x1 - this.x2)*zoom + 'px';
      this.style.top = this.y*zoom+offsetY-2 + 'px';
      this.style.left = this.x2*zoom+offsetX-2 + 'px';
    }
  };
  // Deletion function
  lineX.del = function(){
    this.parentNode.removeChild(this);
  };
  lineX.position();
  // Adding to html tree
  document.body.appendChild(lineX);
  return lineX;
};

// Similar to above
var lineY = function(x,y1,y2){
  var lineY = document.createElement('div');
  lineY.className = 'lineY';
  lineY.x = x;
  lineY.y1 = y1;
  lineY.y2 = y2;
  lineY.position = function(){
    if (this.y2>this.y1){
      this.style.height = (this.y2 - this.y1)*zoom + 'px';
      this.style.left = this.x*zoom+offsetX-2 + 'px';
      this.style.top = this.y1*zoom+offsetY-2 + 'px';
    }else{
      this.style.height = (this.y1 - this.y2)*zoom + 'px';
      this.style.left = this.x*zoom+offsetX-2 + 'px';
      this.style.top = this.y2*zoom+offsetY-2 + 'px';
    }
  };
  lineY.del = function(){
    this.parentNode.removeChild(this);
  };
  lineY.position();
  document.body.appendChild(lineY);
  return lineY;
};
