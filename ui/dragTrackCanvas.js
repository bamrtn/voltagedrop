/*

# DragTrackCanvas.js - A combination of my DragTrack and canvasvg libraries

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

function DragTrackCanvas(canvas,image){
  this.currentlyDragged = [];
  this.canvas = canvas;
  this.image = image;

  var dtcObject = this;

  this.mouseMoveListener = function(event){
    dtcObject.handleMove('mouse',event);
  };
  this.touchMoveListener = function(event){
    for (var i=0; i<event.changedTouches.length; i++){
      event.changedTouches[i].preventDefault = function(){event.preventDefault();};
      dtcObject.handleMove('touch',event.changedTouches[i]);
    }
  };
  this.mouseUpListener = function(event){
    dtcObject.handleStop('mouse',event);
  };
  this.touchEndListener = function(event){
    for (var i=0; i<event.changedTouches.length; i++){
      event.changedTouches[i].preventDefault = function(){event.preventDefault();};
      dtcObject.handleStop('touch',event.changedTouches[i]);
    }
  };
  this.mouseDownListener = function(event){
    dtcObject.handleStart('mouse',event,trackClick(dtcObject.image, event.clientX, event.clientY));
  };
  this.touchStartListener = function(event){
    for (var i=0; i<event.changedTouches.length; i++){
      event.changedTouches[i].preventDefault = function(){event.preventDefault();};
      dtcObject.handleStart('touch',event.changedTouches[i],trackClick(dtcObject.image, event.changedTouches[i].clientX, event.changedTouches[i].clientY));
    }
  };

  window.addEventListener('mousemove',this.mouseMoveListener);
  window.addEventListener('mouseup',this.mouseUpListener);
  window.addEventListener('touchmove',this.touchMoveListener);
  window.addEventListener('touchend',this.touchEndListener);
  window.addEventListener('touchcancel',this.touchEndListener);
  this.canvas.addEventListener('mousedown',this.mouseDownListener);
  this.canvas.addEventListener('touchstart',this.touchStartListener);
}

DragTrackCanvas.removeDTListener = function(){
    if (arguments.length == 1){
      // Removal by index
      var listener = arguments[0];
      var listeners = listener.originalElem.DragTrack.listeners;
      listeners[listener.index] = listeners[listeners.length-1];
      listeners[listener.index].index = listener.index;
      listeners.pop();
      if (listener.running !== false){
        listener.endDrag.call(listener.originalElem,{preventDefault: function(){}},{
          'startX':listener.startX,
          'startY':listener.startY,
          'x':listener.lastX,
          'y':listener.lastY,
          'movementX':0,
          'movementY':0,
          'dragType':'cancel'
        });
        if (this.currentlyDragged.length < 2){
          // Remove listeners from window if necessary
          this.currentlyDragged = [];
        }else{
          this.currentlyDragged[listener.currentlyDraggedIndex]=
            this.currentlyDragged[this.currentlyDragged.length - 1];
            this.currentlyDragged[listener.currentlyDraggedIndex].currentlyDraggedIndex = listener.currentlyDraggedIndex;
          this.currentlyDragged.pop();
        }
      }
      return 1;
    }else{
      // Removal by finding listener
      var elem = arguments[0];
      var startDrag = arguments[1];
      var whileDrag = arguments[2];
      var endDrag = arguments[3];
      var params = arguments[4];
      for (var i in elem.DragTrack.listeners){
        if (elem.DragTrack.listeners[i].startDrag == startDrag &&
          elem.DragTrack.listeners[i].whileDrag == whileDrag &&
          elem.DragTrack.listeners[i].endDrag == endDrag &&
          elem.DragTrack.listeners[i].params == params){
            var listener = elem.DragTrack.listeners[i];
            var listeners = elem.DragTrack.listeners;
            listeners[listener.index] = listeners[listeners.length-1];
            listeners[listener.index].index = listener.index;
            listeners.pop();
            if (listener.running !== false){
              listener.endDrag.call(listener.originalElem,{preventDefault: function(){}},{
                'startX':listener.startX,
                'startY':listener.startY,
                'x':listener.lastX,
                'y':listener.lastY,
                'movementX':0,
                'movementY':0,
                'dragType':'cancel'
              });
              if (this.currentlyDragged.length < 2){
                // Remove listeners from window if necessary
                this.currentlyDragged = [];
              }else{
                this.currentlyDragged[listener.currentlyDraggedIndex]=
                  this.currentlyDragged[this.currentlyDragged.length - 1];
                  this.currentlyDragged[listener.currentlyDraggedIndex].currentlyDraggedIndex = listener.currentlyDraggedIndex;
                this.currentlyDragged.pop();
              }
            }
            return 1;
          }
      }
      return 0;
    }
};

DragTrackCanvas.prototype.addDTListener = function(
  elem,
  startDrag,
  whileDrag,
  endDrag,
  params){
    if (elem.DragTrack === undefined){
      elem.DragTrack = {'listeners':[]};
    }
    var listener = {
      'startDrag':startDrag,
      'whileDrag':whileDrag,
      'endDrag':endDrag,
      'params':params,
      'running':false,
      'index': elem.DragTrack.listeners.length,
      'currentlyDraggedIndex':-1,
      'originalElem': elem
    };
    elem.DragTrack.listeners.push(listener);
    /*After returning the object the index can
      be changed speeding up removal of listeners.*/
    return listener;
};

DragTrackCanvas.prototype.handleMove = function(type, event){
  for (var i in this.currentlyDragged){
    var listener = this.currentlyDragged[i];
    // Find running listeners with the correct id
    if (listener.id == (type=='mouse'?-1:event.identifier)){
      listener.whileDrag.call(listener.originalElem,event,{
        'startX':listener.startX,
        'startY':listener.startY,
        'x':event.clientX,
        'y':event.clientY,
        'movementX':event.clientX-listener.lastX,
        'movementY':event.clientY-listener.lastY,
        'dragType':type
      });
      listener.lastX = event.clientX;
      listener.lastY = event.clientY;
    }
  }
};
DragTrackCanvas.prototype.handleStop = function(type, event){
  for (var i=0; i<this.currentlyDragged.length; i++){
    var listener = this.currentlyDragged[i];
    // Find running listeners with the correct id
    if (listener.id == (type=='mouse'?-1:event.identifier)){
      listener.endDrag.call(listener.originalElem,event,{
        'startX':listener.startX,
        'startY':listener.startY,
        'x':event.clientX,
        'y':event.clientY,
        'movementX':event.clientX-listener.lastX,
        'movementY':event.clientY-listener.lastY,
        'dragType':type
      });
      // Stop listener
      listener.running = false;
      listener.currentlyDraggedIndex = -1;
      if (this.currentlyDragged.length < 2){
        // Remove listeners from window if necessary
        this.currentlyDragged = [];
      }else{
        this.currentlyDragged[i]=
          this.currentlyDragged[this.currentlyDragged.length - 1];
        this.currentlyDragged[i].currentlyDraggedIndex = i;
        this.currentlyDragged.pop();
        //console.log(_DragTrack.currentlyDragged);
        //console.log(i);
        i--;
      }
    }
  }
};
DragTrackCanvas.prototype.handleStart = function(type, event, elem){
  /*DragTrack does not use preventDefault in order not
    to interfere with other input libraries.*/
  var captured = false;
  if (!(elem != -1 && 'DragTrack' in elem)) return false;
  for (var i in elem.DragTrack.listeners){
    var listener = elem.DragTrack.listeners[i];
    if (listener.running === false){
      //Handle modifiers from parameters
      var start = true;
      if (listener.params!==undefined && listener.params.dontDragBy!==undefined){
        for (var j=0; j<listener.params.dontDragBy.length; j++){
          if (listener.params.dontDragBy[j]==event.target) start = false;
        }
      }
      if (listener.params!==undefined && listener.params.dragBy!==undefined){
        start = false;
        for (var j=0; j<listener.params.dragBy.length; j++){
          if (listener.params.dragBy[j]==event.target) start = true;
        }
      }
      if (start){
        //Fire startDrag
        if (listener.startDrag.call(listener.originalElem,event,{
          'x':event.clientX,
          'y':event.clientY,
          'startX':event.clientX,
          'startY':event.clientY,
          'dragType':type
          //Returning false means not capturing the event
        }) !== false) captured = true;
        //Even if it did not captured the event, it is still running
        //TODO ignore/cancel
        listener.running = true;
        listener.lastX = event.clientX;
        listener.lastY = event.clientY;
        listener.startX = event.clientX;
        listener.startY = event.clientY;
        listener.id = (type=='mouse'?-1:event.identifier);
        //Add to currently dragged elements
        listener.currentlyDraggedIndex =
          this.currentlyDragged.length;
        this.currentlyDragged.push(listener);
      }
    }
  }
  return captured;
};
