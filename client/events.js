Utils.events({
  'lookAt .asteroid': function(mesh) {
    SceneManager.scene.remove(mesh);
    explosion(mesh);
    setAndDisplayScore(mesh);
    boomL = new THREE.Audio( SceneManager.listener );
    boomL.load( 'sounds/bangLarge.wav' );
    boomL.setRefDistance(200);
    boomL.autoplay = true;
    mesh.add(boomL);
    Game.comboTimer = Date.now();
    Game.playerScore += 10;
  },

  'lookAt .miniasteroid': function(mesh) {
    var position = mesh.position;
    SceneManager.scene.remove(mesh);
    explosion(mesh);
    setAndDisplayScore(mesh);
    boomM = new THREE.Audio( SceneManager.listener );
    boomM.load( 'sounds/bangMedium.wav' );
    boomM.setRefDistance(200);
    boomM.autoplay = true;

    boomS = new THREE.Audio( SceneManager.listener );
    boomS.load( 'sounds/bangSmall.wav' );
    boomS.setRefDistance(200);
    boomS.autoplay = true;
    if(Math.random()<.5) {
      mesh.add(boomM);
    } else {
      mesh.add(boomS);
    }
    Game.comboTimer = Date.now();
    Game.playerScore += 10;
  },
  'lookAt .start': function(mesh) {
    Game.startCountDown(mesh);
    Game.changeOpacity(Game.startSphere);
    Game.newGame();
  },
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
      clone.name = 'miniasteroid';
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

function setAndDisplayScore(mesh) {
  var position = mesh.position;
  var baseScore = Math.floor(checkScale(mesh));
  var multiplier = determineMultiplier();
  var scoreMessage = baseScore;
  var score = baseScore;

  if (multiplier) {
    scoreMessage = baseScore + ' X ' + multiplier;
    score = baseScore * multiplier;
  }

  Game.playerScore += score;

  var textShapes = THREE.FontUtils.generateShapes( scoreMessage, {'font' : 'helvetiker', 'weight' : 'normal', 'style' : 'normal', 'size' : 6, 'curveSegments' : 300} );
  var text = new THREE.ShapeGeometry( textShapes );
  var textMesh = new THREE.Mesh( text, new THREE.MeshBasicMaterial( { color: 0xff0000, transparent: true } ) ) ;

  textMesh.position.z = position.z;
  textMesh.position.x = position.x;
  textMesh.position.y = position.y;
  textMesh.lookAt( SceneManager.camera.position );

  SceneManager.scene.add(textMesh);
  fadeScore(textMesh);
}

function checkScale(Mesh) {
  return 10/Mesh.scale.x;
}

function determineMultiplier() {
  if (!Game.lastDestroyedTime) {
    Game.lastDestroyedTime = Date.now();

    return false;
  } else {
    var diffTime = (Date.now() - Game.lastDestroyedTime)/1000;

    if (diffTime > 1) {
      return 2;
    }

    if (diffTime > 0.5) {
      return 3;
    }

    return false;
  }
}

function fadeScore(textMesh) {
  Utils.transition({
    mesh: textMesh,
    type: 'fade-out',
    duration: 1,
    callback: function(textMesh){
      destroyMesh(textMesh);
    }
  });
}
