import raspi from 'raspi-io';
import five from 'johnny-five';
import config from 'config';
import firebase from 'firebase';

// supported displays
import Ssd1306 from 'display/ssd1306';
import DisplayToggle from 'display/display-toggle';

// supported sensors
import Am2302 from 'sensors/am2302';
import Ds18b20 from 'sensors/ds18b20';
import FlowMeter from 'sensors/flow-meter';

// setup board
const board = new five.Board({
  io: new raspi()
});

// display - optional
let display = null;

// setup hub
board.on('ready', function() {

  // required keys for hub configuration
  const requiredConfig = [
    'hub.id',
    'firebase',
    'firebase.apiKey',
    'firebase.authDomain',
    'firebase.databaseURL',
    'firebase.storageBucket',
    'firebase.serviceAccountPath'
  ];

  // check if all keys set
  const requiredMet = requiredConfig.map((key) => {
    return config.has(key);
  });

  if (requiredMet.indexOf(false) === -1) {
    const hubId = config.get('hub.id');
    const firebaseConfig = config.get('firebase');

    // initialize firebase
    firebase.initializeApp({
      apiKey: firebaseConfig.get('apiKey'),
      authDomain: firebaseConfig.get('authDomain'),
      databaseURL: firebaseConfig.get('databaseURL'),
      storageBucket: firebaseConfig.get('storageBucket'),
      serviceAccount: firebaseConfig.get('serviceAccountPath')
    });

    // setup display - optional
    if (config.has('hub.display') && config.has('hub.display.type')) {
      const type = config.get('hub.display.type');
      if (type === 'ssd1306') {
        display = new Ssd1306(board, five);
      } else {
        console.error(`unsupported display: ${type}.`);
      }
    } else {
      console.warn('no display configured.');
    }

    // setup display toggle - optional
    let displayToggle = null;
    if (display && config.has('hub.display.toggle')) {
      const togglePin = config.get('hub.display.toggle');
      displayToggle = new DisplayToggle(five, togglePin, display);
    } else {
      console.warn('no display toggle configured.');
    }

    // setup sensors - optional
    let sensors = [];
    if (config.has('hub.sensors')) {
      const sensorConfig = config.get('hub.sensors');
      sensorConfig.forEach((s) => {
        if (s.type === 'am2302') {
          // am2302 temperature sensor
          sensors.push(new Am2302(firebase, s.id, s.pin, s.polling));

        } else if (s.type === 'ds18b20') {
          // ds18b20 temperature sensor
          sensors.push(new Ds18b20(firebase, s.id, s.address, s.polling));

        } else {
          console.error(`unsupported sensor type: ${s.type}.`);
        }
      });
    } else {
      console.warn('no sensor configuration found.');
    }

    console.log(`${sensors.length} sensors configured.`);

    // setup flow meters - technically optional
    let taps = [];
    if (config.has('hub.taps')) {
      const tapConfig = config.get('hub.taps');
      tapConfig.forEach((t) => {
        const f = new five.Sensor.Digital(t.pin);
        const flow = new FlowMeter(firebase, t.id, f, display);
        taps.push(flow);
      });
    } else {
      console.warn('no tap configuration found.');
    }

    console.info(`${taps.length} taps configured.`);

    // set hub to online
    // firebase.database().ref(`hubs/${hubId}/status`).set('online');

  } else {
    console.error('hub is not configured correctly.');
    console.error('required configuration:', requiredConfig.join(', '));
  }

  // on shutdown
  this.on('exit', function() {
    // notify application
    // firebase.database().ref(`hubs/${hubId}/status`).set('offline');

    // turn off display hardware
    if (display) {
      display.off();
    }
  });

  // helpers to add to REPL
  this.repl.inject({ });
});
