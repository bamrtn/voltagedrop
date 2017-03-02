/*

# Auto0px.js - Transition between automatic css values and absolute ones

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


## Problem:
  While CSS transitions work well with JavaScript, there is one exception; when
  you change 'height: auto' to 'height: 0px'. This immediately jumps to the
  ending position. To fix this you have to change the element's height to it's
  calculated one and then set it to 0px. However this problem gets even more
  complicated because some browsers (Firefox 50 and IE 11 in my experience)
  don't let you change a CSS property to an absolute property right after
  changing it from auto to another absolute value. Furthermore a transition from
  0px to auto involves longer timeouts which has to be cancellable otherwise the
  main feature of transitions would be lost.

  In conclusion you have to run a function first, wait a few milliseconds,
  change some CSS properties and after the transition finishes run another
  function. And both timeouts should handle changing the animation.

Example of a modal fade out animation:

  *  Set opacity to 1 and height to calculated value
  *  Wait for browser processing the request
  *  Set opacity to 0 and height to 0px
  *  Wait for transition
  *  Set display to none

Reverse of this animation:

  *  Set opacity to 0, height to 0px and display to block
  *  Wait for browser
  *  Set opacity to 1 and height to calculated value

## Solution:
  In general we have a starting function, a middle function where we set the
  transition target and a finalizing function.

  If the transition is changed while waiting for the browser we can safely
  ignore the starting function of the new transition and after cancelling the
  middle and finalizing functions of the old transition continue the new one.

  Similarly if the transition is interrupted while waiting for the CSS
  transition we can cancel the finalizing function and continue with the middle
  function of the new transition.

  While this method allows you to change transition targets you still have to
  pay attention to your starting function. For example if you tried to open the
  same modal twice after giving enough time to the first transition to finish,
  the second time it would jump to it's closed state because of your starting
  function.
*/

function ftransition(target, startingFunc, middleFunc, finalFunc, length){
  if (target.state === undefined){
    if (startingFunc !== undefined) startingFunc();
    if (middleFunc !== undefined || finalFunc !== undefined){
      target.timeout = setTimeout(function(){
        if (middleFunc !== undefined) middleFunc();
        if (finalFunc !== undefined) {
          target.timeout = setTimeout(function(){
            finalFunc();
            target.state = undefined;
          },length*1000);
          target.state = 'transitionWait';
        }else{
          target.state = undefined;
        }
      },50);
      target.state = 'browserWait';
    }
  } else if (target.state === 'browserWait'){
    clearTimeout(target.timeout);
    if (middleFunc !== undefined || finalFunc !== undefined){
      target.timeout = setTimeout(function(){
        if (middleFunc !== undefined) middleFunc();
        if (finalFunc !== undefined) {
          target.timeout = setTimeout(function(){
            finalFunc();
            target.state = undefined;
          },length*1000);
          target.state = 'transitionWait';
        }else{
          target.state = undefined;
        }
      },50);
    }else{
      target.state = undefined;
    }
  } else if (target.state === 'transitionWait'){
    clearTimeout(target.timeout);
    if (middleFunc !== undefined) middleFunc();
    if (finalFunc !== undefined) {
      target.timeout = setTimeout(function(){
        finalFunc();
        target.state = undefined;
      },length*1000);
    }else{
      target.state = undefined;
    }
  }
}
