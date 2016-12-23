'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _hubSensor = require('sensors/hub-sensor');

var _hubSensor2 = _interopRequireDefault(_hubSensor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// threshold is to avoid slight movements in flow meter
var threshold = 0.075;
var msPerSecond = 1000;

// TODO
var calibration = 21.11338;

/*

*/

var FlowMeter = function (_HubSensor) {
  _inherits(FlowMeter, _HubSensor);

  function FlowMeter(firebase, id, fiveSensor) {
    var display = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

    _classCallCheck(this, FlowMeter);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FlowMeter).call(this));

    _this._firebase = firebase;
    _this._id = id;
    _this._sensor = fiveSensor;
    _this._display = display;

    _this._lastPulse = Date.now();
    _this._hertz = 0;
    _this._flow = 0;
    _this._totalPour = 0;

    _this._sensor.on('change', function (value) {
      if (!value) {
        return;
      }

      var currentTime = Date.now();
      _this._clickDelta = Math.max([currentTime - _this._lastPulse], 1);
      if (_this._clickDelta < 1000) {
        _this._hertz = msPerSecond / _this._clickDelta;
        _this._flow = _this._hertz / (60 * 7.5);
        var p = _this._flow * (_this._clickDelta / msPerSecond) * calibration;
        _this._totalPour += p;
        console.log(id + ' poured: ' + _this._totalPour);
        setTimeout(function () {
          var now = Date.now();
          console.log(id + ' last: ' + _this._lastPulse + ' now: ' + now + ' poured: ' + _this._totalPour);
          if (now - _this._lastPulse >= msPerSecond && _this._totalPour > threshold) {
            var message = id + ' poured: ' + _this._totalPour + ' oz';
            _get(Object.getPrototypeOf(FlowMeter.prototype), 'report', _this).call(_this, message);

            // report to firebase
            // this.logPour(ounces);

            // write to display
            if (_this._display && _this._display.getIsOn()) {
              _this._display.write(message);
              setTimeout(function () {
                _this._display.clear();
              }, 500);
            }

            // reset
            _this._totalPour = 0;
          }
        }, 1000);
      }

      _this._lastPulse = currentTime;
    });
    return _this;
  }

  // save the last pour


  _createClass(FlowMeter, [{
    key: 'logPour',
    value: function logPour(ounces) {
      var _this2 = this;

      // get beer id for relationship
      this._firebase.database().ref('taps/' + this._id).once('value').then(function (snapshot) {
        var beer = snapshot.val().beer;
        var pourData = {
          beer: beer,
          ounces: ounces,
          created: new Date().getTime()
        };

        // record pour for beer
        var pour = _this2._firebase.database().ref('pours').push(pourData).key;
        _this2._firebase.database().ref('beers/' + beer + '/pours/' + pour).set(true);
      });
    }
  }]);

  return FlowMeter;
}(_hubSensor2.default);

exports.default = FlowMeter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZW5zb3JzL2Zsb3ctbWV0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7QUFFQTtBQUNBLElBQU0sWUFBWSxLQUFsQjtBQUNBLElBQU0sY0FBYyxJQUFwQjs7QUFFQTtBQUNBLElBQU0sY0FBYyxRQUFwQjs7QUFFQTs7OztJQUdxQixTOzs7QUFFbkIscUJBQVksUUFBWixFQUFzQixFQUF0QixFQUEwQixVQUExQixFQUFzRDtBQUFBLFFBQWhCLE9BQWdCLHlEQUFOLElBQU07O0FBQUE7O0FBQUE7O0FBRXBELFVBQUssU0FBTCxHQUFpQixRQUFqQjtBQUNBLFVBQUssR0FBTCxHQUFXLEVBQVg7QUFDQSxVQUFLLE9BQUwsR0FBZSxVQUFmO0FBQ0EsVUFBSyxRQUFMLEdBQWdCLE9BQWhCOztBQUVBLFVBQUssVUFBTCxHQUFrQixLQUFLLEdBQUwsRUFBbEI7QUFDQSxVQUFLLE1BQUwsR0FBYyxDQUFkO0FBQ0EsVUFBSyxLQUFMLEdBQWEsQ0FBYjtBQUNBLFVBQUssVUFBTCxHQUFrQixDQUFsQjs7QUFFQSxVQUFLLE9BQUwsQ0FBYSxFQUFiLENBQWdCLFFBQWhCLEVBQTBCLFVBQUMsS0FBRCxFQUFXO0FBQ25DLFVBQUksQ0FBQyxLQUFMLEVBQVk7QUFDVjtBQUNEOztBQUVELFVBQUksY0FBYyxLQUFLLEdBQUwsRUFBbEI7QUFDQSxZQUFLLFdBQUwsR0FBbUIsS0FBSyxHQUFMLENBQVMsQ0FBQyxjQUFjLE1BQUssVUFBcEIsQ0FBVCxFQUEwQyxDQUExQyxDQUFuQjtBQUNBLFVBQUksTUFBSyxXQUFMLEdBQW1CLElBQXZCLEVBQTZCO0FBQzNCLGNBQUssTUFBTCxHQUFjLGNBQWMsTUFBSyxXQUFqQztBQUNBLGNBQUssS0FBTCxHQUFhLE1BQUssTUFBTCxJQUFlLEtBQUssR0FBcEIsQ0FBYjtBQUNBLFlBQUksSUFBSyxNQUFLLEtBQUwsSUFBYyxNQUFLLFdBQUwsR0FBbUIsV0FBakMsQ0FBRCxHQUFrRCxXQUExRDtBQUNBLGNBQUssVUFBTCxJQUFtQixDQUFuQjtBQUNBLGdCQUFRLEdBQVIsQ0FBZSxFQUFmLGlCQUE2QixNQUFLLFVBQWxDO0FBQ0EsbUJBQVcsWUFBTTtBQUNmLGNBQUksTUFBTSxLQUFLLEdBQUwsRUFBVjtBQUNBLGtCQUFRLEdBQVIsQ0FBZSxFQUFmLGVBQTJCLE1BQUssVUFBaEMsY0FBbUQsR0FBbkQsaUJBQWtFLE1BQUssVUFBdkU7QUFDQSxjQUFLLE1BQU0sTUFBSyxVQUFaLElBQTJCLFdBQTNCLElBQ0MsTUFBSyxVQUFMLEdBQWtCLFNBRHZCLEVBRUU7QUFDQSxnQkFBTSxVQUFhLEVBQWIsaUJBQTJCLE1BQUssVUFBaEMsUUFBTjtBQUNBLDBGQUFhLE9BQWI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGdCQUFJLE1BQUssUUFBTCxJQUFpQixNQUFLLFFBQUwsQ0FBYyxPQUFkLEVBQXJCLEVBQThDO0FBQzVDLG9CQUFLLFFBQUwsQ0FBYyxLQUFkLENBQW9CLE9BQXBCO0FBQ0EseUJBQVcsWUFBTTtBQUNmLHNCQUFLLFFBQUwsQ0FBYyxLQUFkO0FBQ0QsZUFGRCxFQUVHLEdBRkg7QUFHRDs7QUFFRDtBQUNBLGtCQUFLLFVBQUwsR0FBa0IsQ0FBbEI7QUFDRDtBQUNGLFNBdkJELEVBdUJHLElBdkJIO0FBd0JEOztBQUVELFlBQUssVUFBTCxHQUFrQixXQUFsQjtBQUNELEtBeENEO0FBWm9EO0FBcURyRDs7QUFFRDs7Ozs7NEJBQ1EsTSxFQUFRO0FBQUE7O0FBQ2Q7QUFDQSxXQUFLLFNBQUwsQ0FBZSxRQUFmLEdBQTBCLEdBQTFCLFdBQXNDLEtBQUssR0FBM0MsRUFBa0QsSUFBbEQsQ0FBdUQsT0FBdkQsRUFBZ0UsSUFBaEUsQ0FBcUUsVUFBQyxRQUFELEVBQWM7QUFDakYsWUFBTSxPQUFPLFNBQVMsR0FBVCxHQUFlLElBQTVCO0FBQ0EsWUFBTSxXQUFXO0FBQ2YsZ0JBQU0sSUFEUztBQUVmLGtCQUFRLE1BRk87QUFHZixtQkFBVSxJQUFJLElBQUosRUFBRCxDQUFhLE9BQWI7QUFITSxTQUFqQjs7QUFNQTtBQUNBLFlBQU0sT0FBTyxPQUFLLFNBQUwsQ0FBZSxRQUFmLEdBQTBCLEdBQTFCLFVBQXVDLElBQXZDLENBQTRDLFFBQTVDLEVBQXNELEdBQW5FO0FBQ0EsZUFBSyxTQUFMLENBQWUsUUFBZixHQUEwQixHQUExQixZQUF1QyxJQUF2QyxlQUFxRCxJQUFyRCxFQUE2RCxHQUE3RCxDQUFpRSxJQUFqRTtBQUNELE9BWEQ7QUFZRDs7Ozs7O2tCQXhFa0IsUyIsImZpbGUiOiJmbG93LW1ldGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEh1YlNlbnNvciBmcm9tICdzZW5zb3JzL2h1Yi1zZW5zb3InO1xuXG4vLyB0aHJlc2hvbGQgaXMgdG8gYXZvaWQgc2xpZ2h0IG1vdmVtZW50cyBpbiBmbG93IG1ldGVyXG5jb25zdCB0aHJlc2hvbGQgPSAwLjA3NTtcbmNvbnN0IG1zUGVyU2Vjb25kID0gMTAwMDtcblxuLy8gVE9ET1xuY29uc3QgY2FsaWJyYXRpb24gPSAyMS4xMTMzODtcblxuLypcblxuKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZsb3dNZXRlciBleHRlbmRzIEh1YlNlbnNvciB7XG5cbiAgY29uc3RydWN0b3IoZmlyZWJhc2UsIGlkLCBmaXZlU2Vuc29yLCBkaXNwbGF5ID0gbnVsbCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fZmlyZWJhc2UgPSBmaXJlYmFzZTtcbiAgICB0aGlzLl9pZCA9IGlkO1xuICAgIHRoaXMuX3NlbnNvciA9IGZpdmVTZW5zb3I7XG4gICAgdGhpcy5fZGlzcGxheSA9IGRpc3BsYXk7XG5cbiAgICB0aGlzLl9sYXN0UHVsc2UgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMuX2hlcnR6ID0gMDtcbiAgICB0aGlzLl9mbG93ID0gMDtcbiAgICB0aGlzLl90b3RhbFBvdXIgPSAwO1xuICAgIFxuICAgIHRoaXMuX3NlbnNvci5vbignY2hhbmdlJywgKHZhbHVlKSA9PiB7XG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgbGV0IGN1cnJlbnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgIHRoaXMuX2NsaWNrRGVsdGEgPSBNYXRoLm1heChbY3VycmVudFRpbWUgLSB0aGlzLl9sYXN0UHVsc2VdLCAxKTtcbiAgICAgIGlmICh0aGlzLl9jbGlja0RlbHRhIDwgMTAwMCkge1xuICAgICAgICB0aGlzLl9oZXJ0eiA9IG1zUGVyU2Vjb25kIC8gdGhpcy5fY2xpY2tEZWx0YTtcbiAgICAgICAgdGhpcy5fZmxvdyA9IHRoaXMuX2hlcnR6IC8gKDYwICogNy41KTtcbiAgICAgICAgbGV0IHAgPSAodGhpcy5fZmxvdyAqICh0aGlzLl9jbGlja0RlbHRhIC8gbXNQZXJTZWNvbmQpKSAqIGNhbGlicmF0aW9uO1xuICAgICAgICB0aGlzLl90b3RhbFBvdXIgKz0gcDtcbiAgICAgICAgY29uc29sZS5sb2coYCR7aWR9IHBvdXJlZDogJHt0aGlzLl90b3RhbFBvdXJ9YCk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGxldCBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGAke2lkfSBsYXN0OiAke3RoaXMuX2xhc3RQdWxzZX0gbm93OiAke25vd30gcG91cmVkOiAke3RoaXMuX3RvdGFsUG91cn1gKTtcbiAgICAgICAgICBpZiAoKG5vdyAtIHRoaXMuX2xhc3RQdWxzZSkgPj0gbXNQZXJTZWNvbmQgXG4gICAgICAgICAgICAmJiB0aGlzLl90b3RhbFBvdXIgPiB0aHJlc2hvbGRcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBgJHtpZH0gcG91cmVkOiAke3RoaXMuX3RvdGFsUG91cn0gb3pgO1xuICAgICAgICAgICAgc3VwZXIucmVwb3J0KG1lc3NhZ2UpO1xuICAgICAgXG4gICAgICAgICAgICAvLyByZXBvcnQgdG8gZmlyZWJhc2VcbiAgICAgICAgICAgIC8vIHRoaXMubG9nUG91cihvdW5jZXMpO1xuICAgICAgXG4gICAgICAgICAgICAvLyB3cml0ZSB0byBkaXNwbGF5XG4gICAgICAgICAgICBpZiAodGhpcy5fZGlzcGxheSAmJiB0aGlzLl9kaXNwbGF5LmdldElzT24oKSkge1xuICAgICAgICAgICAgICB0aGlzLl9kaXNwbGF5LndyaXRlKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kaXNwbGF5LmNsZWFyKCk7XG4gICAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIHJlc2V0XG4gICAgICAgICAgICB0aGlzLl90b3RhbFBvdXIgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMTAwMCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHRoaXMuX2xhc3RQdWxzZSA9IGN1cnJlbnRUaW1lO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gc2F2ZSB0aGUgbGFzdCBwb3VyXG4gIGxvZ1BvdXIob3VuY2VzKSB7XG4gICAgLy8gZ2V0IGJlZXIgaWQgZm9yIHJlbGF0aW9uc2hpcFxuICAgIHRoaXMuX2ZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGB0YXBzLyR7dGhpcy5faWR9YCkub25jZSgndmFsdWUnKS50aGVuKChzbmFwc2hvdCkgPT4ge1xuICAgICAgY29uc3QgYmVlciA9IHNuYXBzaG90LnZhbCgpLmJlZXI7XG4gICAgICBjb25zdCBwb3VyRGF0YSA9IHtcbiAgICAgICAgYmVlcjogYmVlcixcbiAgICAgICAgb3VuY2VzOiBvdW5jZXMsXG4gICAgICAgIGNyZWF0ZWQ6IChuZXcgRGF0ZSgpKS5nZXRUaW1lKClcbiAgICAgIH07XG5cbiAgICAgIC8vIHJlY29yZCBwb3VyIGZvciBiZWVyXG4gICAgICBjb25zdCBwb3VyID0gdGhpcy5fZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoYHBvdXJzYCkucHVzaChwb3VyRGF0YSkua2V5O1xuICAgICAgdGhpcy5fZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoYGJlZXJzLyR7YmVlcn0vcG91cnMvJHtwb3VyfWApLnNldCh0cnVlKTtcbiAgICB9KTtcbiAgfVxufVxuIl19