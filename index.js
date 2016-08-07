import raspi from 'raspi-io';
import five from 'johnny-five';
import oled from 'oled-js';
import font from 'oled-font-5x7';
import bcm from 'node-dht-sensor';
import sensor from 'ds18x20';
import config from 'config';
import firebase from 'firebase';

// setup board
const board = new five.Board({
  io: new raspi()
});

/**

*/
class Display {

  // setup oled display if available - fallback to console
  constructor(board, five) {
    let hardware = null;
    if (config.get('hardware.display.oled')) {
      let address = config.get('hardware.display.oled.address');
      hardware = new oled(board, five, {
        width: config.get('hardware.display.oled.w'),
        height: config.get('hardware.display.oled.h'),
        address: parseInt(address, 16)
      });

      this._device = hardware;

      // clear display on initialization - just in case
      this._device.update();
    } else {
      console.log('no oled device found, skipping');
    }

    this._on = false;
  }

  // trun display on
  on() {
    this._on = true;
    if (this._device) {
      this._device.turnOnDisplay();
    }
  }

  // turn display off
  off() {
    this._on = false;
    if (this._device) {
      this._device.turnOffDisplay();
    }
  }

  // clear display
  clear() {
    if (this._device) {
      this._device.clearDisplay();
    }
  }

  // write string to screen
  write(text) {
    this.clear();
    if (this._device) {
      this._device.setCursor(1, 1);
      this._device.writeString(font, 1, text, 1, true, 2);
    } else {
      console.log(text);
    }
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

    // report to firebase
    // TODO remove hub id - add sensors as relationship
    const hubId = config.get('hub.id');
    firebase.database().ref(`hubs/${hubId}/lowerTemp`).set(temperature);

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

    // report to firebase
    // TODO remove hub id - add sensors as relationship
    const hubId = config.get('hub.id');
    firebase.database().ref(`hubs/${hubId}/upperTemp`).set(temp);
    firebase.database().ref(`hubs/${hubId}/humidity`).set(humidity);

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

  let hubId;
  if (config.has('hub.id')) {
    hubId = config.get('hub.id');

    // setup firebase
    let fb;
    if (config.has('firebase') && hubId) {
      const firebaseConfig = config.get('firebase');
      firebase.initializeApp({
        apiKey: firebaseConfig.get('apiKey'),
        authDomain: firebaseConfig.get('authDomain'),
        databaseURL: firebaseConfig.get('databaseURL'),
        storageBucket: firebaseConfig.get('storageBucket'),
        serviceAccount: firebaseConfig.get('serviceAccountPath')
      });

      // notify web that hub is online
      firebase.database().ref(`hubs/${hubId}/status`).set('online');

      // setup flow meter(s)
      const taps = config.get('hub.taps');
      taps.forEach((tap) => {
        const f = new five.Sensor.Digital(tap.pin);
        const flow = new FlowMeter(tap.id, f, display);
      });

      if (taps.length === 0) {
        console.error('no taps found, skipping');
      }

      // upper temperature sensor
      if (config.has('hardware.temperature.am2302')) {
        const am2302 = config.get('hardware.temperature.am2302');
        const upper = new Am2302(am2302.pin, am2302.polling);
      } else {
        console.info('no am2302 sensor found, skipping');
      }

      // lower temperature sensor
      if (config.has('hardware.temperature.ds18b20')) {
        const ds18b20 = config.get('hardware.temperature.ds18b20');
        const lower = new Ds18b20(ds18b20.address, ds18b20.polling);
      } else {
        console.info('no ds18b20 sensor found, skipping');
      }

      // setup display toggle
      if (config.has('hardware.display.toggle')) {
        const toggle = config.get('hardware.display.toggle');
        const displayToggle = new DisplayToggle(toggle, display);
      } else {
        console.log('no display toggle found, skipping');
      }
    } else {
      console.error('no firebase config found');
    }

  } else {
    console.error('no hub id found');
  }

  // on shutdown
  this.on('exit', function() {
    // notify application
    firebase.database().ref(`hubs/${hubId}/status`).set('offline');

    // turn off display hardware
    display.off();
  });

  // helpers to add to REPL
  this.repl.inject({
    display: display
  });
});
