'use strict';

var _raspiIo = require('raspi-io');

var _raspiIo2 = _interopRequireDefault(_raspiIo);

var _johnnyFive = require('johnny-five');

var _johnnyFive2 = _interopRequireDefault(_johnnyFive);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _ssd = require('../display/ssd1306');

var _ssd2 = _interopRequireDefault(_ssd);

var _displayToggle = require('../display/display-toggle');

var _displayToggle2 = _interopRequireDefault(_displayToggle);

var _am = require('../sensors/am2302');

var _am2 = _interopRequireDefault(_am);

var _ds18b = require('../sensors/ds18b20');

var _ds18b2 = _interopRequireDefault(_ds18b);

var _flowMeter = require('../sensors/flow-meter');

var _flowMeter2 = _interopRequireDefault(_flowMeter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// setup board
var board = new _johnnyFive2.default.Board({
  io: new _raspiIo2.default()
});

// setup hub


// supported sensors


// supported displays
board.on('ready', function () {

  // required keys for hub configuration
  var requiredConfig = ['hub.id', 'firebase', 'firebase.apiKey', 'firebase.authDomain', 'firebase.databaseURL', 'firebase.storageBucket', 'firebase.serviceAccount'];

  // check if all keys set
  var requiredMet = requiredConfig.map(function (key) {
    return _config2.default.has(key);
  });

  if (requiredMet.indexOf(false) === -1) {
    (function () {
      var hubId = _config2.default.get('hub.id');
      var firebaseConfig = _config2.default.get('firebase');

      // initialize firebase
      _firebase2.default.initializeApp({
        apiKey: firebaseConfig.get('apiKey'),
        authDomain: firebaseConfig.get('authDomain'),
        databaseURL: firebaseConfig.get('databaseURL'),
        storageBucket: firebaseConfig.get('storageBucket'),
        serviceAccount: firebaseConfig.get('serviceAccountPath')
      });

      // setup display - optional
      var display = null;
      if (_config2.default.has('hub.display') && _config2.default.has('hub.display.type')) {
        var type = _config2.default.get('hub.display.type');
        if (type === 'ssd1306') {
          display = new _ssd2.default(board, _johnnyFive2.default);
        } else {
          console.error('unsupported display: ' + type + '.');
        }
      } else {
        console.warn('no display configured.');
      }

      // setup display toggle - optional
      var displayToggle = null;
      if (display && _config2.default.has('hub.display.toggle')) {
        var toggle = _config2.default.get('hub.display.toggle');
        displayToggle = new _displayToggle2.default(toggle, display);
      } else {
        console.warn('no display toggle configured.');
      }

      // setup sensors - optional
      var sensors = [];
      if (_config2.default.has('hub.sensors')) {
        var sensorConfig = _config2.default.get('hub.sensors');
        sensorConfig.forEach(function (s) {
          if (s.type === 'am2302') {
            // am2302 temperature sensor
            sensors.push(new _am2.default(_firebase2.default, s.pin, s.polling));
          } else if (s.type === 'ds18b20') {
            // ds18b20 temperature sensor
            sensors.push(new _ds18b2.default(_firebase2.default, ds18b20.address, ds18b20.polling));
          } else {
            console.error('unsupported sensor type: ' + s.type + '.');
          }
        });
      } else {
        console.warn('no sensor configuration found.');
      }

      console.log(sensors.length + ' sensors configured.');

      // setup flow meters - technically optional
      var taps = [];
      if (_config2.default.has('hub.taps')) {
        var tapConfig = _config2.default.get('hub.taps');
        tapConfig.forEach(function (t) {
          var f = new _johnnyFive2.default.Sensor.Digital(t.pin);
          var flow = new _flowMeter2.default(_firebase2.default, t.id, f, display);
        });
      } else {
        console.warn('no tap configuration found.');
      }

      console.info(taps.length + ' taps configured.');

      // set hub to online
      // firebase.database().ref(`hubs/${hubId}/status`).set('online');
    })();
  } else {
    console.error('hub is not configured correctly.');
    console.error('required configuration:', requiredConfig.join(', '));
  }

  // on shutdown
  this.on('exit', function () {
    // notify application
    // firebase.database().ref(`hubs/${hubId}/status`).set('offline');

    // turn off display hardware
    if (display) {
      display.off();
    }
  });

  // helpers to add to REPL
  this.repl.inject({});
});
//# sourceMappingURL=index.js.map