function save(){
  var output={
    'horizontalResistors':[],
    'verticalResistors':[],
    'vsourceUp':[],
    'vsourceDown':[],
    'vsourceLeft':[],
    'vsourceRight':[]
  };
  for (var i in eImage.ch[1].ch[0].ch){
    var elem = eImage.ch[1].ch[0].ch[i];
    if (elem.type === 'horizontal') j = 'horizontalResistors';
    if (elem.type === 'vertical') j = 'verticalResistors';
    if (elem.type === 'up') j = 'vsourceUp';
    if (elem.type === 'down') j = 'vsourceDown';
    if (elem.type === 'left') j = 'vsourceLeft';
    if (elem.type === 'right') j = 'vsourceRight';
    output[j].push({
      'posX':elem.posX,
      'posY':elem.posY,
      'param':elem.param,
      'node1':{
        'posX':elem.node1.posX,
        'posY':elem.node1.posY
      },
      'node2':{
        'posX':elem.node2.posX,
        'posY':elem.node2.posY
      }
    });
  }
  return JSON.stringify(output);
}
function load(s){
  select(undefined);
  while (eImage.ch[1].ch[0].ch.length > 0){
    eImage.ch[1].ch[0].ch[0].del();
  }
  var input = JSON.parse(s);
  for (var i=0; i<input.horizontalResistors.length; i++){
    var c = input.horizontalResistors[i];
    var res = new resistor('horizontal',c.posX,c.posY);
    res.node1.posX = c.node1.posX; res.node1.posY = c.node1.posY;
    res.node2.posX = c.node2.posX; res.node2.posY = c.node2.posY;
    res.node1.position(); res.node2.position();
    res.firstDrag = false;
    res.param = c.param;
  }
  for (var i=0; i<input.verticalResistors.length; i++){
    var c = input.verticalResistors[i];
    var res = new resistor('vertical',c.posX,c.posY);
    res.node1.posX = c.node1.posX; res.node1.posY = c.node1.posY;
    res.node2.posX = c.node2.posX; res.node2.posY = c.node2.posY;
    res.node1.position(); res.node2.position();
    res.firstDrag = false;
    res.param = c.param;
  }
  for (var i=0; i<input.vsourceUp.length; i++){
    var c = input.vsourceUp[i];
    var res = new vsource('up',c.posX,c.posY);
    res.node1.posX = c.node1.posX; res.node1.posY = c.node1.posY;
    res.node2.posX = c.node2.posX; res.node2.posY = c.node2.posY;
    res.node1.position(); res.node2.position();
    res.firstDrag = false;
    res.param = c.param;
  }
  for (var i=0; i<input.vsourceDown.length; i++){
    var c = input.vsourceDown[i];
    var res = new vsource('down',c.posX,c.posY);
    res.node1.posX = c.node1.posX; res.node1.posY = c.node1.posY;
    res.node2.posX = c.node2.posX; res.node2.posY = c.node2.posY;
    res.node1.position(); res.node2.position();
    res.firstDrag = false;
    res.param = c.param;
  }
  for (var i=0; i<input.vsourceLeft.length; i++){
    var c = input.vsourceLeft[i];
    var res = new vsource('left',c.posX,c.posY);
    res.node1.posX = c.node1.posX; res.node1.posY = c.node1.posY;
    res.node2.posX = c.node2.posX; res.node2.posY = c.node2.posY;
    res.node1.position(); res.node2.position();
    res.firstDrag = false;
    res.param = c.param;
  }
  for (var i=0; i<input.vsourceRight.length; i++){
    var c = input.vsourceRight[i];
    var res = new vsource('right',c.posX,c.posY);
    res.node1.posX = c.node1.posX; res.node1.posY = c.node1.posY;
    res.node2.posX = c.node2.posX; res.node2.posY = c.node2.posY;
    res.node1.position(); res.node2.position();
    res.firstDrag = false;
    res.param = c.param;
  }
}
function openSave(){
  var saveCode = document.getElementById('saveCode');
  saveCode.innerHTML = save();
  openDialog('saveDialog');
}
function doLoad(){
  var loadCode = document.getElementById('loadCode').value;
  load(loadCode);
}
