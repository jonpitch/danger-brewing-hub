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

// setup hub
board.on('ready', function () {

  // required keys for hub configuration
  var requiredConfig = ['hub.id', 'firebase', 'firebase.apiKey', 'firebase.authDomain', 'firebase.databaseURL', 'firebase.storageBucket', 'firebase.serviceAccountPath'];

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
      var sensors = [];
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
      var taps = [];
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
//# sourceMappingURL=data:application/json;base64,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USxLQUFSLCtCQUEwQyxFQUFFLElBQTVDO0FBQ0Q7QUFDRixTQVpEO0FBYUQsT0FmRCxNQWVPO0FBQ0wsZ0JBQVEsSUFBUixDQUFhLGdDQUFiO0FBQ0Q7O0FBRUQsY0FBUSxHQUFSLENBQWUsUUFBUSxNQUF2Qjs7QUFFQTtBQUNBLFVBQUksT0FBTyxFQUFYO0FBQ0EsVUFBSSxpQkFBTyxHQUFQLENBQVcsVUFBWCxDQUFKLEVBQTRCO0FBQzFCLFlBQU0sWUFBWSxpQkFBTyxHQUFQLENBQVcsVUFBWCxDQUFsQjtBQUNBLGtCQUFVLE9BQVYsQ0FBa0IsVUFBQyxDQUFELEVBQU87QUFDdkIsY0FBTSxJQUFJLElBQUkscUJBQUssTUFBTCxDQUFZLE9BQWhCLENBQXdCLEVBQUUsR0FBMUIsQ0FBVjtBQUNBLGNBQU0sT0FBTyw0Q0FBd0IsRUFBRSxFQUExQixFQUE4QixDQUE5QixFQUFpQyxPQUFqQyxDQUFiO0FBQ0EsZUFBSyxJQUFMLENBQVUsSUFBVjtBQUNELFNBSkQ7QUFLRCxPQVBELE1BT087QUFDTCxnQkFBUSxJQUFSLENBQWEsNkJBQWI7QUFDRDs7QUFFRCxjQUFRLElBQVIsQ0FBZ0IsS0FBSyxNQUFyQjs7QUFFQTtBQUNBO0FBekVxQztBQTJFdEMsR0EzRUQsTUEyRU87QUFDTCxZQUFRLEtBQVIsQ0FBYyxrQ0FBZDtBQUNBLFlBQVEsS0FBUixDQUFjLHlCQUFkLEVBQXlDLGVBQWUsSUFBZixDQUFvQixJQUFwQixDQUF6QztBQUNEOztBQUVEO0FBQ0EsT0FBSyxFQUFMLENBQVEsTUFBUixFQUFnQixZQUFXO0FBQ3pCO0FBQ0E7O0FBRUE7QUFDQSxRQUFJLE9BQUosRUFBYTtBQUNYLGNBQVEsR0FBUjtBQUNEO0FBQ0YsR0FSRDs7QUFVQTtBQUNBLE9BQUssSUFBTCxDQUFVLE1BQVYsQ0FBaUIsRUFBakI7QUFDRCxDQS9HRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByYXNwaSBmcm9tICdyYXNwaS1pbyc7XG5pbXBvcnQgZml2ZSBmcm9tICdqb2hubnktZml2ZSc7XG5pbXBvcnQgY29uZmlnIGZyb20gJ2NvbmZpZyc7XG5pbXBvcnQgZmlyZWJhc2UgZnJvbSAnZmlyZWJhc2UnO1xuXG4vLyBzdXBwb3J0ZWQgZGlzcGxheXNcbmltcG9ydCBTc2QxMzA2IGZyb20gJ2Rpc3BsYXkvc3NkMTMwNic7XG5pbXBvcnQgRGlzcGxheVRvZ2dsZSBmcm9tICdkaXNwbGF5L2Rpc3BsYXktdG9nZ2xlJztcblxuLy8gc3VwcG9ydGVkIHNlbnNvcnNcbmltcG9ydCBBbTIzMDIgZnJvbSAnc2Vuc29ycy9hbTIzMDInO1xuaW1wb3J0IERzMThiMjAgZnJvbSAnc2Vuc29ycy9kczE4YjIwJztcbmltcG9ydCBGbG93TWV0ZXIgZnJvbSAnc2Vuc29ycy9mbG93LW1ldGVyJztcblxuLy8gc2V0dXAgYm9hcmRcbmNvbnN0IGJvYXJkID0gbmV3IGZpdmUuQm9hcmQoe1xuICBpbzogbmV3IHJhc3BpKClcbn0pO1xuXG4vLyBkaXNwbGF5IC0gb3B0aW9uYWxcbmxldCBkaXNwbGF5ID0gbnVsbDtcblxuLy8gc2V0dXAgaHViXG5ib2FyZC5vbigncmVhZHknLCBmdW5jdGlvbigpIHtcblxuICAvLyByZXF1aXJlZCBrZXlzIGZvciBodWIgY29uZmlndXJhdGlvblxuICBjb25zdCByZXF1aXJlZENvbmZpZyA9IFtcbiAgICAnaHViLmlkJyxcbiAgICAnZmlyZWJhc2UnLFxuICAgICdmaXJlYmFzZS5hcGlLZXknLFxuICAgICdmaXJlYmFzZS5hdXRoRG9tYWluJyxcbiAgICAnZmlyZWJhc2UuZGF0YWJhc2VVUkwnLFxuICAgICdmaXJlYmFzZS5zdG9yYWdlQnVja2V0JyxcbiAgICAnZmlyZWJhc2Uuc2VydmljZUFjY291bnRQYXRoJ1xuICBdO1xuXG4gIC8vIGNoZWNrIGlmIGFsbCBrZXlzIHNldFxuICBjb25zdCByZXF1aXJlZE1ldCA9IHJlcXVpcmVkQ29uZmlnLm1hcCgoa2V5KSA9PiB7XG4gICAgcmV0dXJuIGNvbmZpZy5oYXMoa2V5KTtcbiAgfSk7XG5cbiAgaWYgKHJlcXVpcmVkTWV0LmluZGV4T2YoZmFsc2UpID09PSAtMSkge1xuICAgIGNvbnN0IGh1YklkID0gY29uZmlnLmdldCgnaHViLmlkJyk7XG4gICAgY29uc3QgZmlyZWJhc2VDb25maWcgPSBjb25maWcuZ2V0KCdmaXJlYmFzZScpO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSBmaXJlYmFzZVxuICAgIGZpcmViYXNlLmluaXRpYWxpemVBcHAoe1xuICAgICAgYXBpS2V5OiBmaXJlYmFzZUNvbmZpZy5nZXQoJ2FwaUtleScpLFxuICAgICAgYXV0aERvbWFpbjogZmlyZWJhc2VDb25maWcuZ2V0KCdhdXRoRG9tYWluJyksXG4gICAgICBkYXRhYmFzZVVSTDogZmlyZWJhc2VDb25maWcuZ2V0KCdkYXRhYmFzZVVSTCcpLFxuICAgICAgc3RvcmFnZUJ1Y2tldDogZmlyZWJhc2VDb25maWcuZ2V0KCdzdG9yYWdlQnVja2V0JyksXG4gICAgICBzZXJ2aWNlQWNjb3VudDogZmlyZWJhc2VDb25maWcuZ2V0KCdzZXJ2aWNlQWNjb3VudFBhdGgnKVxuICAgIH0pO1xuXG4gICAgLy8gc2V0dXAgZGlzcGxheSAtIG9wdGlvbmFsXG4gICAgaWYgKGNvbmZpZy5oYXMoJ2h1Yi5kaXNwbGF5JykgJiYgY29uZmlnLmhhcygnaHViLmRpc3BsYXkudHlwZScpKSB7XG4gICAgICBjb25zdCB0eXBlID0gY29uZmlnLmdldCgnaHViLmRpc3BsYXkudHlwZScpO1xuICAgICAgaWYgKHR5cGUgPT09ICdzc2QxMzA2Jykge1xuICAgICAgICBkaXNwbGF5ID0gbmV3IFNzZDEzMDYoYm9hcmQsIGZpdmUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgdW5zdXBwb3J0ZWQgZGlzcGxheTogJHt0eXBlfS5gKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdubyBkaXNwbGF5IGNvbmZpZ3VyZWQuJyk7XG4gICAgfVxuXG4gICAgLy8gc2V0dXAgZGlzcGxheSB0b2dnbGUgLSBvcHRpb25hbFxuICAgIGxldCBkaXNwbGF5VG9nZ2xlID0gbnVsbDtcbiAgICBpZiAoZGlzcGxheSAmJiBjb25maWcuaGFzKCdodWIuZGlzcGxheS50b2dnbGUnKSkge1xuICAgICAgY29uc3QgdG9nZ2xlUGluID0gY29uZmlnLmdldCgnaHViLmRpc3BsYXkudG9nZ2xlJyk7XG4gICAgICBkaXNwbGF5VG9nZ2xlID0gbmV3IERpc3BsYXlUb2dnbGUoZml2ZSwgdG9nZ2xlUGluLCBkaXNwbGF5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdubyBkaXNwbGF5IHRvZ2dsZSBjb25maWd1cmVkLicpO1xuICAgIH1cblxuICAgIC8vIHNldHVwIHNlbnNvcnMgLSBvcHRpb25hbFxuICAgIGxldCBzZW5zb3JzID0gW107XG4gICAgaWYgKGNvbmZpZy5oYXMoJ2h1Yi5zZW5zb3JzJykpIHtcbiAgICAgIGNvbnN0IHNlbnNvckNvbmZpZyA9IGNvbmZpZy5nZXQoJ2h1Yi5zZW5zb3JzJyk7XG4gICAgICBzZW5zb3JDb25maWcuZm9yRWFjaCgocykgPT4ge1xuICAgICAgICBpZiAocy50eXBlID09PSAnYW0yMzAyJykge1xuICAgICAgICAgIC8vIGFtMjMwMiB0ZW1wZXJhdHVyZSBzZW5zb3JcbiAgICAgICAgICBzZW5zb3JzLnB1c2gobmV3IEFtMjMwMihmaXJlYmFzZSwgcy5pZCwgcy5waW4sIHMucG9sbGluZykpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAocy50eXBlID09PSAnZHMxOGIyMCcpIHtcbiAgICAgICAgICAvLyBkczE4YjIwIHRlbXBlcmF0dXJlIHNlbnNvclxuICAgICAgICAgIHNlbnNvcnMucHVzaChuZXcgRHMxOGIyMChmaXJlYmFzZSwgcy5pZCwgcy5hZGRyZXNzLCBzLnBvbGxpbmcpKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYHVuc3VwcG9ydGVkIHNlbnNvciB0eXBlOiAke3MudHlwZX0uYCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ25vIHNlbnNvciBjb25maWd1cmF0aW9uIGZvdW5kLicpO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKGAke3NlbnNvcnMubGVuZ3RofSBzZW5zb3JzIGNvbmZpZ3VyZWQuYCk7XG5cbiAgICAvLyBzZXR1cCBmbG93IG1ldGVycyAtIHRlY2huaWNhbGx5IG9wdGlvbmFsXG4gICAgbGV0IHRhcHMgPSBbXTtcbiAgICBpZiAoY29uZmlnLmhhcygnaHViLnRhcHMnKSkge1xuICAgICAgY29uc3QgdGFwQ29uZmlnID0gY29uZmlnLmdldCgnaHViLnRhcHMnKTtcbiAgICAgIHRhcENvbmZpZy5mb3JFYWNoKCh0KSA9PiB7XG4gICAgICAgIGNvbnN0IGYgPSBuZXcgZml2ZS5TZW5zb3IuRGlnaXRhbCh0LnBpbik7XG4gICAgICAgIGNvbnN0IGZsb3cgPSBuZXcgRmxvd01ldGVyKGZpcmViYXNlLCB0LmlkLCBmLCBkaXNwbGF5KTtcbiAgICAgICAgdGFwcy5wdXNoKGZsb3cpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2Fybignbm8gdGFwIGNvbmZpZ3VyYXRpb24gZm91bmQuJyk7XG4gICAgfVxuXG4gICAgY29uc29sZS5pbmZvKGAke3RhcHMubGVuZ3RofSB0YXBzIGNvbmZpZ3VyZWQuYCk7XG5cbiAgICAvLyBzZXQgaHViIHRvIG9ubGluZVxuICAgIC8vIGZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGBodWJzLyR7aHViSWR9L3N0YXR1c2ApLnNldCgnb25saW5lJyk7XG5cbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKCdodWIgaXMgbm90IGNvbmZpZ3VyZWQgY29ycmVjdGx5LicpO1xuICAgIGNvbnNvbGUuZXJyb3IoJ3JlcXVpcmVkIGNvbmZpZ3VyYXRpb246JywgcmVxdWlyZWRDb25maWcuam9pbignLCAnKSk7XG4gIH1cblxuICAvLyBvbiBzaHV0ZG93blxuICB0aGlzLm9uKCdleGl0JywgZnVuY3Rpb24oKSB7XG4gICAgLy8gbm90aWZ5IGFwcGxpY2F0aW9uXG4gICAgLy8gZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoYGh1YnMvJHtodWJJZH0vc3RhdHVzYCkuc2V0KCdvZmZsaW5lJyk7XG5cbiAgICAvLyB0dXJuIG9mZiBkaXNwbGF5IGhhcmR3YXJlXG4gICAgaWYgKGRpc3BsYXkpIHtcbiAgICAgIGRpc3BsYXkub2ZmKCk7XG4gICAgfVxuICB9KTtcblxuICAvLyBoZWxwZXJzIHRvIGFkZCB0byBSRVBMXG4gIHRoaXMucmVwbC5pbmplY3QoeyB9KTtcbn0pO1xuIl19