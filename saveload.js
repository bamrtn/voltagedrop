function save(){
  var output={
    'horizontalResistors':[],
    'verticalResistors':[],
    'vsourceUp':[],
    'vsourceDown':[],
    'vsourceLeft':[],
    'vsourceRight':[]
  };
  var toSave = [
    ['horizontalResistor',output.horizontalResistors],
    ['verticalResistor',output.verticalResistors],
    ['vsourceUp',output.vsourceUp],
    ['vsourceDown',output.vsourceDown],
    ['vsourceLeft',output.vsourceLeft],
    ['vsourceRight',output.vsourceRight]];
  for (var j = 0; j<toSave.length; j++){
    var resistors = document.getElementsByClassName(toSave[j][0]);
    for (var i =0; i<resistors.length; i++){
      toSave[j][1].push({
        'posX':resistors[i].posX,
        'posY':resistors[i].posY,
        'param':resistors[i].param,
        'node1':{
          'posX':resistors[i].node1.posX,
          'posY':resistors[i].node1.posY
        },
        'node2':{
          'posX':resistors[i].node2.posX,
          'posY':resistors[i].node2.posY
        }
      });
    }
  }
  return JSON.stringify(output);
}
function load(s){
  var toDelete = ['horizontalResistor', 'verticalResistor', 'vsourceUp', 'vsourceDown', 'vsourceLeft', 'vsourceRight'];
  select(undefined);
  for (var j in toDelete){
    var elems = document.getElementsByClassName(toDelete[j]);
    while(elems.length > 0){
      elems[0].del();
    }
  }
  var input = JSON.parse(s);
  for (var i=0; i<input.horizontalResistors.length; i++){
    var c = input.horizontalResistors[i];
    var res = new resistor('horizontal',c.posX,c.posY);
    res.node1.reposition(c.node1.posX,c.node1.posY);
    res.node2.reposition(c.node2.posX,c.node2.posY);
    res.firstDrag = false;
    res.param = c.param;
    nCalc.disconnect(res.conn[0],res.conn[1]);
    res.conn = nCalc.connect(res.node1,res.node2,res);
  }
  for (var i=0; i<input.verticalResistors.length; i++){
    var c = input.verticalResistors[i];
    var res = new resistor('vertical',c.posX,c.posY);
    res.node1.reposition(c.node1.posX,c.node1.posY);
    res.node2.reposition(c.node2.posX,c.node2.posY);
    res.firstDrag = false;
    res.param = c.param;
    nCalc.disconnect(res.conn[0],res.conn[1]);
    res.conn = nCalc.connect(res.node1,res.node2,res);
  }
  for (var i=0; i<input.vsourceUp.length; i++){
    var c = input.vsourceUp[i];
    var res = new vsource('up',c.posX,c.posY);
    res.node1.reposition(c.node1.posX,c.node1.posY);
    res.node2.reposition(c.node2.posX,c.node2.posY);
    res.firstDrag = false;
    res.param = c.param;
    nCalc.disconnect(res.conn[0],res.conn[1]);
    res.conn = nCalc.connect(res.node1,res.node2,res);
  }
  for (var i=0; i<input.vsourceDown.length; i++){
    var c = input.vsourceDown[i];
    var res = new vsource('down',c.posX,c.posY);
    res.node1.reposition(c.node1.posX,c.node1.posY);
    res.node2.reposition(c.node2.posX,c.node2.posY);
    res.firstDrag = false;
    res.param = c.param;
    nCalc.disconnect(res.conn[0],res.conn[1]);
    res.conn = nCalc.connect(res.node1,res.node2,res);
  }
  for (var i=0; i<input.vsourceLeft.length; i++){
    var c = input.vsourceLeft[i];
    var res = new vsource('left',c.posX,c.posY);
    res.node1.reposition(c.node1.posX,c.node1.posY);
    res.node2.reposition(c.node2.posX,c.node2.posY);
    res.firstDrag = false;
    res.param = c.param;
    nCalc.disconnect(res.conn[0],res.conn[1]);
    res.conn = nCalc.connect(res.node1,res.node2,res);
  }
  for (var i=0; i<input.vsourceRight.length; i++){
    var c = input.vsourceRight[i];
    var res = new vsource('right',c.posX,c.posY);
    res.node1.reposition(c.node1.posX,c.node1.posY);
    res.node2.reposition(c.node2.posX,c.node2.posY);
    res.firstDrag = false;
    res.param = c.param;
    nCalc.disconnect(res.conn[0],res.conn[1]);
    res.conn = nCalc.connect(res.node1,res.node2,res);
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
