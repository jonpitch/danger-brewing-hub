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
    if (display && _config2.default.has('hub.display.toggle')) {
      var togglePin = _config2.default.get('hub.display.toggle');
      new _displayToggle2.default(_johnnyFive2.default, togglePin, display);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJib2FyZCIsIkJvYXJkIiwiaW8iLCJkaXNwbGF5IiwiaHViSWQiLCJzZW5zb3JzIiwidGFwcyIsIm9uIiwicmVxdWlyZWRDb25maWciLCJyZXF1aXJlZE1ldCIsIm1hcCIsImtleSIsImhhcyIsImluZGV4T2YiLCJnZXQiLCJmaXJlYmFzZUNvbmZpZyIsImluaXRpYWxpemVBcHAiLCJhcGlLZXkiLCJhdXRoRG9tYWluIiwiZGF0YWJhc2VVUkwiLCJzdG9yYWdlQnVja2V0Iiwic2VydmljZUFjY291bnQiLCJ0eXBlIiwiY29uc29sZSIsImVycm9yIiwid2FybiIsInRvZ2dsZVBpbiIsInNlbnNvckNvbmZpZyIsImZvckVhY2giLCJzIiwicHVzaCIsImlkIiwicGluIiwicG9sbGluZyIsImFkZHJlc3MiLCJsb2ciLCJsZW5ndGgiLCJ0YXBDb25maWciLCJ0IiwiZiIsIlNlbnNvciIsIkRpZ2l0YWwiLCJmbG93IiwiaW5mbyIsImRhdGFiYXNlIiwicmVmIiwic2V0Iiwiam9pbiIsIm9mZiIsInJlcGwiLCJpbmplY3QiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFHQTs7OztBQUNBOzs7O0FBR0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTtBQUNBLElBQU1BLFFBQVEsSUFBSSxxQkFBS0MsS0FBVCxDQUFlO0FBQzNCQyxNQUFJO0FBRHVCLENBQWYsQ0FBZDs7QUFJQTs7O0FBVkE7OztBQUpBO0FBZUEsSUFBSUMsVUFBVSxJQUFkOztBQUVBO0FBQ0EsSUFBSUMsUUFBUSxJQUFaOztBQUVBO0FBQ0EsSUFBSUMsVUFBVSxFQUFkO0FBQ0EsSUFBSUMsT0FBTyxFQUFYOztBQUVBO0FBQ0FOLE1BQU1PLEVBQU4sQ0FBUyxPQUFULEVBQWtCLFlBQVc7O0FBRTNCO0FBQ0EsTUFBTUMsaUJBQWlCLENBQ3JCLFFBRHFCLEVBRXJCLFVBRnFCLEVBR3JCLGlCQUhxQixFQUlyQixxQkFKcUIsRUFLckIsc0JBTHFCLEVBTXJCLHdCQU5xQixFQU9yQiw2QkFQcUIsQ0FBdkI7O0FBVUE7QUFDQSxNQUFNQyxjQUFjRCxlQUFlRSxHQUFmLENBQW1CLFVBQUNDLEdBQUQsRUFBUztBQUM5QyxXQUFPLGlCQUFPQyxHQUFQLENBQVdELEdBQVgsQ0FBUDtBQUNELEdBRm1CLENBQXBCOztBQUlBLE1BQUlGLFlBQVlJLE9BQVosQ0FBb0IsS0FBcEIsTUFBK0IsQ0FBQyxDQUFwQyxFQUF1QztBQUNyQ1QsWUFBUSxpQkFBT1UsR0FBUCxDQUFXLFFBQVgsQ0FBUjtBQUNBLFFBQU1DLGlCQUFpQixpQkFBT0QsR0FBUCxDQUFXLFVBQVgsQ0FBdkI7O0FBRUE7QUFDQSx1QkFBU0UsYUFBVCxDQUF1QjtBQUNyQkMsY0FBUUYsZUFBZUQsR0FBZixDQUFtQixRQUFuQixDQURhO0FBRXJCSSxrQkFBWUgsZUFBZUQsR0FBZixDQUFtQixZQUFuQixDQUZTO0FBR3JCSyxtQkFBYUosZUFBZUQsR0FBZixDQUFtQixhQUFuQixDQUhRO0FBSXJCTSxxQkFBZUwsZUFBZUQsR0FBZixDQUFtQixlQUFuQixDQUpNO0FBS3JCTyxzQkFBZ0JOLGVBQWVELEdBQWYsQ0FBbUIsb0JBQW5CO0FBTEssS0FBdkI7O0FBUUE7QUFDQSxRQUFJLGlCQUFPRixHQUFQLENBQVcsYUFBWCxLQUE2QixpQkFBT0EsR0FBUCxDQUFXLGtCQUFYLENBQWpDLEVBQWlFO0FBQy9ELFVBQU1VLE9BQU8saUJBQU9SLEdBQVAsQ0FBVyxrQkFBWCxDQUFiO0FBQ0EsVUFBSVEsU0FBUyxTQUFiLEVBQXdCO0FBQ3RCbkIsa0JBQVUsa0JBQVlILEtBQVosdUJBQVY7QUFDRCxPQUZELE1BRU87QUFDTHVCLGdCQUFRQyxLQUFSLDJCQUFzQ0YsSUFBdEM7QUFDRDtBQUNGLEtBUEQsTUFPTztBQUNMQyxjQUFRRSxJQUFSLENBQWEsd0JBQWI7QUFDRDs7QUFFRDtBQUNBLFFBQUl0QixXQUFXLGlCQUFPUyxHQUFQLENBQVcsb0JBQVgsQ0FBZixFQUFpRDtBQUMvQyxVQUFNYyxZQUFZLGlCQUFPWixHQUFQLENBQVcsb0JBQVgsQ0FBbEI7QUFDQSx3REFBd0JZLFNBQXhCLEVBQW1DdkIsT0FBbkM7QUFDRCxLQUhELE1BR087QUFDTG9CLGNBQVFFLElBQVIsQ0FBYSwrQkFBYjtBQUNEOztBQUVEO0FBQ0EsUUFBSSxpQkFBT2IsR0FBUCxDQUFXLGFBQVgsQ0FBSixFQUErQjtBQUM3QixVQUFNZSxlQUFlLGlCQUFPYixHQUFQLENBQVcsYUFBWCxDQUFyQjtBQUNBYSxtQkFBYUMsT0FBYixDQUFxQixVQUFDQyxDQUFELEVBQU87QUFDMUIsWUFBSUEsRUFBRVAsSUFBRixLQUFXLFFBQWYsRUFBeUI7QUFDdkI7QUFDQWpCLGtCQUFReUIsSUFBUixDQUFhLHFDQUFxQkQsRUFBRUUsRUFBdkIsRUFBMkJGLEVBQUVHLEdBQTdCLEVBQWtDSCxFQUFFSSxPQUFwQyxDQUFiO0FBRUQsU0FKRCxNQUlPLElBQUlKLEVBQUVQLElBQUYsS0FBVyxTQUFmLEVBQTBCO0FBQy9CO0FBQ0FqQixrQkFBUXlCLElBQVIsQ0FBYSx3Q0FBc0JELEVBQUVFLEVBQXhCLEVBQTRCRixFQUFFSyxPQUE5QixFQUF1Q0wsRUFBRUksT0FBekMsQ0FBYjtBQUVELFNBSk0sTUFJQTtBQUNMVixrQkFBUUMsS0FBUiwrQkFBMENLLEVBQUVQLElBQTVDO0FBQ0Q7QUFDRixPQVpEO0FBYUQsS0FmRCxNQWVPO0FBQ0xDLGNBQVFFLElBQVIsQ0FBYSxnQ0FBYjtBQUNEOztBQUVERixZQUFRWSxHQUFSLENBQWU5QixRQUFRK0IsTUFBdkI7O0FBRUE7QUFDQSxRQUFJLGlCQUFPeEIsR0FBUCxDQUFXLFVBQVgsQ0FBSixFQUE0QjtBQUMxQixVQUFNeUIsWUFBWSxpQkFBT3ZCLEdBQVAsQ0FBVyxVQUFYLENBQWxCO0FBQ0F1QixnQkFBVVQsT0FBVixDQUFrQixVQUFDVSxDQUFELEVBQU87QUFDdkIsWUFBTUMsSUFBSSxJQUFJLHFCQUFLQyxNQUFMLENBQVlDLE9BQWhCLENBQXdCSCxFQUFFTixHQUExQixDQUFWO0FBQ0EsWUFBTVUsT0FBTyw0Q0FBd0JKLEVBQUVQLEVBQTFCLEVBQThCUSxDQUE5QixFQUFpQ3BDLE9BQWpDLENBQWI7QUFDQUcsYUFBS3dCLElBQUwsQ0FBVVksSUFBVjtBQUNELE9BSkQ7QUFLRCxLQVBELE1BT087QUFDTG5CLGNBQVFFLElBQVIsQ0FBYSw2QkFBYjtBQUNEOztBQUVERixZQUFRb0IsSUFBUixDQUFnQnJDLEtBQUs4QixNQUFyQjs7QUFFQTtBQUNBLHVCQUFTUSxRQUFULEdBQW9CQyxHQUFwQixXQUFnQ3pDLEtBQWhDLGNBQWdEMEMsR0FBaEQsQ0FBb0QsUUFBcEQ7QUFFRCxHQXhFRCxNQXdFTztBQUNMdkIsWUFBUUMsS0FBUixDQUFjLGtDQUFkO0FBQ0FELFlBQVFDLEtBQVIsQ0FBYyx5QkFBZCxFQUF5Q2hCLGVBQWV1QyxJQUFmLENBQW9CLElBQXBCLENBQXpDO0FBQ0Q7O0FBRUQ7QUFDQSxPQUFLeEMsRUFBTCxDQUFRLE1BQVIsRUFBZ0IsWUFBVztBQUN6QjtBQUNBLFFBQUksc0JBQVlILEtBQWhCLEVBQXVCO0FBQ3JCLHlCQUFTd0MsUUFBVCxHQUFvQkMsR0FBcEIsV0FBZ0N6QyxLQUFoQyxjQUFnRDBDLEdBQWhELENBQW9ELFNBQXBEO0FBQ0Q7O0FBRUQ7QUFDQSxRQUFJM0MsT0FBSixFQUFhO0FBQ1hBLGNBQVE2QyxHQUFSO0FBQ0Q7QUFDRixHQVZEOztBQVlBO0FBQ0EsT0FBS0MsSUFBTCxDQUFVQyxNQUFWLENBQWlCLEVBQWpCO0FBQ0QsQ0E5R0QiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmFzcGkgZnJvbSAncmFzcGktaW8nO1xuaW1wb3J0IGZpdmUgZnJvbSAnam9obm55LWZpdmUnO1xuaW1wb3J0IGNvbmZpZyBmcm9tICdjb25maWcnO1xuaW1wb3J0IGZpcmViYXNlIGZyb20gJ2ZpcmViYXNlJztcblxuLy8gc3VwcG9ydGVkIGRpc3BsYXlzXG5pbXBvcnQgU3NkMTMwNiBmcm9tICdkaXNwbGF5L3NzZDEzMDYnO1xuaW1wb3J0IERpc3BsYXlUb2dnbGUgZnJvbSAnZGlzcGxheS9kaXNwbGF5LXRvZ2dsZSc7XG5cbi8vIHN1cHBvcnRlZCBzZW5zb3JzXG5pbXBvcnQgQW0yMzAyIGZyb20gJ3NlbnNvcnMvYW0yMzAyJztcbmltcG9ydCBEczE4YjIwIGZyb20gJ3NlbnNvcnMvZHMxOGIyMCc7XG5pbXBvcnQgRmxvd01ldGVyIGZyb20gJ3NlbnNvcnMvZmxvdy1tZXRlcic7XG5cbi8vIHNldHVwIGJvYXJkXG5jb25zdCBib2FyZCA9IG5ldyBmaXZlLkJvYXJkKHtcbiAgaW86IG5ldyByYXNwaSgpXG59KTtcblxuLy8gZGlzcGxheSAtIG9wdGlvbmFsXG5sZXQgZGlzcGxheSA9IG51bGw7XG5cbi8vIGZpcmViYXNlIGh1YiBpZFxubGV0IGh1YklkID0gbnVsbDtcblxuLy8gaGFyZHdhcmVcbmxldCBzZW5zb3JzID0gW107XG5sZXQgdGFwcyA9IFtdO1xuXG4vLyBzZXR1cCBodWJcbmJvYXJkLm9uKCdyZWFkeScsIGZ1bmN0aW9uKCkge1xuXG4gIC8vIHJlcXVpcmVkIGtleXMgZm9yIGh1YiBjb25maWd1cmF0aW9uXG4gIGNvbnN0IHJlcXVpcmVkQ29uZmlnID0gW1xuICAgICdodWIuaWQnLFxuICAgICdmaXJlYmFzZScsXG4gICAgJ2ZpcmViYXNlLmFwaUtleScsXG4gICAgJ2ZpcmViYXNlLmF1dGhEb21haW4nLFxuICAgICdmaXJlYmFzZS5kYXRhYmFzZVVSTCcsXG4gICAgJ2ZpcmViYXNlLnN0b3JhZ2VCdWNrZXQnLFxuICAgICdmaXJlYmFzZS5zZXJ2aWNlQWNjb3VudFBhdGgnXG4gIF07XG5cbiAgLy8gY2hlY2sgaWYgYWxsIGtleXMgc2V0XG4gIGNvbnN0IHJlcXVpcmVkTWV0ID0gcmVxdWlyZWRDb25maWcubWFwKChrZXkpID0+IHtcbiAgICByZXR1cm4gY29uZmlnLmhhcyhrZXkpO1xuICB9KTtcblxuICBpZiAocmVxdWlyZWRNZXQuaW5kZXhPZihmYWxzZSkgPT09IC0xKSB7XG4gICAgaHViSWQgPSBjb25maWcuZ2V0KCdodWIuaWQnKTtcbiAgICBjb25zdCBmaXJlYmFzZUNvbmZpZyA9IGNvbmZpZy5nZXQoJ2ZpcmViYXNlJyk7XG5cbiAgICAvLyBpbml0aWFsaXplIGZpcmViYXNlXG4gICAgZmlyZWJhc2UuaW5pdGlhbGl6ZUFwcCh7XG4gICAgICBhcGlLZXk6IGZpcmViYXNlQ29uZmlnLmdldCgnYXBpS2V5JyksXG4gICAgICBhdXRoRG9tYWluOiBmaXJlYmFzZUNvbmZpZy5nZXQoJ2F1dGhEb21haW4nKSxcbiAgICAgIGRhdGFiYXNlVVJMOiBmaXJlYmFzZUNvbmZpZy5nZXQoJ2RhdGFiYXNlVVJMJyksXG4gICAgICBzdG9yYWdlQnVja2V0OiBmaXJlYmFzZUNvbmZpZy5nZXQoJ3N0b3JhZ2VCdWNrZXQnKSxcbiAgICAgIHNlcnZpY2VBY2NvdW50OiBmaXJlYmFzZUNvbmZpZy5nZXQoJ3NlcnZpY2VBY2NvdW50UGF0aCcpXG4gICAgfSk7XG5cbiAgICAvLyBzZXR1cCBkaXNwbGF5IC0gb3B0aW9uYWxcbiAgICBpZiAoY29uZmlnLmhhcygnaHViLmRpc3BsYXknKSAmJiBjb25maWcuaGFzKCdodWIuZGlzcGxheS50eXBlJykpIHtcbiAgICAgIGNvbnN0IHR5cGUgPSBjb25maWcuZ2V0KCdodWIuZGlzcGxheS50eXBlJyk7XG4gICAgICBpZiAodHlwZSA9PT0gJ3NzZDEzMDYnKSB7XG4gICAgICAgIGRpc3BsYXkgPSBuZXcgU3NkMTMwNihib2FyZCwgZml2ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKGB1bnN1cHBvcnRlZCBkaXNwbGF5OiAke3R5cGV9LmApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ25vIGRpc3BsYXkgY29uZmlndXJlZC4nKTtcbiAgICB9XG5cbiAgICAvLyBzZXR1cCBkaXNwbGF5IHRvZ2dsZSAtIG9wdGlvbmFsXG4gICAgaWYgKGRpc3BsYXkgJiYgY29uZmlnLmhhcygnaHViLmRpc3BsYXkudG9nZ2xlJykpIHtcbiAgICAgIGNvbnN0IHRvZ2dsZVBpbiA9IGNvbmZpZy5nZXQoJ2h1Yi5kaXNwbGF5LnRvZ2dsZScpO1xuICAgICAgbmV3IERpc3BsYXlUb2dnbGUoZml2ZSwgdG9nZ2xlUGluLCBkaXNwbGF5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdubyBkaXNwbGF5IHRvZ2dsZSBjb25maWd1cmVkLicpO1xuICAgIH1cblxuICAgIC8vIHNldHVwIHNlbnNvcnMgLSBvcHRpb25hbFxuICAgIGlmIChjb25maWcuaGFzKCdodWIuc2Vuc29ycycpKSB7XG4gICAgICBjb25zdCBzZW5zb3JDb25maWcgPSBjb25maWcuZ2V0KCdodWIuc2Vuc29ycycpO1xuICAgICAgc2Vuc29yQ29uZmlnLmZvckVhY2goKHMpID0+IHtcbiAgICAgICAgaWYgKHMudHlwZSA9PT0gJ2FtMjMwMicpIHtcbiAgICAgICAgICAvLyBhbTIzMDIgdGVtcGVyYXR1cmUgc2Vuc29yXG4gICAgICAgICAgc2Vuc29ycy5wdXNoKG5ldyBBbTIzMDIoZmlyZWJhc2UsIHMuaWQsIHMucGluLCBzLnBvbGxpbmcpKTtcblxuICAgICAgICB9IGVsc2UgaWYgKHMudHlwZSA9PT0gJ2RzMThiMjAnKSB7XG4gICAgICAgICAgLy8gZHMxOGIyMCB0ZW1wZXJhdHVyZSBzZW5zb3JcbiAgICAgICAgICBzZW5zb3JzLnB1c2gobmV3IERzMThiMjAoZmlyZWJhc2UsIHMuaWQsIHMuYWRkcmVzcywgcy5wb2xsaW5nKSk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGB1bnN1cHBvcnRlZCBzZW5zb3IgdHlwZTogJHtzLnR5cGV9LmApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdubyBzZW5zb3IgY29uZmlndXJhdGlvbiBmb3VuZC4nKTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhgJHtzZW5zb3JzLmxlbmd0aH0gc2Vuc29ycyBjb25maWd1cmVkLmApO1xuXG4gICAgLy8gc2V0dXAgZmxvdyBtZXRlcnMgLSB0ZWNobmljYWxseSBvcHRpb25hbFxuICAgIGlmIChjb25maWcuaGFzKCdodWIudGFwcycpKSB7XG4gICAgICBjb25zdCB0YXBDb25maWcgPSBjb25maWcuZ2V0KCdodWIudGFwcycpO1xuICAgICAgdGFwQ29uZmlnLmZvckVhY2goKHQpID0+IHtcbiAgICAgICAgY29uc3QgZiA9IG5ldyBmaXZlLlNlbnNvci5EaWdpdGFsKHQucGluKTtcbiAgICAgICAgY29uc3QgZmxvdyA9IG5ldyBGbG93TWV0ZXIoZmlyZWJhc2UsIHQuaWQsIGYsIGRpc3BsYXkpO1xuICAgICAgICB0YXBzLnB1c2goZmxvdyk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdubyB0YXAgY29uZmlndXJhdGlvbiBmb3VuZC4nKTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmluZm8oYCR7dGFwcy5sZW5ndGh9IHRhcHMgY29uZmlndXJlZC5gKTtcblxuICAgIC8vIHNldCBodWIgdG8gb25saW5lXG4gICAgZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoYGh1YnMvJHtodWJJZH0vc3RhdHVzYCkuc2V0KCdvbmxpbmUnKTtcblxuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2h1YiBpcyBub3QgY29uZmlndXJlZCBjb3JyZWN0bHkuJyk7XG4gICAgY29uc29sZS5lcnJvcigncmVxdWlyZWQgY29uZmlndXJhdGlvbjonLCByZXF1aXJlZENvbmZpZy5qb2luKCcsICcpKTtcbiAgfVxuXG4gIC8vIG9uIHNodXRkb3duXG4gIHRoaXMub24oJ2V4aXQnLCBmdW5jdGlvbigpIHtcbiAgICAvLyBub3RpZnkgYXBwbGljYXRpb25cbiAgICBpZiAoZmlyZWJhc2UgJiYgaHViSWQpIHtcbiAgICAgIGZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGBodWJzLyR7aHViSWR9L3N0YXR1c2ApLnNldCgnb2ZmbGluZScpO1xuICAgIH1cblxuICAgIC8vIHR1cm4gb2ZmIGRpc3BsYXkgaGFyZHdhcmVcbiAgICBpZiAoZGlzcGxheSkge1xuICAgICAgZGlzcGxheS5vZmYoKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIGhlbHBlcnMgdG8gYWRkIHRvIFJFUExcbiAgdGhpcy5yZXBsLmluamVjdCh7IH0pO1xufSk7XG4iXX0=