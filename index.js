import raspi from 'raspi-io';
import five from 'johnny-five';
import oled from 'oled-js';
import font from 'oled-font-5x7';
import bcm from 'node-dht-sensor';
import sensor from 'ds18x20';

// setup board
const board = new five.Board({
  io: new raspi()
});

/**

*/
class Display {

  // TODO move height, width and address of display to config
  constructor(board, five) {
    const hardware = new oled(board, five, {
      width: 128,
      height: 32,
      address: 0x3C
    });

    this._device = hardware;
    this._on = false;

    // clear display on initialization - just in case
    this._device.update();
  }

  // trun display on
  on() {
    this._device.turnOnDisplay();
    this._on = true;
  }

  // turn display off
  off() {
    this._device.turnOffDisplay();
    this._on = false;
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

  // is the display on
  getIsOn() {
    return this._on;
  }
}

/**
  All hub sensors implement - used for logging
*/
class HubSensor {

  constructor() {
  }

  // report data
  report(info) {
    console.log(info);
  }
}

/*

*/
class FlowMeter extends HubSensor {

  constructor(id, fiveSensor, display = null) {
    super();
    this._sensor = fiveSensor;
    this._display = display;

    // total pulses from flow meter
    let pulses = 0;

    // pulses per session - gets reset
    let sessionPulses = 0;

    // state of flow meter
    let isOpen = false;

    // may require calibration
    const pulsesPerLiter = 450;
    const ouncesPerLiter = 33.814;
    const pulsesPerOunce = 13.308;

    this._sensor.on('change', () => {
      pulses++;
      sessionPulses++;
      isOpen = true;

      let currentSession = sessionPulses;
      setTimeout(() => {
        if (currentSession === sessionPulses) {
          const ounces = Math.round((sessionPulses / pulsesPerOunce) * 100) / 100;
          const message = `${id} poured: ${ounces} oz`;
          super.report(message);

          // write to display
          if (this._display && this._display.getIsOn()) {
            this._display.write(message);
            setTimeout(() => {
              this._display.clear();
            }, 500);
          }

          // reset session
          sessionPulses = 0;
          isOpen = false;
        }
      }, 1000);
    });
  }
}

/**
  DS18B20 Temperature Sensor
*/
class Ds18b20 extends HubSensor {

  constructor(id, interval) {
    super();
    this._id = id;
    this._interval = interval;

    // start
    this.probe();
  }

  // read temperatures every interval
  probe() {
    const temperatures = sensor.getAll();
    const temperature = temperatures[this._id];
    super.report(`${this._id}: ${temperature}°C`);

    setTimeout(() => {
      this.probe();
    }, this._interval);
  }
}

/**
  AM2302 Temperature/Humidity Sensor
*/
class Am2302 extends HubSensor {

  constructor(pin, interval) {
    super();
    this._pin = pin;
    this._interval = interval;

    // start
    if (bcm.initialize(22, this._pin)) {
      this.probe();
    }
  }

  // read temperature and humidity at interval
  probe() {
    const reading = bcm.read();
    const temp = reading.temperature.toFixed(2);
    const humidity = reading.humidity.toFixed(2);

    super.report(`${this._pin}: ${temp}°C ${humidity}%`);
    setTimeout(() => {
      this.probe();
    }, this._interval);
  }
}

/**
  Activate sensor to write to display
*/
class DisplayToggle {

  constructor(pin, display) {
    this._toggle = new five.Button(pin);
    this._display = display;

    // reset display
    this._display.clear();
    this._display.off();

    // handle toggle
    this._toggle.on('up', () => {
      if (this._display.getIsOn()) {
        // turn off display
        // TODO randomize
        this._display.write('goodbye');
        setTimeout(() => {
          this._display.clear();
          this._display.off();
        }, 1000);
      } else {
        // turn on display
        this._display.on();

        // TODO randomize
        this._display.write('greetings');
        setTimeout(() => {
          this._display.clear();
        }, 1000);
      }
    });
  }
}

// setup hub
board.on('ready', function() {
  // initialize display
  const display = new Display(board, five);

  // setup flow meter(s)
  // TODO dynamic from configuration?
  const flowMeters = [{
    id: 1,
    pin: 'P1-22'
  }, {
    id: 2,
    pin: 'P1-18'
  }, {
    id: 3,
    pin: 'P1-38'
  }];

  flowMeters.forEach((fm) => {
    const f = new five.Sensor.Digital(fm.pin);
    const flow = new FlowMeter(fm.id, f, display);
  });

  // upper temperature sensor
  const upper = new Am2302(26, 5000);

  // lower temperature sensor
  const lower = new Ds18b20('28-000007c6390c', 5000);

  // setup display toggle
  const toggle = new DisplayToggle('P1-36', display);

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
