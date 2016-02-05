audioContext = new window.AudioContext();
frameCount = audioContext.sampleRate * 2.0;
channels = 2
myArrayBuffer = audioContext.createBuffer(2, frameCount, audioContext.sampleRate);

  for (var channel = 0; channel < channels; channel++) {
    var nowBuffering = myArrayBuffer.getChannelData(channel);
    for (var i = 0; i < frameCount; i++) {
     nowBuffering[i] = Math.random() * 2 - 1;
    }
  }

source = audioContext.createBufferSource();
source.buffer = myArrayBuffer;
source.connect(audioContext.destination);
source.start();

//var mainVolume = audioContext.createGain();
//mainVolume.connect(audioContext.destination);

//var sound = {};
//var boomBuffer = null;

//function playSound(buff) {
//   var source = audioContext.createBufferSource();
//   source.buffer = buff;
//   source.connect(audioContext.destination);
//   source.start(0);
//}

//playSound(boomBuffer);

//sound.source = audioContext.createBufferSource();
//sound.volume = audioContext.createGain();

//var analyser = audioContext.createAnalyser();
//var sourceNode = audioContext.createBufferSource();



//sound = {}
sound.roar = new Howl({
    urls: ['blast.wav'],
    loop: true,
    volume: 0.2
});

sound.background = new Howl({
  urls: ['innocent.mp3'],
  loop: true
});

