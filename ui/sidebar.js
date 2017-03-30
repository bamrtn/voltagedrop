var sideSelected = 0;
// Handle sidebar selections
function select(elem){
  sideSelected = elem;
  var name = document.getElementById('sidebarName');
  var image = document.getElementById('sidebarImage');
  var param = document.getElementById('param');
  var inParam = document.getElementById('inParam');
  var voltageField = document.getElementById('voltageField');
  var currentField = document.getElementById('currentField');
  var powerField = document.getElementById('powerField');
  if (elem === undefined){
    sideSelected = 0;
    name.innerHTML = 'None';
    image.src = 'svg/resistor1.svg';
    param.innerHTML = 'Resistance';
    voltageField.innerHTML = '-';
    currentField.innerHTML = '-';
    powerField.innerHTML = '-';
    inParam.value = '-';
    return;
  }
  if(elem.type == 'horizontal'){
    name.innerHTML = 'Resistor';
    image.src = 'svg/resistor1.svg';
    param.innerHTML = 'Resistance';
    voltageField.innerHTML = elem.voltage;
    currentField.innerHTML = elem.current;
    powerField.innerHTML = elem.power;
    inParam.value = elem.param;
  }
  if(elem.type == 'vertical'){
    name.innerHTML = 'Resistor';
    image.src = 'svg/resistor2.svg';
    param.innerHTML = 'Resistance';
    voltageField.innerHTML = elem.voltage;
    currentField.innerHTML = elem.current;
    powerField.innerHTML = elem.power;
    inParam.value = elem.param;
  }
  if(elem.type == 'up'){
    name.innerHTML = 'V Source';
    image.src = 'svg/vsourceUp.svg';
    param.innerHTML = 'Voltage';
    voltageField.innerHTML = elem.voltage;
    currentField.innerHTML = elem.current;
    powerField.innerHTML = elem.power;
    inParam.value = elem.param;
  }
  if(elem.type == 'down'){
    name.innerHTML = 'V Source';
    image.src = 'svg/vsourceDown.svg';
    param.innerHTML = 'Voltage';
    voltageField.innerHTML = elem.voltage;
    currentField.innerHTML = elem.current;
    powerField.innerHTML = elem.power;
    inParam.value = elem.param;
  }
  if(elem.type == 'left'){
    name.innerHTML = 'V Source';
    image.src = 'svg/vsourceLeft.svg';
    param.innerHTML = 'Voltage';
    voltageField.innerHTML = elem.voltage;
    currentField.innerHTML = elem.current;
    powerField.innerHTML = elem.power;
    inParam.value = elem.param;
  }
  if(elem.type == 'right'){
    name.innerHTML = 'V Source';
    image.src = 'svg/vsourceRight.svg';
    param.innerHTML = 'Voltage';
    voltageField.innerHTML = elem.voltage;
    currentField.innerHTML = elem.current;
    powerField.innerHTML = elem.power;
    inParam.value = elem.param;
  }
}
function sideDelete(){
  if (sideSelected !== 0) sideSelected.del();
  sideSelected = 0;
  select(undefined);
}
function sideApply(){
  if (sideSelected !== 0){
    var r = document.getElementById('inParam').value;
    if (parseInt(r)>0){
      sideSelected.param = parseInt(r);
    }
  }
}
