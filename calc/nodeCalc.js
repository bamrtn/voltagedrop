var nodeCalc = function(){
  var nodeCalc = {};

  // Array of nodes for calculation
  nodeCalc.array = [];
  // Array of all nodes
  nodeCalc.nodes = [];
  // Grid of nodes to associate them with nodes in the editor
  nodeCalc.nodesG = [];
  // Array of edges important for calculation
  nodeCalc.edges = [];
  for (var i = 0; i<size+1; i++){
    nodeCalc.nodesG.push([]);
    for (var j = 0; j<size+1; j++){
      nodeCalc.nodesG[i].push({'array':[],'node':{}, 'gNode':0});
    }
  }
  // Add new node
  nodeCalc.add = function(elem,posX,posY){
    this.nodesG[posX][posY].array.push(elem);
    if (this.nodesG[posX][posY].array.length == 2){
      this.nodesG[posX][posY].node = new node('normal',posX,posY);
    }
    if (this.nodesG[posX][posY].gNode === 0){
      this.array.push({'index':this.array.length,'posX':posX,'posY':posY,'connect':[], 'voltage':Math.random()*5+1, 'model':undefined});
      this.nodesG[posX][posY].gNode = this.array[this.array.length-1];
    }
    this.nodes.push({
      'elem':elem,
      'posX':posX,
      'posY':posY,
      'index':this.nodesG[posX][posY].array.length-1});
    return {'calcID':this.nodes.length-1,'gNode':this.nodesG[posX][posY].gNode};
  };
  // Delete node
  nodeCalc.del = function(id){
    var elem = this.nodes[id];
    var array = this.nodesG[elem.posX][elem.posY].array;
    array[elem.index] = array[array.length-1];
    this.nodes[array[elem.index].calcID].index = elem.index;
    array.pop();
    if (array.length == 1){
      this.nodesG[elem.posX][elem.posY].node.del();
    }
    if (array.length === 0 && this.nodesG[elem.posX][elem.posY].gNode !== 0){
      var gNode = this.nodesG[elem.posX][elem.posY].gNode;
      if (gNode.model!==undefined) gNode.model.del();
      this.array[gNode.index] = this.array[this.array.length-1];
      this.array[gNode.index].index = gNode.index;
      this.array.pop();
      this.nodesG[elem.posX][elem.posY].gNode = 0;
    }
  };
  // Draw voltage in 3D
  nodeCalc.voltage = function(posX,posY){
    nodesG[posX][posY].model = scene.drawVoltage(nodesG[posX][posY].voltage,posX,posY);
  };
  // Set up connection between two nodes
  nodeCalc.connect = function(node1,node2,elem){
    var model = scene.connect([[node1.posX,node1.posY],
      (node1.type == 'top' || node1.type == 'bottom'?
        [node1.origX,node1.posY]:
        [node1.posX,node1.origY]),
      (node2.type == 'top' || node2.type == 'bottom'?
        [node2.origX,node2.posY]:
        [node2.posX,node2.origY]),
      [node2.posX,node2.posY]
      ]);
    node1.gNode.connect.push({
      'end':node2.gNode,
      'endOriginal':node2,
      'edge':elem,
      'begin':node1.gNode,
      'beginOriginal':node1,
      'index':node1.gNode.connect.length,
      'positive':true,
      'model': model
    });
    node2.gNode.connect.push({
      'end':node1.gNode,
      'endOriginal':node1,
      'beginOriginal':node2,
      'edge':elem,
      'begin':node2.gNode,
      'index':node2.gNode.connect.length,
      'positive':false,
      'model': model
    });
    return [
      node1.gNode.connect[node1.gNode.connect.length-1],
      node2.gNode.connect[node2.gNode.connect.length-1]];
  };
  // Destroy the connection
  nodeCalc.disconnect = function(conn1,conn2){
    conn1.begin.connect[conn1.index] = conn1.begin.connect[conn1.begin.connect.length-1];
    conn1.begin.connect[conn1.index].index = conn1.index;
    conn1.begin.connect.pop();
    conn2.begin.connect[conn2.index] = conn2.begin.connect[conn2.begin.connect.length-1];
    conn2.begin.connect[conn2.index].index = conn2.index;
    conn2.begin.connect.pop();
    if (conn1.positive){
      if (conn1.model2 !== undefined) conn1.model2.del();
    }else{
      if (conn2.model2 !== undefined) conn2.model2.del();
    }
    conn1.model.del();
  };
  // Actual calculator function
  nodeCalc.calc = function(){
    var input = [];
    for(var i in this.array){
      for(var j in this.array[i].connect){
        var conn = this.array[i].connect[j];
        input.push(conn.begin.index);
        input.push(conn.end.index);
        input.push((conn.edge.type == 'horizontal' || conn.edge.type == 'vertical')?0:1);
        input.push((conn.edge.type == 'horizontal' || conn.edge.type == 'vertical')?conn.edge.param:conn.edge.param*(conn.positive*2-1));
      }
    }
    /*for(var i = 0; i<input.length; i+=4){
      console.log(input[i]+' '+input[i+1]+' '+input[i+2]+' '+input[i+3]);
    }*/
    function genV(){
      var v = new Module.VectorFloat();
      for(var i = 0; i<input.length; i++){
        v.push_back(input[i]);
      }
      return v;
    }
    var o = Module.calc(genV());
    for (var i=0; i<this.array.length; i++){
      this.array[i].voltage = o.get(i);
    }
    for (var i in this.array){
      var gNode = this.array[i];
      if (gNode.model !== undefined) gNode.model.del();
      gNode.model = scene.drawVoltage(gNode.voltage,gNode.posX,gNode.posY);
      for(var j in gNode.connect){
        var conn = gNode.connect[j];
        if(conn.positive){
          if(conn.model2 !== undefined) conn.model2.del();
          conn.model2 = scene.drawConn([[conn.beginOriginal.posX,conn.beginOriginal.posY,conn.begin.voltage],
            (conn.beginOriginal.type == 'top' || conn.beginOriginal.type == 'bottom'?
              [conn.beginOriginal.origX,conn.beginOriginal.posY,conn.begin.voltage]:
              [conn.beginOriginal.posX,conn.beginOriginal.origY,conn.begin.voltage]),
            (conn.beginOriginal.type == 'top' || conn.beginOriginal.type == 'left'?
              [conn.edge.posX,conn.edge.posY,conn.begin.voltage]:
              (conn.beginOriginal.type == 'bottom'?
                [conn.edge.posX,conn.edge.posY+1,conn.begin.voltage]:
                [conn.edge.posX+1,conn.edge.posY,conn.begin.voltage])),
            (conn.beginOriginal.type == 'bottom' || conn.beginOriginal.type == 'right'?
              [conn.edge.posX,conn.edge.posY,conn.end.voltage]:
              (conn.beginOriginal.type == 'top'?
                [conn.edge.posX,conn.edge.posY+1,conn.end.voltage]:
                [conn.edge.posX+1,conn.edge.posY,conn.end.voltage])),
            (conn.endOriginal.type == 'top' || conn.endOriginal.type == 'bottom'?
              [conn.endOriginal.origX,conn.endOriginal.posY,conn.end.voltage]:
              [conn.endOriginal.posX,conn.endOriginal.origY,conn.end.voltage]),
            [conn.endOriginal.posX,conn.endOriginal.posY,conn.end.voltage]
          ]);
          if(conn.edge.type == 'horizontal' || conn.edge.type == 'vertical'){
            conn.edge.voltage = (conn.begin.voltage>conn.end.voltage?
              conn.begin.voltage-conn.end.voltage:
              conn.end.voltage-conn.begin.voltage);
            conn.edge.current = conn.edge.voltage/conn.edge.param;
            conn.edge.power = conn.edge.current*conn.edge.voltage;
          }
        }
      }
    }
  };
  return nodeCalc;
};
