// Getting loaded images
var eImage, openImg, saveImg, calcImg, fullscreenImg, resistor1Img, resistor2Img, vsourceUpImg, vsourceDownImg, vsourceLeftImg, vsourceRightImg, imgResVer, imgResVerCtx, imgResHor, imgResHorCtx, imgVsrUp, imgVsrUpCtx, imgVsrDown, imgVsrDownCtx, imgVsrLeft, imgVsrLeftCtx, imgVsrRight, imgVsrRightCtx;
function getImages(){
  openImg = document.getElementById('openImg');
  saveImg = document.getElementById('saveImg');
  calcImg = document.getElementById('calcImg');
  fullscreenImg = document.getElementById('fullscreenImg');
  resistor1Img = document.getElementById('resistor1Img');
  resistor2Img = document.getElementById('resistor2Img');
  vsourceUpImg = document.getElementById('vsourceUpImg');
  vsourceDownImg = document.getElementById('vsourceDownImg');
  vsourceLeftImg = document.getElementById('vsourceLeftImg');
  vsourceRightImg = document.getElementById('vsourceRightImg');

  imgResVer = document.createElement('canvas');
  imgResVerCtx = imgResVer.getContext('2d');
  imgResHor = document.createElement('canvas');
  imgResHorCtx = imgResHor.getContext('2d');

  imgVsrUp = document.createElement('canvas');
  imgVsrUpCtx = imgVsrUp.getContext('2d');
  imgVsrDown = document.createElement('canvas');
  imgVsrDownCtx = imgVsrDown.getContext('2d');
  imgVsrLeft = document.createElement('canvas');
  imgVsrLeftCtx = imgVsrLeft.getContext('2d');
  imgVsrRight = document.createElement('canvas');
  imgVsrRightCtx = imgVsrRight.getContext('2d');

  // The main canvasvg tree

  eImage = {ch:[
    {t:'g', // Background
      ch:[
        {t:'rect',x:0,y:0,stroke:{color:'rgba(0,0,0,0)'},fill:{color:'rgba(0,0,0,0)'}}
      ]},
    {t:'g', // Group of elements
      effect:{translate:{x:2000,y:500}, scale:{ratio:0.5}},
      ch:[
        {t:'g', // Group of resistors / vsources
          ch:[

          ]},
          {t:'g', // Group of lines
            stroke:{color:'#E0E0E0',width:'4',lineCap:'round'},
            ch:[

            ]},
          {t:'g', // Group of normal nodes
            ch:[

            ]},
          {t:'g', // Group of nodes
            ch:[

            ]}
      ]},
    {t:'g', // Group of GUI elements
      ch:[
        {t:'g', // Group of icons
          ch:[
            {t:'rect',x:0,y:0,height:50,stroke:{color:'rgba(0,0,0,0)'},fill:{color:'#424242'}},
            {t:'g', // Group of icons on right
              effect:{translate:{x:0,y:0}},
              ch:[
                {t:'image',x:10,y:10,width:30,height:30,src:fullscreenImg,
                  DragTrack:{listeners:[{
                    startDrag:function(event,object){
                      event.preventDefault();
                      if (screenfull.enabled) {
                        screenfull.toggle();
                      }
                    }, whileDrag:function(){},endDrag:function(){},params:undefined,
                    running:false,index:0,currentlyDraggedIndex:-1, originalElem: window
                  }]}},
                {t:'image',x:60,y:10,width:30,height:30,src:calcImg,
                  DragTrack:{listeners:[{
                    startDrag:function(event,object){
                      event.preventDefault();
                      nCalc.calc(event);
                    }, whileDrag:function(){},endDrag:function(){},params:undefined,
                    running:false,index:0,currentlyDraggedIndex:-1, originalElem: window
                  }]}},
              ]},
            {t:'image',x:10,y:10,width:30,height:30,src:saveImg,
              DragTrack:{listeners:[{
                startDrag:function(event,object){
                  event.preventDefault();
                  openSave();
                }, whileDrag:function(){},endDrag:function(){},params:undefined,
                running:false,index:0,currentlyDraggedIndex:-1, originalElem: window
              }]}},
            {t:'image',x:60,y:10,width:30,height:30,src:openImg,
              DragTrack:{listeners:[{
                startDrag:function(event,object){
                  event.preventDefault();
                  openDialog('loadDialog');
                }, whileDrag:function(){},endDrag:function(){},params:undefined,
                running:false,index:0,currentlyDraggedIndex:-1, originalElem: window
              }]}},
            {t:'image',x:100,y:0,width:50,height:50,src:resistor1Img,
              DragTrack:{listeners:[{
                startDrag:function(event,object){
                  event.preventDefault();
                  var res = new resistor ('horizontal',0,0);
                  dtCanvas.handleStart(object.dragType, event, res);
                  res.x = event.clientX - 0.6*zoom;
                  res.y = event.clientY - 0.13*zoom;
                }, whileDrag:function(){},endDrag:function(){},params:undefined,
                running:false,index:0,currentlyDraggedIndex:-1, originalElem: window
              }]}},
            {t:'image',x:150,y:0,width:50,height:50,src:resistor2Img,
              DragTrack:{listeners:[{
                startDrag:function(event,object){
                  event.preventDefault();
                  var res = new resistor ('vertical',0,0);
                  dtCanvas.handleStart(object.dragType, event, res);
                  res.x = event.clientX - 0.13*zoom;
                  res.y = event.clientY - 0.6*zoom;
                }, whileDrag:function(){},endDrag:function(){},params:undefined,
                running:false,index:0,currentlyDraggedIndex:-1, originalElem: window
              }]}},
            {t:'image',x:200,y:0,width:50,height:50,src:vsourceUpImg,
              DragTrack:{listeners:[{
                startDrag:function(event,object){
                  event.preventDefault();
                  var res = new vsource ('up',0,0);
                  dtCanvas.handleStart(object.dragType, event, res);
                  res.x = event.clientX - 0.13*zoom;
                  res.y = event.clientY - 0.6*zoom;
                }, whileDrag:function(){},endDrag:function(){},params:undefined,
                running:false,index:0,currentlyDraggedIndex:-1, originalElem: window
              }]}},
            {t:'image',x:250,y:0,width:50,height:50,src:vsourceDownImg,
              DragTrack:{listeners:[{
                startDrag:function(event,object){
                  event.preventDefault();
                  var res = new vsource ('down',0,0);
                  dtCanvas.handleStart(object.dragType, event, res);
                  res.x = event.clientX - 0.13*zoom;
                  res.y = event.clientY - 0.6*zoom;
                }, whileDrag:function(){},endDrag:function(){},params:undefined,
                running:false,index:0,currentlyDraggedIndex:-1, originalElem: window
              }]}},
            {t:'image',x:300,y:0,width:50,height:50,src:vsourceLeftImg,
              DragTrack:{listeners:[{
                startDrag:function(event,object){
                  event.preventDefault();
                  var res = new vsource ('left',0,0);
                  dtCanvas.handleStart(object.dragType, event, res);
                  res.x = event.clientX - 0.6*zoom;
                  res.y = event.clientY - 0.13*zoom;
                }, whileDrag:function(){},endDrag:function(){},params:undefined,
                running:false,index:0,currentlyDraggedIndex:-1, originalElem: window
              }]}},
            {t:'image',x:350,y:0,width:50,height:50,src:vsourceRightImg,
              DragTrack:{listeners:[{
                startDrag:function(event,object){
                  event.preventDefault();
                  var res = new vsource ('right',0,0);
                  dtCanvas.handleStart(object.dragType, event, res);
                  res.x = event.clientX - 0.6*zoom;
                  res.y = event.clientY - 0.13*zoom;
                }, whileDrag:function(){},endDrag:function(){},params:undefined,
                running:false,index:0,currentlyDraggedIndex:-1, originalElem: window
              }]}}
          ]},
        {t:'g', // Group of resistors / vsources being dragged
          ch:[

          ]}
      ]}
  ]};
  applyGroupProto(eImage);
}

// Drawing resistor and vsource bitmaps
function drawBitmap(){
  imgResVer.width = zoom*0.26;
  imgResVer.height = zoom*1.2;
  imgResVerCtx.clearRect(0,0,zoom*0.26+5,zoom*1.2+5);
  imgResVerCtx.lineCap = 'round';
  imgResVerCtx.strokeStyle = '#E0E0E0';
  imgResVerCtx.lineWidth = 4;
  imgResVerCtx.beginPath();
  imgResVerCtx.moveTo(zoom*0.13,zoom*0.1);
  imgResVerCtx.lineTo(zoom*0.13,zoom*1.1);
  imgResVerCtx.stroke();

  var y = zoom*0.3, height = zoom*0.6,
    x = zoom*0.03, width = zoom*0.2,
    r={tl:2,tr:2,bl:2,br:2};
  imgResVerCtx.fillStyle = '#424242';

  imgResVerCtx.beginPath();
  imgResVerCtx.moveTo(x + r.tl, y);
  imgResVerCtx.lineTo(x + width - r.tr, y);
  imgResVerCtx.quadraticCurveTo(x + width, y, x + width, y + r.tr);
  imgResVerCtx.lineTo(x + width, y + height - r.br);
  imgResVerCtx.quadraticCurveTo(x + width, y + height, x + width - r.br, y + height);
  imgResVerCtx.lineTo(x + r.bl, y + height);
  imgResVerCtx.quadraticCurveTo(x, y + height, x, y + height - r.bl);
  imgResVerCtx.lineTo(x, y + r.tl);
  imgResVerCtx.quadraticCurveTo(x, y, x + r.tl, y);
  imgResVerCtx.closePath();
  imgResVerCtx.stroke();
  imgResVerCtx.fill();

  imgResHor.width = zoom*1.2;
  imgResHor.height = zoom*0.26;
  imgResHorCtx.clearRect(0,0,zoom*1.2+5,zoom*0.26+5);
  imgResHorCtx.rotate(-90 * Math.PI / 180);
  imgResHorCtx.drawImage(imgResVer, zoom*-0.26, 0);
  imgResHorCtx.setTransform(1, 0, 0, 1, 0, 0);

  imgVsrUp.width = zoom*0.26;
  imgVsrUp.height = zoom*1.2;
  imgVsrUpCtx.clearRect(0,0,zoom*0.26+5,zoom*1.2+5);
  imgVsrUpCtx.lineCap = 'round';
  imgVsrUpCtx.strokeStyle = '#E0E0E0';
  imgVsrUpCtx.lineWidth = 4;
  imgVsrUpCtx.beginPath();
  imgVsrUpCtx.moveTo(zoom*0.13,zoom*0.1);
  imgVsrUpCtx.lineTo(zoom*0.13,zoom*0.4);
  imgVsrUpCtx.moveTo(zoom*0.13,zoom*0.8);
  imgVsrUpCtx.lineTo(zoom*0.13,zoom*1.1);
  imgVsrUpCtx.moveTo(zoom*0.08,zoom*0.4);
  imgVsrUpCtx.lineTo(zoom*0.18,zoom*0.4);
  imgVsrUpCtx.moveTo(zoom*0.03,zoom*0.54);
  imgVsrUpCtx.lineTo(zoom*0.23,zoom*0.54);
  imgVsrUpCtx.moveTo(zoom*0.08,zoom*0.66);
  imgVsrUpCtx.lineTo(zoom*0.18,zoom*0.66);
  imgVsrUpCtx.moveTo(zoom*0.03,zoom*0.8);
  imgVsrUpCtx.lineTo(zoom*0.23,zoom*0.8);
  imgVsrUpCtx.stroke();

  imgVsrDown.width = zoom*0.26;
  imgVsrDown.height = zoom*1.2;
  imgVsrDownCtx.clearRect(0,0,zoom*1.2+5,zoom*0.26+5);
  imgVsrDownCtx.rotate(180 * Math.PI / 180);
  imgVsrDownCtx.drawImage(imgVsrUp, zoom*-0.26, zoom*-1.2);
  imgVsrDownCtx.setTransform(1, 0, 0, 1, 0, 0);

  imgVsrLeft.width = zoom*1.2;
  imgVsrLeft.height = zoom*0.26;
  imgVsrLeftCtx.clearRect(0,0,zoom*1.2+5,zoom*0.26+5);
  imgVsrLeftCtx.rotate(-90 * Math.PI / 180);
  imgVsrLeftCtx.drawImage(imgVsrUp, zoom*-0.26, 0);
  imgVsrLeftCtx.setTransform(1, 0, 0, 1, 0, 0);

  imgVsrRight.width = zoom*1.2;
  imgVsrRight.height = zoom*0.26;
  imgVsrRightCtx.clearRect(0,0,zoom*1.2+5,zoom*0.26+5);
  imgVsrRightCtx.rotate(90 * Math.PI / 180);
  imgVsrRightCtx.drawImage(imgVsrUp, 0, zoom*-1.2);
  imgVsrRightCtx.setTransform(1, 0, 0, 1, 0, 0);
}
