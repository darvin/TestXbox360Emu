
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





// # TestBox360 simulator
TestBox360Engine = function (opts) {
  this._running = false;
  this._memory = "clean";
  this._numberOfConnectedControllers = 0;
  this._controlState = {};
}
TestBox360Engine.prototype = new EmuEngine();

TestBox360Engine.prototype._initControlStates = function() {

}

TestBox360Engine.prototype._tick = function() {
  console.log(this);

  console.log("Tick");

  //randomize memory
  if (Math.random()<0.7) {
      var index = Math.floor((Math.random()*this._memory.length));
      var charAdd = Math.random()>0.5? +1: -1;
      var newChar = String.fromCharCode(this._memory[index].charCodeAt() + charAdd);
    
      this._memory = this._memory.substr(0, index) + newChar + this._memory.substr(index+newChar.length);
  }
  console.log("RAM: " + this._memory);

  //get button state


  //draw picture


  setTimeout(this._tick.bind(this), 1000);
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
    "ButtonShiftLeft1",
    "ButtonShiftLeft2",
    "ButtonShiftRight1",
    "ButtonShiftRight2",
    "ButtonContolSelect",
    "ButtonContolStart",

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
  return 1024;
}
TestBox360Engine.prototype.screenHeight = function() {
  return 768;
}
TestBox360Engine.prototype.maxNumberOfControllers = function() {
  return 4;
}


TestBox360Engine.prototype.loadRom = function(rom) {
  this._memory = rom;
}
TestBox360Engine.prototype.stop = function() {
  this._running = false;
}
TestBox360Engine.prototype.start = function() {
  this._running = true;
  console.log(this);

  this._tick();
}
TestBox360Engine.prototype.reset = function() {
  this._memory = "clean";
  this._numberOfConnectedControllers = 0;
  this._controlState = {};
  this._initControlStates();
  console.log(this);
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
