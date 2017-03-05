/*

# canvasvg.js - A library combining the structure of an svg file coded in JSON
  with the speed of the HTML 5 canvas

## LICENSE

MIT License

Copyright (c) Martin Balint and Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var groupProto = {
  addChild: function(elem){
    elem.groupIndex = this.ch.length;
    this.ch.push(elem);
  },
  delChild: function(elem){
    this.ch[elem.groupIndex] = this.ch[this.ch.length-1];
    this.ch[elem.groupIndex].groupIndex = elem.groupIndex;
    this.ch.pop();
  }
};

function applyGroupProto(group){
  group.__proto__ = groupProto;
  for (var i in group.ch){
    if (group.ch[i].t === 'g') applyGroupProto(group.ch[i]);
  }
}

function drawImage(canvas, ctx, img, props){
  var x,y,
    width=('width' in img?img.width:img.src.width),
    height=('height' in img?img.height:img.src.height);

  if ('translate' in props.effect){
    x=img.x+props.effect.translate.x;
    y=img.y+props.effect.translate.y;
  }else{
    x=img.x;
    y=img.y;
  }
  if ('scale' in props.effect){
    x*=props.effect.scale.ratio;
    y*=props.effect.scale.ratio;
  }
  ctx.drawImage(img.src, x, y, width, height);
}

function drawCircle(canvas, ctx, cir, props){
  if ('color' in props.stroke) ctx.strokeStyle = props.stroke.color;
    else ctx.strokeStyle = '#000000';
  if ('color' in props.fill) ctx.fillStyle = props.fill.color;
    else ctx.fillStyle = '#000000';
  if ('width' in props.stroke) ctx.lineWidth = props.stroke.width;
    else ctx.lineWidth = 1;
  var x,y,r=cir.r;
  if ('translate' in props.effect){
    x=cir.x+props.effect.translate.x;
    y=cir.y+props.effect.translate.y;
  }else{
    x=cir.x;
    y=cir.y;
  }
  if ('scale' in props.effect){
    x*=props.effect.scale.ratio;
    y*=props.effect.scale.ratio;
    r*=props.effect.scale.ratio;
  }
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI, false);
  ctx.stroke();
  ctx.fill();
}

function drawRect(canvas, ctx, rect, props){
  if ('lineCap' in props.stroke) ctx.lineCap = props.stroke.lineCap;
    else ctx.lineCap = 'butt';
  if ('lineJoin' in props.stroke) ctx.lineJoin=props.stroke.lineJoin;
    else ctx.lineJoin = "miter";
  if ('color' in props.stroke) ctx.strokeStyle = props.stroke.color;
    else ctx.strokeStyle = '#000000';
  if ('color' in props.fill) ctx.fillStyle = props.fill.color;
    else ctx.fillStyle = '#000000';
  if ('width' in props.stroke) ctx.lineWidth = props.stroke.width;
    else ctx.lineWidth = 1;
  var x,y,width=rect.width,height=rect.height,r={tl:0,tr:0,bl:0,br:0},round=false;
  if ('r' in rect){
    r.tl=r.tr=r.bl=r.br=rect.r;
    round = true;
  }
  if ('rtl' in rect){r.tl=rect.rtl; round = true;}
  if ('rtr' in rect){r.tr=rect.rtr; round = true;}
  if ('rbl' in rect){r.bl=rect.rbl; round = true;}
  if ('rbr' in rect){r.br=rect.rbr; round = true;}
  if ('translate' in props.effect){
    x=rect.x+props.effect.translate.x;
    y=rect.y+props.effect.translate.y;
  }else{
    x=rect.x;
    y=rect.y;
  }
  if ('scale' in props.effect){
    x*=props.effect.scale.ratio;
    y*=props.effect.scale.ratio;
    width*=props.effect.scale.ratio;
    height*=props.effect.scale.ratio;
    if (round){
      r.tl*=props.effect.scale.ratio;
      r.tr*=props.effect.scale.ratio;
      r.bl*=props.effect.scale.ratio;
      r.br*=props.effect.scale.ratio;
    }
  }
  if (round){
    ctx.beginPath();
    ctx.moveTo(x + r.tl, y);
    ctx.lineTo(x + width - r.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r.tr);
    ctx.lineTo(x + width, y + height - r.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r.br, y + height);
    ctx.lineTo(x + r.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r.bl);
    ctx.lineTo(x, y + r.tl);
    ctx.quadraticCurveTo(x, y, x + r.tl, y);
    ctx.closePath();
  }else{
    ctx.beginPath();
    ctx.rect(x, y, width, height);
  }
  ctx.stroke();
  ctx.fill();
}

function drawLine(canvas, ctx, line, props){
  if ('lineCap' in props.stroke) ctx.lineCap = props.stroke.lineCap;
    else ctx.lineCap = 'butt';
  if ('color' in props.stroke) ctx.strokeStyle = props.stroke.color;
    else ctx.strokeStyle = '#000000';
  if ('width' in props.stroke) ctx.lineWidth = props.stroke.width;
    else ctx.lineWidth = 1;
  var x1,x2,y1,y2;
  if ('translate' in props.effect){
    x1=line.x1+props.effect.translate.x;
    x2=line.x2+props.effect.translate.x;
    y1=line.y1+props.effect.translate.y;
    y2=line.y2+props.effect.translate.y;
  }else{
    x1=line.x1;
    x2=line.x2;
    y1=line.y1;
    y2=line.y2;
  }
  if ('scale' in props.effect){
    x1*=props.effect.scale.ratio;
    x2*=props.effect.scale.ratio;
    y1*=props.effect.scale.ratio;
    y2*=props.effect.scale.ratio;
  }
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
}

function procProps(canvas, ctx, element, props){
  var newProps = {
    effect:('effect' in element?element.effect:props.effect),
    fill:('fill' in element?element.fill:props.fill),
    stroke:('stroke' in element?element.stroke:props.stroke)
    };
  if (element.t == 'g') drawGroup(canvas, ctx, element, newProps);
  if (element.t == 'line') drawLine(canvas, ctx, element, newProps);
  if (element.t == 'rect') drawRect(canvas, ctx, element, newProps);
  if (element.t == 'circle') drawCircle(canvas, ctx, element, newProps);
  if (element.t == 'image') drawImage(canvas, ctx, element, newProps);
}

function drawGroup(canvas, ctx, group, props){
  for (var i in group.ch){
    procProps(canvas, ctx, group.ch[i], props);
  }
}

function drawShapes(canvas, ctx, image){
  drawGroup(canvas, ctx, image, {effect:{},fill:{},stroke:{}});
}

function trackImage(img, posX, posY, effect){
  var x,y,
    width=('width' in img?img.width:img.src.width),
    height=('height' in img?img.height:img.src.height);

  if ('translate' in effect){
    x=img.x+effect.translate.x;
    y=img.y+effect.translate.y;
  }else{
    x=img.x;
    y=img.y;
  }
  if ('scale' in effect){
    x*=effect.scale.ratio;
    y*=effect.scale.ratio;
  }
  if (posX<x+width && posX>x && posY<y+height && posY>y) return img;
  return -1;
}

function trackCircle(cir, posX, posY, effect){
  var x,y,r=cir.r;
  if ('translate' in effect){
    x=cir.x+effect.translate.x;
    y=cir.y+effect.translate.y;
  }else{
    x=cir.x;
    y=cir.y;
  }
  if ('scale' in effect){
    x*=effect.scale.ratio;
    y*=effect.scale.ratio;
    r*=effect.scale.ratio;
  }
  if (posX>x-r && posX<x+r && posY>y-r && posY<y+r) return cir;
  return -1;
}

function trackRect(rect, posX, posY, effect){
  var x,y,width=rect.width,height=rect.height,r={tl:0,tr:0,bl:0,br:0},round=false;
  if ('translate' in effect){
    x=rect.x+effect.translate.x;
    y=rect.y+effect.translate.y;
  }else{
    x=rect.x;
    y=rect.y;
  }
  if ('scale' in effect){
    x*=effect.scale.ratio;
    y*=effect.scale.ratio;
    width*=effect.scale.ratio;
    height*=effect.scale.ratio;
  }
  if (posX<x+width && posX>x && posY<y+height && posY>y) return rect;
  return -1;
}

function trackProcProps(element, posX, posY, effect){
  var newProps = ('effect' in element?element.effect:effect);
  if (element.t == 'g') return trackGroup(element, posX, posY, newProps);
  if (element.t == 'line') return -1;
  if (element.t == 'rect') return trackRect(element, posX, posY, newProps);
  if (element.t == 'circle') return trackCircle(element, posX, posY, newProps);
  if (element.t == 'image') return trackImage(element, posX, posY, newProps);
}

function trackGroup(group, posX, posY, effect){
  var temp = -1;
  for (var i = group.ch.length-1; i>=0; i--){
    temp = trackProcProps(group.ch[i], posX, posY, effect);
    if (temp !== -1) return temp;
  }
  return temp;
}

function trackClick(image, posX, posY){
  return trackGroup(image, posX, posY, {});
}
