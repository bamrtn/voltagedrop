Voltage Drop
============

Voltage Drop is an educational application developed to help students understand
the basics of electrostatistics and more advanced circuits consisting of
resistors and voltage sources.

How to use
----------

Drag voltage sources and resistors from the title bar at the top onto the editor
grid. Then connect them by dragging the little circles next to them. Your
circuit may only consists of one component and may not contain contradicting
voltage sources, while containing at least one. If your circuit is valid, you
can press the play button in the top right corner to visualize voltage drops in
3D. You can delete elements and specify resistances and voltages using the panel
on the left. You can also see calculated values here. There is also an option to
save and load your circuits in the top left corner.

Check the examples file for some interesting circuits!

About the software
------------------
Voltage Drop uses DragTrack, a library created for this project, to work with
mouse and touch inputs. It also uses Auto0px, another library of mine, to make
animations smoother. It does the 3D rendering using BABYLONJS. The part which is
responsible for calculation is written in C++ and was translated into javascript
using asm.js.


Martin Balint
