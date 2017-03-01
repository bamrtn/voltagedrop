// Functions to open and close dialogs

function openDialog(id){
  var elem = document.getElementById(id);
  if (elem.auto0px === undefined) elem.auto0px = {};

  ftransition(elem.auto0px, function(){
    elem.style.display = "block";
  }, function(){
    elem.style.opacity = "1";
    elem.childNodes[1].style.transform = "translate(-50%, -50%) scale(1, 1)";
  }, undefined, 0.4);
}
function closeDialog(id){
  var elem = document.getElementById(id);
  if (elem.auto0px === undefined) elem.auto0px = {};

  ftransition(elem.auto0px, function(){
    elem.style.opacity = "0";
    elem.childNodes[1].style.transform = "translate(-50%, -50%) scale(0.1, 0.1)";
  }, undefined, function(){
    elem.style.display = "none";
  }, 0.4);
}
