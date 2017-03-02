/*

# DragTrack.js - A library to handle touch and mouse input

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
// DragTrack global
_DragTrack = {currentlyDragged: []};

_DragTrack.handleMove = function(type, event){
  for (var i in _DragTrack.currentlyDragged){
    var listener = _DragTrack.currentlyDragged[i];
    // Find running listeners with the correct id
    if (listener.id == (type=='mouse'?-1:event.identifier)){
      listener.whileDrag.call(listener.originalElem,event,{
        'startX':listener.startX,
        'startY':listener.startY,
        'x':event.screenX,
        'y':event.screenY,
        'movementX':event.screenX-listener.lastX,
        'movementY':event.screenY-listener.lastY,
        'dragType':type
      });
      listener.lastX = event.screenX;
      listener.lastY = event.screenY;
    }
  }
};
_DragTrack.handleStop = function(type, event){
  for (var i=0; i<_DragTrack.currentlyDragged.length; i++){
    var listener = _DragTrack.currentlyDragged[i];
    // Find running listeners with the correct id
    if (listener.id == (type=='mouse'?-1:event.identifier)){
      listener.endDrag.call(listener.originalElem,event,{
        'startX':listener.startX,
        'startY':listener.startY,
        'x':event.screenX,
        'y':event.screenY,
        'movementX':event.screenX-listener.lastX,
        'movementY':event.screenY-listener.lastY,
        'dragType':type
      });
      // Stop listener
      listener.running = false;
      listener.currentlyDraggedIndex = -1;
      if (_DragTrack.currentlyDragged.length < 2){
        // Remove listeners from window if necessary
        _DragTrack.currentlyDragged = [];
        window.removeEventListener('mousemove',_DragTrack.mouseMoveListener);
        window.removeEventListener('mouseup',_DragTrack.mouseUpListener);
        window.removeEventListener('touchmove',_DragTrack.touchMoveListener);
        window.removeEventListener('touchend',_DragTrack.touchEndListener);
        window.removeEventListener('touchcancel',_DragTrack.touchEndListener);
      }else{
        _DragTrack.currentlyDragged[i]=
          _DragTrack.currentlyDragged[_DragTrack.currentlyDragged.length - 1];
        _DragTrack.currentlyDragged[i].currentlyDraggedIndex = i;
        _DragTrack.currentlyDragged.pop();
        //console.log(_DragTrack.currentlyDragged);
        //console.log(i);
        i--;
      }
    }
  }
};
_DragTrack.handleStart = function(type, event){
  /*DragTrack does not use preventDefault in order not
    to interfere with other input libraries.*/
  //Check if the event has been captured
  if (event.DragTrack === undefined) event.DragTrack = {'captured':false};
  if (event.DragTrack.captured === false){
    for (var i in this.DragTrack.listeners){
      var listener = this.DragTrack.listeners[i];
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
          if (listener.startDrag.call(this,event,{
            'startX':event.screenX,
            'startY':event.screenY,
            'dragType':type
            //Returning false means not capturing the event
          }) !== false) event.DragTrack.captured = true;
          //Even if it did not captured the event, it is still running
          //TODO ignore/cancel
          listener.running = true;
          listener.lastX = event.screenX;
          listener.lastY = event.screenY;
          listener.startX = event.screenX;
          listener.startY = event.screenY;
          listener.id = (type=='mouse'?-1:event.identifier);
          listener.originalElem = this;
          //Add to currently dragged elements
          listener.currentlyDraggedIndex =
            _DragTrack.currentlyDragged.length;
          _DragTrack.currentlyDragged.push(listener);
          if (_DragTrack.currentlyDragged.length == 1){
            window.addEventListener('mousemove',_DragTrack.mouseMoveListener);
            window.addEventListener('mouseup',_DragTrack.mouseUpListener);
            window.addEventListener('touchmove',_DragTrack.touchMoveListener);
            window.addEventListener('touchend',_DragTrack.touchEndListener);
            window.addEventListener('touchcancel',_DragTrack.touchEndListener);
          }
        }
      }
    }
  }
};

_DragTrack.mouseMoveListener = function(event){
  _DragTrack.handleMove('mouse',event);
};
_DragTrack.touchMoveListener = function(event){
  for (var i=0; i<event.changedTouches.length; i++){
    event.changedTouches[i].preventDefault = function(){event.preventDefault();};
    _DragTrack.handleMove('touch',event.changedTouches[i]);
  }
};
_DragTrack.mouseUpListener = function(event){
  _DragTrack.handleStop('mouse',event);
};
_DragTrack.touchEndListener = function(event){
  for (var i=0; i<event.changedTouches.length; i++){
    event.changedTouches[i].preventDefault = function(){event.preventDefault();};
    _DragTrack.handleStop('touch',event.changedTouches[i]);
  }
};
_DragTrack.mouseDownListener = function(event){
  _DragTrack.handleStart.call(this,'mouse',event);
};
_DragTrack.touchStartListener = function(event){
  for (var i=0; i<event.changedTouches.length; i++){
    event.changedTouches[i].preventDefault = function(){event.preventDefault();};
    _DragTrack.handleStart.call(this,'touch',event.changedTouches[i]);
  }
};


HTMLElement.prototype.addDTListener = function(
  startDrag,
  whileDrag,
  endDrag,
  params){
    if (this.DragTrack === undefined){
      this.DragTrack = {'listeners':[]};
    }
    var listener = {
      'startDrag':startDrag,
      'whileDrag':whileDrag,
      'endDrag':endDrag,
      'params':params,
      'running':false,
      'index': this.DragTrack.listeners.length,
      'currentlyDraggedIndex':-1
    };
    this.DragTrack.listeners.push(listener);
    if (this.DragTrack.listeners.length === 1){
      this.addEventListener('mousedown',_DragTrack.mouseDownListener);
      this.addEventListener('touchstart',_DragTrack.touchStartListener);
    }
    /*After returning the object the index can
      be changed speeding up removal of listeners.*/
    return listener;
};
HTMLElement.prototype.removeDTListener = function(){
    if (arguments.length == 1){
      // Removal by index
      var listener = arguments[0];
      var listeners = this.DragTrack.listeners;
      listeners[listener.index] = listeners[listeners.length-1];
      listeners[listener.index].index = listener.index;
      listeners.pop();
      if (listener.running !== false){
        listener.endDrag.call(listener.originalElem,{},{
          'startX':listener.startX,
          'startY':listener.startY,
          'x':listener.lastX,
          'y':listener.lastY,
          'movementX':0,
          'movementY':0,
          'dragType':'cancel'
        });
        if (_DragTrack.currentlyDragged.length < 2){
          // Remove listeners from window if necessary
          _DragTrack.currentlyDragged = [];
          window.removeEventListener('mousemove',_DragTrack.mouseMoveListener);
          window.removeEventListener('mouseup',_DragTrack.mouseUpListener);
          window.removeEventListener('touchmove',_DragTrack.touchMoveListener);
          window.removeEventListener('touchend',_DragTrack.touchEndListener);
          window.removeEventListener('touchcancel',_DragTrack.touchEndListener);
        }else{
          _DragTrack.currentlyDragged[listener.currentlyDraggedIndex]=
            _DragTrack.currentlyDragged[_DragTrack.currentlyDragged.length - 1];
            _DragTrack.currentlyDragged[listener.currentlyDraggedIndex].currentlyDraggedIndex = listener.currentlyDraggedIndex;
          _DragTrack.currentlyDragged.pop();
        }
      }
      return 1;
    }else{
      // Removal by finding listener
      //TODO
      var startDrag = arguments[0];
      var whileDrag = arguments[1];
      var endDrag = arguments[2];
      var params = arguments[3];
      for (var i in this.DragTrack.listeners){
        if (this.DragTrack.listeners[i].startDrag == startDrag &&
          this.DragTrack.listeners[i].whileDrag == whileDrag &&
          this.DragTrack.listeners[i].endDrag == endDrag &&
          this.DragTrack.listeners[i].params == params){
            var listener = this.DragTrack.listeners[i];
            var listeners = this.DragTrack.listeners;
            listeners[listener.index] = listeners[listeners.length-1];
            listeners[listener.index].index = listener.index;
            listeners.pop();
            if (listener.running !== false){
              listener.endDrag.call(listener.originalElem,{},{
                'startX':listener.startX,
                'startY':listener.startY,
                'x':listener.lastX,
                'y':listener.lastY,
                'movementX':0,
                'movementY':0,
                'dragType':'cancel'
              });
              if (_DragTrack.currentlyDragged.length < 2){
                // Remove listeners from window if necessary
                _DragTrack.currentlyDragged = [];
                window.removeEventListener('mousemove',_DragTrack.mouseMoveListener);
                window.removeEventListener('mouseup',_DragTrack.mouseUpListener);
                window.removeEventListener('touchmove',_DragTrack.touchMoveListener);
                window.removeEventListener('touchend',_DragTrack.touchEndListener);
                window.removeEventListener('touchcancel',_DragTrack.touchEndListener);
              }else{
                _DragTrack.currentlyDragged[listener.currentlyDraggedIndex]=
                  _DragTrack.currentlyDragged[_DragTrack.currentlyDragged.length - 1];
                  _DragTrack.currentlyDragged[listener.currentlyDraggedIndex].currentlyDraggedIndex = listener.currentlyDraggedIndex;
                _DragTrack.currentlyDragged.pop();
              }
            }
            return 1;
          }
      }
      return 0;
    }
};
