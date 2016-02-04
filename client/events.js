Utils.events({
  'lookAt .asteroid': function(mesh) {
    SceneManager.scene.remove(mesh);
    sound.roar.play();
    explosion(mesh);
  }
});

function getScaleMap() {
  return { 0: 0.07, 1: 0.07, 2: 0.07, 3: 0.07, 4: 0.22, 5: 0.50 };
}

function multiplyScale(mesh, index) {
  return getScaleMap()[index] * mesh.scale.x;
}

function explosion(mesh) {
  var clones = [];
  for(var i = 0; i < 6; i++){
    clones.push(spawnClone(mesh, i));
    runAway(clones[i]);
  }
  registerAsAsteroids(clones, 500)
}

function registerAsAsteroids(clones, delay) {
  setTimeout(function(){
    clones.forEach( function(clone){
      clone.name = 'asteroid';
    });
  }, delay);
}

function runAway(clone) {
  Utils.transition({
    mesh: clone,
    type: 'vector-move',
    opts: {
      stop: {
        y: clone.position.y + Math.random() * 200 - 100,
        x: clone.position.x + Math.random() * 200 - 100,
        z: clone.position.z + Math.random() * 200 - 100,
      },
    },
    duration: 3,
    callback: destroyMesh,
  });
}

function destroyMesh(mesh) {
  SceneManager.scene.remove(mesh);
}

function spawnClone(mesh, i) {
  var clone = Game.asteroid.clone()
  clone.name = 'spawning';
  positionCopy(clone, mesh);
  clone.scale.set(multiplyScale(mesh, i), multiplyScale(mesh, i), multiplyScale(mesh, i));
  SceneManager.scene.add(clone);
  return clone;
}

function positionCopy(target, source){
  for(var prop in source.position){
    target.position[prop] = source.position[prop];
  }
}
