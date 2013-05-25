
// ## Initialisation
// ### Constructor options
//   * `onAudioSamples`: function(samples)
//   * `onVideoFrame`: function(buffer)
//   * `onFps`: function(fps)
//   * `canvas`: optional, not recommended - Canvas object


EmuEngine = function(opts) {

};


// ## Getting console system constants
// ### buttonNames()
EmuEngine.prototype.buttonNames = function() {
  throw "You must implement this function!";
}
// ### axisNames()
EmuEngine.prototype.axisNames = function() {
  throw "You must implement this function!";
}
// ### screenWidth()
EmuEngine.prototype.screenWidth = function() {
  throw "You must implement this function!";
}
// ### screenHeight()
EmuEngine.prototype.screenHeight = function() {
  throw "You must implement this function!";
}
// ### maxNumberOfControllers()
EmuEngine.prototype.maxNumberOfControllers = function() {
  throw "You must implement this function!";
}


// ### audioChannelCount()
EmuEngine.prototype.audioChannelCount = function() {
  throw "You must implement this function!";
}

// ### audioSampleRate()
EmuEngine.prototype.audioSampleRate = function() {
  throw "You must implement this function!";
}


// ## State management
// ### loadRom(rom)
EmuEngine.prototype.loadRom = function(rom) {
  throw "You must implement this function!";
}
// ### stop()
EmuEngine.prototype.stop = function() {
  throw "You must implement this function!";
}
// ### start()
EmuEngine.prototype.start = function() {
  throw "You must implement this function!";
}
// ### reset()
EmuEngine.prototype.reset = function() {
  throw "You must implement this function!";
}
// ### isRunning()
EmuEngine.prototype.isRunning = function() {
  throw "You must implement this function!";
}
// ### saveState()
// returns state
EmuEngine.prototype.saveState = function() {
  throw "You must implement this function!";
}

// ### loadState(state)
EmuEngine.prototype.loadState = function(state) {
  throw "You must implement this function!";
}

// ## Controls

// ### buttonStateChanged(player, buttonName, buttonState)
EmuEngine.prototype.buttonStateChanged = function(player, buttonName, buttonState) {
  console.log([" - USER: ",player, "       BUTTON: ", buttonName, "   STATE: ", buttonState].join(""));
}
// ### axisStateChanged(player, axisName, axisPosition)
EmuEngine.prototype.axisStateChanged = function(player, axisName, axisPosition) {
  console.log([" - USER: ",player, "       AXIS: ", axisName, "   POSITION: ", axisPosition].join(""));
}
// ### controllerConnected(player)
EmuEngine.prototype.controllerConnected = function(player) {
  console.log(["Controller connected for user #",player].join(""));
}
// ### controllerDisconnected(player)
EmuEngine.prototype.controllerDisconnected = function(player) {
  console.log(["Controller disconnected for user #",player].join(""));
}



var TEST_BOX_360_SCREEN_WIDTH = 700;
var TEST_BOX_360_SCREEN_HEIGHT = 700;
var TEST_BOX_360_TICKS_PER_SECOND = 25;
var TEST_BOX_360_AUDIO_SAMPLE_RATE = 22050;

var ProcessingSketch = (function($p) {

 var baseX1 = 0,baseY1 = 0,baseX2 = 0,baseY2 = 0;

var baseLength = 0;

var xCoords = null,yCoords = null;

var ellipseX = 0,ellipseY = 0,ellipseRadius =  6;

var directionX = 0,directionY = 0;

var ellipseSpeed =  3.5;

var velocityX = 0,velocityY = 0;

function setup() {
$p.size(TEST_BOX_360_SCREEN_WIDTH, TEST_BOX_360_SCREEN_HEIGHT);

  $p.frameRate(30);

  $p.fill(128);

  $p.smooth();

  baseX1 = 0;

  baseY1 = $p.height-150;

  baseX2 = $p.width;

  baseY2 = $p.height;

  ellipseX = $p.width/2;

  directionX = $p.random(0.1, 0.99);

  directionY = $p.random(0.1, 0.99);

  var directionVectLength =  $p.sqrt(directionX*directionX +

            directionY*directionY);

  directionX /= directionVectLength;

  directionY /= directionVectLength;
}
$p.setup = setup;

function draw() {
$p.fill(0, 12);

  $p.noStroke();

  $p.rect(0, 0, $p.width, $p.height);

  baseLength = $p.dist(baseX1, baseY1, baseX2, baseY2);

  xCoords = $p.createJavaArray('float', [$p.ceil(baseLength)]);

  yCoords = $p.createJavaArray('float', [$p.ceil(baseLength)]);

  for (var i = 0;  i<xCoords.length;  i++){
xCoords[i] = baseX1 + ((baseX2-baseX1)/baseLength)*i;

    yCoords[i] = baseY1 + ((baseY2-baseY1)/baseLength)*i;
}

  $p.fill(200);

  $p.quad(baseX1, baseY1, baseX2, baseY2, baseX2, $p.height, 0, $p.height);

  var baseDeltaX =  (baseX2-baseX1)/baseLength;

  var baseDeltaY =  (baseY2-baseY1)/baseLength;

  var normalX =  -baseDeltaY;

  var normalY =  baseDeltaX;

  $p.noFill();

  $p.stroke(200);

  $p.ellipse(ellipseX, ellipseY, ellipseRadius*2, ellipseRadius*2);

  velocityX = directionX * ellipseSpeed;

  velocityY = directionY * ellipseSpeed;

  ellipseX += velocityX;

  ellipseY += velocityY;

  var incidenceVectorX =  -directionX;

  var incidenceVectorY =  -directionY;

  for (var i = 0;  i<xCoords.length;  i++){
if ($p.dist(ellipseX, ellipseY, xCoords[i], yCoords[i]) < ellipseRadius){
var dot =  incidenceVectorX*normalX + incidenceVectorY*normalY;

      var reflectionVectorX =  2*normalX*dot - incidenceVectorX;

      var reflectionVectorY =  2*normalY*dot - incidenceVectorY;

      directionX = reflectionVectorX;

      directionY = reflectionVectorY;

      $p.stroke(255, 128, 0);

      $p.line(ellipseX, ellipseY, ellipseX-normalX*100,

            ellipseY-normalY*100);
}
}

  if (ellipseX > $p.width-ellipseRadius){
ellipseX = $p.width-ellipseRadius;

    directionX *= -1;
}

  if (ellipseX < ellipseRadius){
ellipseX = ellipseRadius;

    directionX *= -1;
}

  if (ellipseY < ellipseRadius){
ellipseY = ellipseRadius;

    directionY *= -1;

    baseY1 = $p.random($p.height-100, $p.height);

    baseY2 = $p.random($p.height-100, $p.height);
}
}
$p.draw = draw;
})



function makeSampleFunction() {
    var oneLiner = "t * ((t>>12|t>>8)&63&t>>4);";
    
    var oneLiner = oneLiner.replace(/sin/g, "Math.sin");
    var oneLiner = oneLiner.replace(/cos/g, "Math.cos");
    var oneLiner = oneLiner.replace(/tan/g, "Math.tan");
    var oneLiner = oneLiner.replace(/floor/g, "Math.floor");
    var oneLiner = oneLiner.replace(/ceil/g, "Math.ceil");
    
    if (window.console) {
  console.log(oneLiner);
    }

    eval("var f = function (t) { return " + oneLiner + "}");
    return f;
}

function generateSound() {
    var frequency = TEST_BOX_360_AUDIO_SAMPLE_RATE;
    var seconds = 30;

    var sampleArray = [];
    var f = makeSampleFunction();
    
    for (var t = 0; t < frequency*seconds; t++) {
        // Between 0 - 65535
//        var sample = Math.floor(Math.random()*65535);
        
        var sample = (f(t)) & 0xff;
        sample *= 256;
        if (sample < 0) sample = 0;
        if (sample > 65535) sample = 65535;
        
        sampleArray.push(sample);
    }
    return [frequency, sampleArray];
}



// # TestBox360 simulator
TestBox360Engine = function (opts) {
  this._running = false;
  this._memory = "clean";
  this._numberOfConnectedControllers = 0;
  this._controlState = {};
  this._canvas = document.createElement("canvas");
  this._ctx = this._canvas.getContext("2d");
  this._p = null;
  this.opts = opts;
  this._initControlStates();
  this._initScreen();
  this._initMusic();

}
TestBox360Engine.prototype = new EmuEngine();

TestBox360Engine.prototype._initControlStates = function() {
  for (var i=0; i<this.maxNumberOfControllers(); i++) {
    this._controlState[i] = {};
  }
}
TestBox360Engine.prototype._initScreen = function() {
  if (this._p)
    this._p.exit();
  this._p = new Processing(this._canvas, ProcessingSketch);

}

TestBox360Engine.prototype._initMusic = function() {
  var gen = generateSound()
  this._musicSampleArray = gen[1];
  this._musicSampleIndex = 0;
  this._tickToMusicSample =0;

}

TestBox360Engine.prototype._nextMusicSample = function(sampleCount) {
  if ((this._musicSampleIndex+sampleCount)>=this._musicSampleArray.length)
    this._musicSampleIndex=0;
  result = this._musicSampleArray.slice(this._musicSampleIndex, this._musicSampleIndex+sampleCount);
  this._musicSampleIndex +=sampleCount;
  return result;
}




TestBox360Engine.prototype._tick = function() {

  //randomize memory
  if (Math.random()<0.7) {
      var index = Math.floor((Math.random()*this._memory.length));
      var charAdd = Math.random()>0.5? +1: -1;
      var newChar = String.fromCharCode(this._memory[index].charCodeAt() + charAdd);
    
      this._memory = this._memory.substr(0, index) + newChar + this._memory.substr(index+newChar.length);
  }

  //get button state


  //draw picture



  this.opts.onVideoFrame(this._canvas.getContext("2d").getImageData(0,0, this._canvas.width, this._canvas.width));
  if (this._tickToMusicSample>=TEST_BOX_360_TICKS_PER_SECOND-10) {
      this._tickToMusicSample =0;

    this.opts.onAudioSamples(0, this._nextMusicSample(TEST_BOX_360_AUDIO_SAMPLE_RATE));

  } else {
    this._tickToMusicSample ++;
  }
  if (this._running)
    setTimeout(this._tick.bind(this), 1000.0/TEST_BOX_360_TICKS_PER_SECOND);
}




TestBox360Engine.prototype.buttonNames = function() {
  return [
    "DPad1Up",
    "DPad1Down",
    "DPad1Left",
    "DPad1Right",
    "ButtonA",
    "ButtonB",
    "ButtonC",
    "ShiftButtonLeft1",
    "ShiftButtonLeft2",
    "ShiftButtonRight1",
    "ShiftButtonRight2",
    "ControlButtonSelect",
    "ControlButtonStart",

  ];
}
TestBox360Engine.prototype.axisNames = function() {
  return [
    "AxisLeftJoyX",
    "AxisLeftJoyY",
    "AxisRightJoyX",
    "AxisRightJoyY",
  ]
}
TestBox360Engine.prototype.screenWidth = function() {
  return TEST_BOX_360_SCREEN_WIDTH;
}
TestBox360Engine.prototype.screenHeight = function() {
  return TEST_BOX_360_SCREEN_HEIGHT;
}
TestBox360Engine.prototype.maxNumberOfControllers = function() {
  return 4;
}


TestBox360Engine.prototype.loadRom = function(rom) {
  this._memory = rom;
}
TestBox360Engine.prototype.stop = function() {
  this._running = false;
  this._p.noLoop();
}
TestBox360Engine.prototype.start = function() {
  this._running = true;
  this._p.loop();

  this._tick();
}
TestBox360Engine.prototype.reset = function() {
  this._memory = "clean";
  this._numberOfConnectedControllers = 0;
  this._controlState = {};
  this._initControlStates();
  this._initScreen();
  this._initMusic();
  this.start();
}
TestBox360Engine.prototype.isRunning = function() {
  return this._running;
}

TestBox360Engine.prototype.saveState = function() {
  return this._memory;
}

TestBox360Engine.prototype.loadState = function(state) {
  this._memory = state;
}

TestBox360Engine.prototype.buttonStateChanged = function(player, buttonName, buttonState) {
  
  this._controlState[player][buttonName] = buttonState;
  console.log([" - USER: ",player, "       BUTTON: ", buttonName, "   STATE: ", buttonState].join(""));
}
TestBox360Engine.prototype.axisStateChanged = function(player, axisName, axisPosition) {
  this._controlState[player][axisName] = axisPosition;
  console.log([" - USER: ",player, "       AXIS: ", axisName, "   POSITION: ", axisPosition].join(""));
}
TestBox360Engine.prototype.controllerConnected = function(player) {
  this._numberOfConnectedControllers ++;
  this._controlState[player] = {};
  console.log(["Controller connected for user #",player].join(""));
}
TestBox360Engine.prototype.controllerDisconnected = function(player) {
  this._numberOfConnectedControllers --;
  delete this._controlState[player];
  console.log(["Controller disconnected for user #",player].join(""));
}

TestBox360Engine.prototype.audioSampleRate = function() {
  return TEST_BOX_360_AUDIO_SAMPLE_RATE;
}

TestBox360Engine.prototype.audioChannelCount = function() {
  return 1;
}
