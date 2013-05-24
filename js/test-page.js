$(function(){
  var  controllerPrototype = $("#controller-prototype");
  var controllerContainer = controllerPrototype.parent();
  controllerPrototype.remove();
  console.log("started");

  var engine = new TestBox360Engine();
  // engine.reset();


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
      var dpadDir = match[2];
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

  var createControllerForPlayer = function(player) {
    var controller = controllerPrototype.clone();
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
    $.each(controls.buttons, function(i, buttonName){
      var button = buttonPrototype.clone();
      buttonContainer.append(button);
    });

    $.each(controls.dpads, function(i, dPadDesc){
      var dpad = dpadPrototype.clone();
      dpadContainer.append(dpad);
    });

    $.each(controls.joysticks, function(i, joystickDesc){
      var joystick = joyPrototype.clone();
      joyContainer.append(joystick);
    });






    
  }


  for(var i = 0; i < engine.maxNumberOfControllers(); i++) {
    console.log("creating Controller");
    createControllerForPlayer(i);
  };

});