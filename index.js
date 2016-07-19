var raspi = require('raspi-io');
var five = require('johnny-five');
var oled = require('oled-js');
var font = require('oled-font-5x7');
var board = new five.Board({
  io: new raspi()
});

// setup display facade
var Display = function(device) {
  this._device = device;
}

Display.prototype = {
  // turn display on
  on: function() {
    this._device.turnOnDisplay();
  },

  // turn display off
  off: function() {
    this._device.turnOffDisplay();
  },

  // clear display
  clear: function() {
    this._device.clearDisplay();
  },

  // write string to screen
  write: function(text) {
    this.clear();
    this._device.setCursor(1, 1);
    this._device.writeString(font, 1, text, 1, true, 2);
  }
}

// setup flow meter facade
var FlowMeter = function(device, display) {
  this._device = device;
  this._display = display;

  // total pulses from flow meter
  var pulses = 0;

  // pulses per session - gets reset
  var sessionPulses = 0;

  // state of flow meter
  var isOpen = false;

  // how many pulses occur before 1L of liquid
  var pulsesPerLiter = 450;

  // ounces in a Liter
  var ouncesPerLiter = 33.814;

  // pules per ounce
  var pulsesPerOunce = 13.308;

  this._device.on('change', function() {
    pulses++;
    sessionPulses++;
    isOpen = true;

    var currentSession = sessionPulses;
    setTimeout(function() {
      if (currentSession === sessionPulses) {
        var ounces = Math.round((sessionPulses / pulsesPerOunce) * 100) / 100;
        display.write('poured: ' + ounces + 'oz');

        // reset
        sessionPulses = 0;
        isOpen = false;
        setTimeout(function() {
          display.clear();
        }, 500);
      }
    }, 1000);
  });
}

// setup board
board.on('ready', function() {
  // initialize display
  var displayDevice = new oled(board, five, {
    width: 128,
    height: 32,
    address: 0x3C
  });

  var display = new Display(displayDevice);

  // clear display just in case
  display._device.update();

  // setup flow meter
  // TODO dynamic from configuration?
  var f = new five.Sensor.Digital('P1-22');
  var meter = new FlowMeter(f, display);

  // setup toggle
  var currentState = 0;
  var states = ['off', 'temp', 'flow'];

  var toggle = new five.Button('P1-36');
  toggle.on('up', function() {
    var next = currentState + 1;
    if (next >= states.length) {
      next = 0;
    }

    currentState = next;
    var state = states[next];
    if (state === 'off') {
      display.clear();
      display.off();
    } else if (state === 'temp') {
      display.on();
      display.write('temp');
    } else if (state === 'flow') {
      display.on();
      display.write('flow');
    }
  });

  // on shutdown
  this.on('exit', function() {
    display.off();
  });

  // helpers to add to REPL
  this.repl.inject({
    display: display
  });
});
