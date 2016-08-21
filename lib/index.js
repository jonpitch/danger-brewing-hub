'use strict';

var _raspiIo = require('raspi-io');

var _raspiIo2 = _interopRequireDefault(_raspiIo);

var _johnnyFive = require('johnny-five');

var _johnnyFive2 = _interopRequireDefault(_johnnyFive);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _ssd = require('display/ssd1306');

var _ssd2 = _interopRequireDefault(_ssd);

var _displayToggle = require('display/display-toggle');

var _displayToggle2 = _interopRequireDefault(_displayToggle);

var _am = require('sensors/am2302');

var _am2 = _interopRequireDefault(_am);

var _ds18b = require('sensors/ds18b20');

var _ds18b2 = _interopRequireDefault(_ds18b);

var _flowMeter = require('sensors/flow-meter');

var _flowMeter2 = _interopRequireDefault(_flowMeter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// setup board
var board = new _johnnyFive2.default.Board({
  io: new _raspiIo2.default()
});

// display - optional


// supported sensors


// supported displays
var display = null;

// firebase hub id
var hubId = null;

// hardware
var sensors = [];
var taps = [];

// setup hub
board.on('ready', function () {

  // required keys for hub configuration
  var requiredConfig = ['hub.id', 'firebase', 'firebase.apiKey', 'firebase.authDomain', 'firebase.databaseURL', 'firebase.storageBucket', 'firebase.serviceAccountPath'];

  // check if all keys set
  var requiredMet = requiredConfig.map(function (key) {
    return _config2.default.has(key);
  });

  if (requiredMet.indexOf(false) === -1) {
    hubId = _config2.default.get('hub.id');
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
      var togglePin = _config2.default.get('hub.display.toggle');
      displayToggle = new _displayToggle2.default(_johnnyFive2.default, togglePin, display);
    } else {
      console.warn('no display toggle configured.');
    }

    // setup sensors - optional
    if (_config2.default.has('hub.sensors')) {
      var sensorConfig = _config2.default.get('hub.sensors');
      sensorConfig.forEach(function (s) {
        if (s.type === 'am2302') {
          // am2302 temperature sensor
          sensors.push(new _am2.default(_firebase2.default, s.id, s.pin, s.polling));
        } else if (s.type === 'ds18b20') {
          // ds18b20 temperature sensor
          sensors.push(new _ds18b2.default(_firebase2.default, s.id, s.address, s.polling));
        } else {
          console.error('unsupported sensor type: ' + s.type + '.');
        }
      });
    } else {
      console.warn('no sensor configuration found.');
    }

    console.log(sensors.length + ' sensors configured.');

    // setup flow meters - technically optional
    if (_config2.default.has('hub.taps')) {
      var tapConfig = _config2.default.get('hub.taps');
      tapConfig.forEach(function (t) {
        var f = new _johnnyFive2.default.Sensor.Digital(t.pin);
        var flow = new _flowMeter2.default(_firebase2.default, t.id, f, display);
        taps.push(flow);
      });
    } else {
      console.warn('no tap configuration found.');
    }

    console.info(taps.length + ' taps configured.');

    // set hub to online
    _firebase2.default.database().ref('hubs/' + hubId + '/status').set('online');
  } else {
    console.error('hub is not configured correctly.');
    console.error('required configuration:', requiredConfig.join(', '));
  }

  // on shutdown
  this.on('exit', function () {
    // notify application
    if (_firebase2.default && hubId) {
      _firebase2.default.database().ref('hubs/' + hubId + '/status').set('offline');
    }

    // turn off display hardware
    if (display) {
      display.off();
    }
  });

  // helpers to add to REPL
  this.repl.inject({});
});
//# sourceMappingURL=data:application/json;base64,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LEdBVkQ7O0FBWUE7QUFDQSxPQUFLLElBQUwsQ0FBVSxNQUFWLENBQWlCLEVBQWpCO0FBQ0QsQ0EvR0QiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmFzcGkgZnJvbSAncmFzcGktaW8nO1xuaW1wb3J0IGZpdmUgZnJvbSAnam9obm55LWZpdmUnO1xuaW1wb3J0IGNvbmZpZyBmcm9tICdjb25maWcnO1xuaW1wb3J0IGZpcmViYXNlIGZyb20gJ2ZpcmViYXNlJztcblxuLy8gc3VwcG9ydGVkIGRpc3BsYXlzXG5pbXBvcnQgU3NkMTMwNiBmcm9tICdkaXNwbGF5L3NzZDEzMDYnO1xuaW1wb3J0IERpc3BsYXlUb2dnbGUgZnJvbSAnZGlzcGxheS9kaXNwbGF5LXRvZ2dsZSc7XG5cbi8vIHN1cHBvcnRlZCBzZW5zb3JzXG5pbXBvcnQgQW0yMzAyIGZyb20gJ3NlbnNvcnMvYW0yMzAyJztcbmltcG9ydCBEczE4YjIwIGZyb20gJ3NlbnNvcnMvZHMxOGIyMCc7XG5pbXBvcnQgRmxvd01ldGVyIGZyb20gJ3NlbnNvcnMvZmxvdy1tZXRlcic7XG5cbi8vIHNldHVwIGJvYXJkXG5jb25zdCBib2FyZCA9IG5ldyBmaXZlLkJvYXJkKHtcbiAgaW86IG5ldyByYXNwaSgpXG59KTtcblxuLy8gZGlzcGxheSAtIG9wdGlvbmFsXG5sZXQgZGlzcGxheSA9IG51bGw7XG5cbi8vIGZpcmViYXNlIGh1YiBpZFxubGV0IGh1YklkID0gbnVsbDtcblxuLy8gaGFyZHdhcmVcbmxldCBzZW5zb3JzID0gW107XG5sZXQgdGFwcyA9IFtdO1xuXG4vLyBzZXR1cCBodWJcbmJvYXJkLm9uKCdyZWFkeScsIGZ1bmN0aW9uKCkge1xuXG4gIC8vIHJlcXVpcmVkIGtleXMgZm9yIGh1YiBjb25maWd1cmF0aW9uXG4gIGNvbnN0IHJlcXVpcmVkQ29uZmlnID0gW1xuICAgICdodWIuaWQnLFxuICAgICdmaXJlYmFzZScsXG4gICAgJ2ZpcmViYXNlLmFwaUtleScsXG4gICAgJ2ZpcmViYXNlLmF1dGhEb21haW4nLFxuICAgICdmaXJlYmFzZS5kYXRhYmFzZVVSTCcsXG4gICAgJ2ZpcmViYXNlLnN0b3JhZ2VCdWNrZXQnLFxuICAgICdmaXJlYmFzZS5zZXJ2aWNlQWNjb3VudFBhdGgnXG4gIF07XG5cbiAgLy8gY2hlY2sgaWYgYWxsIGtleXMgc2V0XG4gIGNvbnN0IHJlcXVpcmVkTWV0ID0gcmVxdWlyZWRDb25maWcubWFwKChrZXkpID0+IHtcbiAgICByZXR1cm4gY29uZmlnLmhhcyhrZXkpO1xuICB9KTtcblxuICBpZiAocmVxdWlyZWRNZXQuaW5kZXhPZihmYWxzZSkgPT09IC0xKSB7XG4gICAgaHViSWQgPSBjb25maWcuZ2V0KCdodWIuaWQnKTtcbiAgICBjb25zdCBmaXJlYmFzZUNvbmZpZyA9IGNvbmZpZy5nZXQoJ2ZpcmViYXNlJyk7XG5cbiAgICAvLyBpbml0aWFsaXplIGZpcmViYXNlXG4gICAgZmlyZWJhc2UuaW5pdGlhbGl6ZUFwcCh7XG4gICAgICBhcGlLZXk6IGZpcmViYXNlQ29uZmlnLmdldCgnYXBpS2V5JyksXG4gICAgICBhdXRoRG9tYWluOiBmaXJlYmFzZUNvbmZpZy5nZXQoJ2F1dGhEb21haW4nKSxcbiAgICAgIGRhdGFiYXNlVVJMOiBmaXJlYmFzZUNvbmZpZy5nZXQoJ2RhdGFiYXNlVVJMJyksXG4gICAgICBzdG9yYWdlQnVja2V0OiBmaXJlYmFzZUNvbmZpZy5nZXQoJ3N0b3JhZ2VCdWNrZXQnKSxcbiAgICAgIHNlcnZpY2VBY2NvdW50OiBmaXJlYmFzZUNvbmZpZy5nZXQoJ3NlcnZpY2VBY2NvdW50UGF0aCcpXG4gICAgfSk7XG5cbiAgICAvLyBzZXR1cCBkaXNwbGF5IC0gb3B0aW9uYWxcbiAgICBpZiAoY29uZmlnLmhhcygnaHViLmRpc3BsYXknKSAmJiBjb25maWcuaGFzKCdodWIuZGlzcGxheS50eXBlJykpIHtcbiAgICAgIGNvbnN0IHR5cGUgPSBjb25maWcuZ2V0KCdodWIuZGlzcGxheS50eXBlJyk7XG4gICAgICBpZiAodHlwZSA9PT0gJ3NzZDEzMDYnKSB7XG4gICAgICAgIGRpc3BsYXkgPSBuZXcgU3NkMTMwNihib2FyZCwgZml2ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKGB1bnN1cHBvcnRlZCBkaXNwbGF5OiAke3R5cGV9LmApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ25vIGRpc3BsYXkgY29uZmlndXJlZC4nKTtcbiAgICB9XG5cbiAgICAvLyBzZXR1cCBkaXNwbGF5IHRvZ2dsZSAtIG9wdGlvbmFsXG4gICAgbGV0IGRpc3BsYXlUb2dnbGUgPSBudWxsO1xuICAgIGlmIChkaXNwbGF5ICYmIGNvbmZpZy5oYXMoJ2h1Yi5kaXNwbGF5LnRvZ2dsZScpKSB7XG4gICAgICBjb25zdCB0b2dnbGVQaW4gPSBjb25maWcuZ2V0KCdodWIuZGlzcGxheS50b2dnbGUnKTtcbiAgICAgIGRpc3BsYXlUb2dnbGUgPSBuZXcgRGlzcGxheVRvZ2dsZShmaXZlLCB0b2dnbGVQaW4sIGRpc3BsYXkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ25vIGRpc3BsYXkgdG9nZ2xlIGNvbmZpZ3VyZWQuJyk7XG4gICAgfVxuXG4gICAgLy8gc2V0dXAgc2Vuc29ycyAtIG9wdGlvbmFsXG4gICAgaWYgKGNvbmZpZy5oYXMoJ2h1Yi5zZW5zb3JzJykpIHtcbiAgICAgIGNvbnN0IHNlbnNvckNvbmZpZyA9IGNvbmZpZy5nZXQoJ2h1Yi5zZW5zb3JzJyk7XG4gICAgICBzZW5zb3JDb25maWcuZm9yRWFjaCgocykgPT4ge1xuICAgICAgICBpZiAocy50eXBlID09PSAnYW0yMzAyJykge1xuICAgICAgICAgIC8vIGFtMjMwMiB0ZW1wZXJhdHVyZSBzZW5zb3JcbiAgICAgICAgICBzZW5zb3JzLnB1c2gobmV3IEFtMjMwMihmaXJlYmFzZSwgcy5pZCwgcy5waW4sIHMucG9sbGluZykpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAocy50eXBlID09PSAnZHMxOGIyMCcpIHtcbiAgICAgICAgICAvLyBkczE4YjIwIHRlbXBlcmF0dXJlIHNlbnNvclxuICAgICAgICAgIHNlbnNvcnMucHVzaChuZXcgRHMxOGIyMChmaXJlYmFzZSwgcy5pZCwgcy5hZGRyZXNzLCBzLnBvbGxpbmcpKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYHVuc3VwcG9ydGVkIHNlbnNvciB0eXBlOiAke3MudHlwZX0uYCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ25vIHNlbnNvciBjb25maWd1cmF0aW9uIGZvdW5kLicpO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKGAke3NlbnNvcnMubGVuZ3RofSBzZW5zb3JzIGNvbmZpZ3VyZWQuYCk7XG5cbiAgICAvLyBzZXR1cCBmbG93IG1ldGVycyAtIHRlY2huaWNhbGx5IG9wdGlvbmFsXG4gICAgaWYgKGNvbmZpZy5oYXMoJ2h1Yi50YXBzJykpIHtcbiAgICAgIGNvbnN0IHRhcENvbmZpZyA9IGNvbmZpZy5nZXQoJ2h1Yi50YXBzJyk7XG4gICAgICB0YXBDb25maWcuZm9yRWFjaCgodCkgPT4ge1xuICAgICAgICBjb25zdCBmID0gbmV3IGZpdmUuU2Vuc29yLkRpZ2l0YWwodC5waW4pO1xuICAgICAgICBjb25zdCBmbG93ID0gbmV3IEZsb3dNZXRlcihmaXJlYmFzZSwgdC5pZCwgZiwgZGlzcGxheSk7XG4gICAgICAgIHRhcHMucHVzaChmbG93KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ25vIHRhcCBjb25maWd1cmF0aW9uIGZvdW5kLicpO1xuICAgIH1cblxuICAgIGNvbnNvbGUuaW5mbyhgJHt0YXBzLmxlbmd0aH0gdGFwcyBjb25maWd1cmVkLmApO1xuXG4gICAgLy8gc2V0IGh1YiB0byBvbmxpbmVcbiAgICBmaXJlYmFzZS5kYXRhYmFzZSgpLnJlZihgaHVicy8ke2h1YklkfS9zdGF0dXNgKS5zZXQoJ29ubGluZScpO1xuXG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5lcnJvcignaHViIGlzIG5vdCBjb25maWd1cmVkIGNvcnJlY3RseS4nKTtcbiAgICBjb25zb2xlLmVycm9yKCdyZXF1aXJlZCBjb25maWd1cmF0aW9uOicsIHJlcXVpcmVkQ29uZmlnLmpvaW4oJywgJykpO1xuICB9XG5cbiAgLy8gb24gc2h1dGRvd25cbiAgdGhpcy5vbignZXhpdCcsIGZ1bmN0aW9uKCkge1xuICAgIC8vIG5vdGlmeSBhcHBsaWNhdGlvblxuICAgIGlmIChmaXJlYmFzZSAmJiBodWJJZCkge1xuICAgICAgZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoYGh1YnMvJHtodWJJZH0vc3RhdHVzYCkuc2V0KCdvZmZsaW5lJyk7XG4gICAgfVxuXG4gICAgLy8gdHVybiBvZmYgZGlzcGxheSBoYXJkd2FyZVxuICAgIGlmIChkaXNwbGF5KSB7XG4gICAgICBkaXNwbGF5Lm9mZigpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gaGVscGVycyB0byBhZGQgdG8gUkVQTFxuICB0aGlzLnJlcGwuaW5qZWN0KHsgfSk7XG59KTtcbiJdfQ==