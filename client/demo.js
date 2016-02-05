Game = {};
Game.loaded = false;

Template.scene.onRendered(function (){
  SceneManager.init();
  loadMeteor();
  //addStarField();
  addCrossHair();
  Utils.animate( [SceneManager, Utils] );
  Utils.registerFunction(rotateAllAsteroids);
  //addMeteors();
  sound.background.play();
});

function addMeteors() {
  if(Game.loaded){ addMeteor(); }
  setTimeout(addMeteors, .1 * 30000 + 1000);
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
    callback: function(tar){SceneManager.scene.remove(tar)}
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

function mapWith(paths) {
  return {
    map: THREE.ImageUtils.loadTexture(paths.map),
    bumpMap: THREE.ImageUtils.loadTexture(paths.bump),
    bumpScale: 1,
    specularMap: THREE.ImageUtils.loadTexture(paths.spec),
    specular: new THREE.Color(1.0, 1.0, 1.0),
  }
}
