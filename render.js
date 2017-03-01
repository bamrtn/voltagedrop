var createScene = function () {
   // Set up BABYLONJS scene
  var scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.2, 0.2, 0.2);
  var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, BABYLON.Vector3.Zero(), scene);
  camera.lowerBetaLimit = 0.1;
  camera.upperBetaLimit = (Math.PI / 2) * 0.9;
  camera.lowerRadiusLimit = 30;
  camera.upperRadiusLimit = 1500;
  camera.attachControl(canvas, true);
  var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0.4, 1, 0.6), scene);
  light1.diffuse = new BABYLON.Color3(1, 1, 1);
  light1.intensity = 0.8;


  // Set up materials
  var Bmaterial = new BABYLON.StandardMaterial("mat", scene);
  Bmaterial.diffuseColor = new BABYLON.Color3(0, 1, 0.9);
  Bmaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  var Gmaterial = new BABYLON.StandardMaterial("mat", scene);
  Gmaterial.diffuseColor = new BABYLON.Color3(0.4, 1, 0.3);
  Gmaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  var Rmaterial = new BABYLON.StandardMaterial("mat", scene);
  Rmaterial.diffuseColor = new BABYLON.Color3(1, 0.3, 0.0);
  Rmaterial.specularColor = new BABYLON.Color3(0, 0, 0);

  // Draw grid
  for (var i=0; i<size+1; i++){
    var line = BABYLON.Mesh.CreateLines("lines",[
      new BABYLON.Vector3(-50,0,-50+i*(100/size)),
      new BABYLON.Vector3(-50+size*(100/size),0, -50+i*(100/size))
    ],scene);
    line.color = new BABYLON.Color3(0.8,0.8,0.8);
  }
  for (var i=0; i<size+1; i++){
    var line = BABYLON.Mesh.CreateLines("lines",[
      new BABYLON.Vector3(-50+i*(100/size),0, -50),
      new BABYLON.Vector3(-50+i*(100/size),0, -50+size*(100/size))
    ],scene);
    line.color = new BABYLON.Color3(0.8,0.8,0.8);
  }

  // Function to create vsource meshe
  scene.vsourceX = function(){
    var box1 = BABYLON.MeshBuilder.CreateBox("box", {height: (100/size)/3, width: (100/size)/3, depth: (100/size)/6}, scene);
    box1.material = Rmaterial;
    box1.position.z = (100/size)/4;
    var box2 = BABYLON.MeshBuilder.CreateBox("box", {height: (100/size)/5, width: (100/size)/5, depth: (100/size)/6}, scene);
    box2.material = Rmaterial;
    box2.position.z = (100/size)*(5/12);
    var box3 = BABYLON.MeshBuilder.CreateBox("box", {height: (100/size)/3, width: (100/size)/3, depth: (100/size)/6}, scene);
    box3.material = Rmaterial;
    box3.position.z = (100/size)*(7/12);
    var box4 = BABYLON.MeshBuilder.CreateBox("box", {height: (100/size)/5, width: (100/size)/5, depth: (100/size)/6}, scene);
    box4.material = Rmaterial;
    box4.position.z = (100/size)*(3/4);
    var vsourceX = BABYLON.Mesh.MergeMeshes([box1,box2,box3,box4]);
    vsourceX.setEnabled(0);
    return vsourceX;
  };

  // Function to create resistor meshe
  scene.resistorX = function(){
    var resistorX = BABYLON.MeshBuilder.CreateCylinder("cylinder", {diameter: (100/size)/4, tessellation: 8, height: (100/size)*(2/3)}, scene);
    resistorX.material = Bmaterial;
    resistorX.rotation.x = Math.PI/2;
    resistorX.setEnabled(0);
    return resistorX;
  };
  var rx = new scene.resistorX();
  var vsx = new scene.vsourceX();

  // Function to position and orient vsources
  scene.vsource = function(type,posX,posY){
    var vs = vsx.createInstance();
    vs.enableEdgesRendering(0.9999999999);
    vs.edgesWidth = 16.0;
    vs.edgesColor = new BABYLON.Color4(1, 0.3, 0.0, 1);
    if(type == 'up'){
      vs.rotation.y = -Math.PI/2;
      vs.position.x = (posY+1)*(100/size)-50;
      vs.position.z = (posX)*(100/size)-50;
    }
    if(type == 'down'){
      vs.rotation.y = Math.PI/2;
      vs.position.x = (posY)*(100/size)-50;
      vs.position.z = (posX)*(100/size)-50;
    }
    if(type == 'right'){
      vs.position.x = (posY)*(100/size)-50;
      vs.position.z = (posX)*(100/size)-50;
    }
    if(type == 'left'){
      vs.rotation.y = Math.PI;
      vs.position.x = (posY)*(100/size)-50;
      vs.position.z = (posX+1)*(100/size)-50;
    }
    vs.del = function(){
      this.setEnabled(0);
    };
    return vs;
  };

  // Function to position and orient resistors
  scene.resistor = function(type,posX,posY){
    var res = rx.createInstance();
    res.enableEdgesRendering(0.9999999999);
    res.edgesWidth = 16.0;
    res.edgesColor = new BABYLON.Color4(0.3, 1, 0.8, 1);
    if(type == 'vertical'){
      res.rotation.y = -Math.PI/2;
      res.position.x = (posY+1)*(100/size)-50-(100/size)/2;
      res.position.z = (posX)*(100/size)-50;
    }else{
      res.position.x = (posY)*(100/size)-50;
      res.position.z = (posX)*(100/size)-50+(100/size)/2;
    }
    res.del = function(){
      this.setEnabled(0);
    };
    return res;
  };

  // Function to draw voltage lines
  scene.drawVoltage = function(v,posX,posY){
    var voltage = {};
    v = v*(50/size);
    voltage.sphere = scene.node(posX,posY);
    voltage.sphere.position.y = v;
    voltage.line = BABYLON.Mesh.CreateLines("lines",[
      new BABYLON.Vector3(voltage.sphere.position.x,0,voltage.sphere.position.z),
      new BABYLON.Vector3(voltage.sphere.position.x,v,voltage.sphere.position.z)
    ],scene);
    voltage.del = function(){
      this.sphere.setEnabled(0);
      this.line.setEnabled(0);
    };
    return voltage;
  };
  // Function to connections on the flat grid
  scene.connect = function(array){
    var path = [];
    for (var i in array){
      path.push(new BABYLON.Vector3(array[i][1]*(100/size)-50,0,array[i][0]*(100/size)-50));
    }
    var tube = BABYLON.Mesh.CreateTube("tube", path,6/size, 8, null, BABYLON.Mesh.CAP_ALL, scene, false, BABYLON.Mesh.FRONTSIDE);
    tube.material = Gmaterial;
    tube.enableEdgesRendering(0.9999999999);
    tube.edgesWidth = 16.0;
    tube.edgesColor = new BABYLON.Color4(0.5, 1, 0.0, 1);
    tube.del = function(){
      this.setEnabled(0);
    };
    return tube;
  };
  // Function to draw connections in 3D
  scene.drawConn = function(array){
    var path = [];
    for (var i in array){
      path.push(new BABYLON.Vector3(array[i][1]*(100/size)-50,array[i][2]*(50/size),array[i][0]*(100/size)-50));
    }
    var tube = BABYLON.Mesh.CreateTube("tube", path,6/size, 8, null, BABYLON.Mesh.CAP_ALL, scene, false, BABYLON.Mesh.FRONTSIDE);
    tube.material = Rmaterial;
    tube.enableEdgesRendering(0.9999999999);
    tube.edgesWidth = 16.0;
    tube.edgesColor = new BABYLON.Color4(1, 0.3, 0.0, 1);
    tube.del = function(){
      this.setEnabled(0);
    };
    return tube;
  };
  // Function to draw nodes
  scene.node = function(posX,posY){
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 25/size, segments: 4}, scene);
    sphere.material = Bmaterial;
    sphere.position.x = posY*(100/size)-50;
    sphere.position.z = posX*(100/size)-50;
    sphere.enableEdgesRendering(0.9999999999);
    sphere.edgesWidth = 16.0;
    sphere.edgesColor = new BABYLON.Color4(0.3, 1, 0.8, 1);
    sphere.del = function(){
      this.setEnabled(0);
    };
    return sphere;
  };
   return scene;
};
