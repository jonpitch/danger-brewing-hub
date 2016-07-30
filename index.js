import raspi from 'raspi-io';
import five from 'johnny-five';
import oled from 'oled-js';
import font from 'oled-font-5x7';

// setup board
const board = new five.Board({
  io: new raspi()
});

//
/**

*/
class Display {

  // TODO move height, width and address of display to config
  // TODO make display hardware optional.
  //  if someone wants to build the hub without display, fallback to console
  constructor(board, five) {
    const hardware = new oled(board, five, {
      width: 128,
      height: 32,
      address: 0x3C
    });

    this._device = hardware;

    // setup toggle
    this._currentState = 0;
    this._states = [
      'off',
      'flow',
      'temp-lower',
      'temp-upper'
    ];

    // TODO pin is configurable
    const toggle = new five.Button('P1-36');
    toggle.on('up', () => {
      let next = this._currentState + 1;
      if (next >= this._states.length) {
        next = 0;
      }

      if (next === 0) {
        // display is off
        this.clear();
        this.off();

      } else if (next === 1) {
        // display set to flow meters
        this.on();
        this.write('temp');

      } else if (next === 2) {
        // display set to lower temperature
        this.write('lower');

      } else if (next === 3) {
        // display set to upper temperature
        this.write('upper');

      }

      this._currentState = next;
    });

    // clear display on initialization - just in case
    this._device.update();
  }

  // trun display on
  on() {
    this._device.turnOnDisplay();
  }

  // turn display off
  off() {
    this._device.turnOffDisplay();
  }

  // clear display
  clear() {
    this._device.clearDisplay();
  }

  // write string to screen
  write(text) {
    this.clear();
    this._device.setCursor(1, 1);
    this._device.writeString(font, 1, text, 1, true, 2);
  }

}

/*

*/
class FlowMeter {

  constructor(device, display) {
    this._device = device;
    this._display = display;

    // total pulses from flow meter
    var pulses = 0;

    // pulses per session - gets reset
    var sessionPulses = 0;

    // state of flow meter
    var isOpen = false;

    // may require calibration
    const pulsesPerLiter = 450;
    const ouncesPerLiter = 33.814;
    const pulsesPerOunce = 13.308;

    this._device.on('change', () => {
      pulses++;
      sessionPulses++;
      isOpen = true;

      let currentSession = sessionPulses;
      setTimeout(() => {
        if (currentSession === sessionPulses) {
          const ounces = Math.round((sessionPulses / pulsesPerOunce) * 100) / 100;
          this._display.write(`poured: ${ounces} oz`);

          // reset
          sessionPulses = 0;
          isOpen = false;
          setTimeout(() => {
            this._display.clear();
          }, 500);
        }
      }, 1000);
    });
  }
}

// setup hub
board.on('ready', function() {
  // initialize display
  const display = new Display(board, five);

  // setup flow meter
  // TODO dynamic from configuration?
  const f = new five.Sensor.Digital('P1-22');
  const meter = new FlowMeter(f, display);

  // on shutdown
  // TODO notify web app event occurred
  this.on('exit', function() {
    display.off();
  });

  // helpers to add to REPL
  this.repl.inject({
    display: display
  });
});
