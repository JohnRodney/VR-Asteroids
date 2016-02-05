  //trigger boom
  sound = {};
  sound.boomLarge = new Howl({
    urls: ['sounds/bangLarge.wav'],
    loop: false,
    volume: 1
  });
  sound.boomMedium = new Howl({
    urls: ['sounds/bangMedium.wav'],
    loop: false,
    volume: 1
  });
  sound.boomSmall = new Howl({
    urls: ['sounds/bangSmall.wav'],
    loop: false,
    volume: 1
  });
  sound.bgMusic = new Howl({
    urls: ['sounds/bgMusic_dynatron_stars.ogg'],
    loop: true,
    volume: 0.1,
  }).play();
  sound.fadeOut(0.1,0.001,1000);
  //white noise
  //audioContext = new webkitAudioContext();
  //frameCount = audioContext.sampleRate * 2.0;
  //channels = 2
  //myArrayBuffer = audioContext.createBuffer(2, frameCount, audioContext.sampleRate);

  //for (var channel = 0; channel < channels; channel++) {
    //var nowBuffering = myArrayBuffer.getChannelData(channel);
    //for (var i = 0; i < frameCount; i++) {
     //nowBuffering[i] = Math.random() * 2 - 1;
    //}
  //}

  //source = audioContext.createBufferSource();
  //source.buffer = myArrayBuffer;
  //source.connect(audioContext.destination);
  //source.start();
