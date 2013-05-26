$(function(){
  var  controllerPrototype = $("#controller-prototype");
  var controllerContainer = controllerPrototype.parent();
  controllerPrototype.remove();
  console.log("started");


  var emuCanvas = document.getElementById("emu-canvas");
  console.log(emuCanvas, emuCanvas.getContext);
  var ctx=emuCanvas.getContext("2d");


  var audioContext;
  if (typeof AudioContext !== "undefined") {
    audioContext = new AudioContext();
  } else if (typeof webkitAudioContext !== "undefined") {
    audioContext = new webkitAudioContext();
  } else {
    throw new Error('AudioContext not supported. :(');
  }


  var lastAudioTimeFinish =0;
  var engine = new TestBox360Engine({
    onVideoFrame: function(buffer) {
      ctx.putImageData(buffer, 0,0);
    },
    onAudioSamples: function(channel, samples) {
        // creates a sound source
        var source = audioContext.createBufferSource();
        var buffer = audioContext.createBuffer(1,samples.length,engine.audioSampleRate());
        var buf = buffer.getChannelData(0)
        for (i = 0; i < samples.length; i++) {
          buf[i] = samples[i];
        }

        // tell the source which sound to play
        source.buffer = buffer;          

        // connect the source to the context's destination (the speakers)           
        source.connect(audioContext.destination);       
        
        // play the source now
        source.noteOn(lastAudioTimeFinish);  
        lastAudioTimeFinish = lastAudioTimeFinish + buffer.duration ;                        
    }
  });
  engine.reset();
  emuCanvas.width = engine.screenWidth();
  emuCanvas.height = engine.screenHeight();


  var controllerUIRepresentation = function (engine) {
    var buttonNames = engine.buttonNames();
    var axisNames = engine.axisNames();

    var buttons = {
      buttons: buttonNames.filter(function(buttonName){ return buttonName.match(/^Button(.*)/);}),
      shiftButtons: buttonNames.filter(function(buttonName){ return buttonName.match(/^ShiftButton(.*)/);}),
      controlButtons: buttonNames.filter(function(buttonName){ return buttonName.match(/^ControlButton(.*)/);}),

    }
    var dpadButtons = buttonNames.filter(function(buttonName){ return buttonName.match(/^DPad(.*)/);});
    var dpads = {};
    $.each(dpadButtons, function(i, dpadButtonName) {
      var match = dpadButtonName.match(/^DPad(\d+)(Up|Down|Left|Right)/);
      var dpadNum = match[1];
      var dpadDir = match[2].toLowerCase();
      if (!dpads[dpadNum])
        dpads[dpadNum] = {}
      dpads[dpadNum][dpadDir] = dpadButtonName;
    });

    var joysticks = {};
    $.each(axisNames, function(i, axisName){
      var match = axisName.match(/^Axis(.+)(X|Y)$/);
      var joyName = match[1];
      var axis = match[2];
      if (!joysticks[joyName])
        joysticks[joyName] = {};
      joysticks[joyName][axis] = axisName;
    });


    return {
      buttons:buttons,
      joysticks:joysticks,
      dpads:dpads
    };
  }

  var bindButtonToEngine = function(buttonElement, player, buttonName) {
    buttonElement.mousedown(function() {
      engine.buttonStateChanged(player, buttonName, 1);
    });
    buttonElement.mouseup(function() {
      engine.buttonStateChanged(player, buttonName, 0);
    });
  }


  var createControllerForPlayer = function(player) {
    var controller = controllerPrototype.clone();
    controller.find(".controller-header-player-name").text("Player #"+(player+1));
    controllerContainer.append(controller);
    var controls = controllerUIRepresentation(engine);
    var buttonPrototype = controller.find("#controller-button-prototype");
    var buttonContainer = buttonPrototype.parent();
    buttonPrototype.remove();
    var dpadPrototype = controller.find("#controller-dpad-prototype");
    var dpadContainer = dpadPrototype.parent();    
    dpadPrototype.remove();
    var joyPrototype = controller.find("#controller-joystick-prototype");
    var joyContainer = joyPrototype.parent();
    joyPrototype.remove();

    controller.find(".controller-header-close-button").mousedown(function(){
      engine.controllerDisconnected(player);
      controller.remove();
    });

    $.each(controls.buttons, function(buttonType, buttons){
      $.each(buttons, function(i, buttonName){
          var button = buttonPrototype.clone();
          var buttonText = buttonName.match(/^(Button|ShiftButton|ControlButton)(.*)/)[2];
          button.find("button").text(buttonText);
          buttonContainer.append(button);

          bindButtonToEngine(button, player, buttonName);

      })
    });

    $.each(controls.dpads, function(i, dPadDesc){
      var dpad = dpadPrototype.clone();
      dpadContainer.append(dpad);
      $.each(dPadDesc, function(dpadDirection, dpadButtonName){
        console.error(dpadDirection, dpadButtonName);
        var dpadButton = dpad.find(".controller-dpad-button-"+dpadDirection);
        bindButtonToEngine(dpadButton, player, dpadButtonName);
 
      })
    });

    $.each(controls.joysticks, function(i, joystickDesc){
      var joystick = joyPrototype.clone();
      joyContainer.append(joystick);
      var joyInner = joystick.find(".controller-joystick-inner");
      var maxX=60, maxY=60, axisXBounds=[-255, 255], axisYBounds=[-255, 255];
      joyInner.draggable({ containment: "parent" ,cursor: "crosshair", drag: function( event, ui ) {
          var axisX =  (ui.position.left/maxX) * ((Math.abs(axisXBounds[0]) + Math.abs(axisXBounds[1]))) + axisXBounds[0]
          var axisY =  (ui.position.top/maxY) * ((Math.abs(axisYBounds[0]) + Math.abs(axisYBounds[1]))) + axisYBounds[0]
          engine.axisStateChanged(player, joystickDesc.X, axisX);
          engine.axisStateChanged(player, joystickDesc.Y, axisY);
      }} );
    });






    
  }





  var lastPlayer = 0;
  var addController = function(){
    if (lastPlayer<engine.maxNumberOfControllers()){
      createControllerForPlayer(lastPlayer);

      engine.controllerConnected(lastPlayer);
      lastPlayer ++;
    }
  };
  addController();
  $("#button-add-controller").mousedown(addController);

  $("#button-pause").mousedown(function(){
    engine.stop();
  });
  $("#button-play").mousedown(function(){
    engine.start();
  });
  $("#button-reset").mousedown(function(){
    engine.reset();
  });


  var savedGameState = null;
  $("#button-save").mousedown(function(){
    savedGameState = engine.saveState();
  });
  $("#button-load").mousedown(function(){
    if (savedGameState)
      engine.loadState(savedGameState);
  });

  function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0]
    var reader = new FileReader();
    reader.onloadend = function(loadEvt) {
      var romArray = loadEvt.target.result;
      engine.loadRom(romArray);
    };

    reader.readAsArrayBuffer(file);

    
  }

  document.getElementById('file-rom').addEventListener('change', handleFileSelect, false);




});