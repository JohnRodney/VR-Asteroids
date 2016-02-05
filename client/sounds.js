  //trigger boom
  sound = {};
  sound.boom = new Howl({
    urls: ['boom.mp3'],
    loop: false,
    volume: 1
  });
  sound.bgMusic = new Howl({
    urls: ['bgMusic_dynatron_stars.ogg'],
    loop: true,
    volume: 0.5
  });
  sound.bgMusic.play()

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
