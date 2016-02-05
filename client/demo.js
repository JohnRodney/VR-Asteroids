Game = {};
Game.loaded = false;

Template.scene.onRendered(function (){
  SceneManager.init();
  loadMeteor();
  addMenu();
  addLeaderboard();
  addStarField();
  addCrossHair();
  createMiniMapObjects();
  Utils.animate( [SceneManager, Utils] );
  Utils.registerFunction(rotateAllAsteroids);
  Utils.registerFunction(addMiniMap);
  Utils.events({
    'lookAt .start': function(mesh) {
      console.log(smallSphere);
      startCountDown(mesh);
      changeOpacity(Game.smallSphere);
      newGame();
    }
  });
});

function changeOpacity(mesh) {
  Utils.transition({
    mesh: mesh,
    type: 'fade-out',
    duration: 5,
    callback: function(tar){SceneManager.scene.remove(tar)},
  });
}

function addSmallSphere() {
  var geometry = new THREE.SphereGeometry( 180, 60, 40 );
  geometry.applyMatrix( new THREE.Matrix4().makeScale( -2, 2, 2 ) );
  smallSphere = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 1, transparent: true }));
  SceneManager.scene.add(smallSphere);
  Game.smallSphere = smallSphere;
  Game.smallSphere.name = 'smallSphere';
  return smallSphere;
}

function startCountDown(mesh) {
  SceneManager.scene.remove(mesh);
  SceneManager.scene.remove(Game.leaderboard);
  countDown();
}

function countDown() {
  var counter = 3;
  setInterval(function() {
    counter--;
    if (counter >= 0) {
      var mesh = createTextMesh(String(counter+1), {font: 'helvetiker', size : 30, height: 1}, {color: 0xff0000})
      setTimeout(function(){
        SceneManager.scene.remove(mesh);
      }, 1000)
    }
    if (counter === 0) {

      addMeteors();
    }
  }, 1000);
}

function addMenu() {
  var start = createTextMesh('START', {font: 'helvetiker', size : 10, height: 1}, {color: 0xdddddd}, {x: 0, y: 150, z: 0}, {x: 30, y: 20, z: -100});
  var leaderboard = createTextMesh('LEADERBOARD', {font: 'helvetiker', size : 10, height: 1}, {color: 0xdddddd}, {x: 0, y: -150, z: 0}, {x: -80, y: -60, z: -100});
  addSmallSphere();
}

function addLeaderboard(){
  console.log("attach leaderboard");
  var x = (screen.width/2) - 40;
  var y = -65;
  var z = 0;

  var name = ["Martin", "Khalid", "JR", "Noa", "Choung", "Byron", "Brian"];

  for(var i = 0; i < scores.length; i++){
    console.log(name[i]);
    var textShapes = THREE.FontUtils.generateShapes(name[i], {'font' : 'helvetiker', 'weight' : 'normal', 'style' : 'normal', 'size' : 6, 'curveSegments' : 300} );
    var text = new THREE.ShapeGeometry( textShapes );
    var textMesh = new THREE.Mesh( text, new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true } ) ) ;

    textMesh.position.x = 0;
    textMesh.position.y = y;
    textMesh.position.z = -100;
    textMesh.lookAt(SceneManager.camera.position);
    SceneManager.scene.add(textMesh);
    y-= 15;
  }
}

function createTextMesh(text, text_options, material_options, rotation, position) {
  var material = new THREE.MeshBasicMaterial(material_options);
  var textGeom = new THREE.TextGeometry(text, text_options);
  var textMesh = new THREE.Mesh( textGeom, material );
  SceneManager.scene.add( textMesh );
  if(position) {
    textMesh.position.x = position.x;
    textMesh.position.y = position.y;
    textMesh.position.z = position.z;
  }else {
    var camera = SceneManager.camera.getWorldDirection();
    textMesh.position.x = camera.x*150;
    textMesh.position.y = camera.y*150;
    textMesh.position.z = camera.z*150;
  }
  if(rotation) {
    textMesh.rotation.x = rotation.x;
    textMesh.rotation.y = rotation.y;
    textMesh.rotation.z = rotation.z;
  }
  Game[text.toLowerCase()] = textMesh;
  Game[text.toLowerCase()].name = text.toLowerCase();
  return textMesh;
}

function newGame() {
  Game.playerLives = 3;
  Game.playerScore = 0;
  Game.asteroidTimer = 8000;
}

function addMeteors() {
  if(Game.loaded){ addMeteor(); }
  Game.timeout = setTimeout(addMeteors, Game.asteroidTimer);
}

function loadMeteor() {
  new THREE.JSONLoader().load('/asteroid.json', saveToGame);
}

function saveToGame(geometry) {
  var material = new THREE.MeshPhongMaterial(mapWith({map: '/astroid.jpg', bump: '/asteroidbump.jpg', spec: '/asteroidspec.jpg'}));
  Game.asteroid = new THREE.Mesh(geometry, material);
  Game.asteroid.name = 'asteroid';
  Game.loaded = true;
}

function addMeteor() {
  var newAsteroid = Game.asteroid.clone();
  SceneManager.scene.add(newAsteroid);
  copyRandomVector(newAsteroid.position);
  attack(15, newAsteroid);
}

function attack(time, mesh) {
  Utils.transition({
    mesh: mesh,
    type: 'vector-move',
    opts: { stop: { y: 0, x: 0, z: 0, }, },
    duration: time,
    callback: function(tar){
      if(SceneManager.scene.getObjectByProperty('uuid', tar.uuid)) {
        loseLife();
        SceneManager.scene.remove(tar);
      }
    }
  });
}

function randomPosition() {
var pos = Math.random() * 400 - 200;
if(pos >= -50 || pos <= 50){
  pos += 100;
}
return pos;
}

function copyRandomVector(target) {
  target.x = randomPosition();
  target.y = randomPosition();
  target.z = randomPosition();
}

function rotateAllAsteroids() {
  SceneManager.scene.children.forEach( function(child){
    if(child.name === 'asteroid'){
      child.rotation.x += .01;
      child.rotation.y += .01;
    }
  });
}

function followCamera(mesh) {
  mesh.position.z = SceneManager.raycaster.ray.direction.z;
  mesh.position.x = SceneManager.raycaster.ray.direction.x;
  mesh.position.y = SceneManager.raycaster.ray.direction.y;
  mesh.lookAt( SceneManager.camera.position );
}

function addStarField() {
  var geometry = new THREE.SphereGeometry( 200, 60, 40 );
  geometry.applyMatrix( new THREE.Matrix4().makeScale( -2, 2, 2 ) );
  SceneManager.scene.add( new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('/space.jpg') })))
}

function addCrossHair() {
  var geometry = new THREE.CircleGeometry( 0.01 , 64 );
  geometry.vertices.shift();
  Game.crosshair = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xff0000 }));
  SceneManager.scene.add(Game.crosshair);
  Game.crosshair.functionID = Utils.registerFunction(followCamera, Game.crosshair);
}

function createMiniMapObjects() {
  var geometry = new THREE.CircleGeometry(8.00 , 64 );
  geometry.vertices.shift();
  Game.minimap = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0}));
  Game.minimap.name = 'minimap';
  geometry = new THREE.SphereGeometry(0.02, 32, 32 );
  material = new THREE.MeshPhongMaterial( {color: 0xff0000, transparent: true, opacity: .7} );
  Game.minimapRedSphere = new THREE.Mesh( geometry, material );
  geometry = new THREE.SphereGeometry(0.005, 32, 32 );
  material = new THREE.MeshPhongMaterial( {color: 0x00ff00 , transparent: true, opacity: .7} );
  Game.minimapGreenSphere = new THREE.Mesh( geometry, material );
}

function addMiniMap() {
  SceneManager.scene.delete('minimap');
  Game.minimap.children = [];
  SceneManager.scene.children.forEach(function(mesh){
    if (mesh.name === 'asteroid' || mesh.name === 'miniasteroid' || mesh.name === 'spawning') {
      var sphere;
      if(mesh.name === 'asteroid') {
        sphere = Game.minimapRedSphere.clone();
      } else {
        sphere = Game.minimapGreenSphere.clone();
      }
      THREE.SceneUtils.attach (sphere, SceneManager.scene, Game.minimap);
      sphere.position.x = mesh.position.x/200;
      sphere.position.y = mesh.position.y/200;
      sphere.position.z = mesh.position.z/200;
    }
  });
  SceneManager.scene.add(Game.minimap);
}

function mapWith(paths) {
  return {
    map: THREE.ImageUtils.loadTexture(paths.map),
    bumpMap: THREE.ImageUtils.loadTexture(paths.bump),
    bumpScale: 1,
    specularMap: THREE.ImageUtils.loadTexture(paths.spec),
    specular: new THREE.Color(1.0, 1.0, 1.0),
  }
}

var trackCamera = function(reticle) {
  console.log('reticle & dir')
  console.log(reticle)
  var dir = camera.getWorldDirection()
  console.log(dir)
  reticle.position.x = reticleMagnitude * dir.x
  reticle.position.y = reticleMagnitude * dir.y
  reticle.position.z = reticleMagnitude * dir.z
}

function loseLife() {
  Game.playerLives -= 1;

  if (Game.playerLives === 0) {
    endGame();
    addMenu();
  }
}

function endGame() {
  clearTimeout(Game.timeout);
  clearObjectsFromScene();
}

function clearObjectsFromScene() {
  var SceneManagerClone = SceneManager.scene.children;

  for (i = 0; i < SceneManagerClone.length; i++) {
    var child = SceneManager.scene.children[i];

    if (child.name === 'asteroid') {
      SceneManager.scene.remove(child);
    }
  }
}
