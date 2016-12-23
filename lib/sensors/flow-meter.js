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

// an arbitrary adjustment value from flow to ounces
var calibration = 20.11338;

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
      var currentTime = Date.now();
      _this._clickDelta = Math.max([currentTime - _this._lastPulse], 1);
      if (_this._clickDelta < 1000) {
        _this._hertz = msPerSecond / _this._clickDelta;
        _this._flow = _this._hertz / (60 * 7.5);
        var p = _this._flow * (_this._clickDelta / msPerSecond) * calibration;
        _this._totalPour += Math.round(p * 100) / 100;
        setTimeout(function () {
          var now = Date.now();
          if (now - _this._lastPulse >= msPerSecond && _this._totalPour > threshold) {
            var message = id + ' poured: ' + _this._totalPour + ' oz';
            _get(Object.getPrototypeOf(FlowMeter.prototype), 'report', _this).call(_this, message);

            // report to firebase
            _this.logPour(ounces);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZW5zb3JzL2Zsb3ctbWV0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7QUFFQTtBQUNBLElBQU0sWUFBWSxLQUFsQjtBQUNBLElBQU0sY0FBYyxJQUFwQjs7QUFFQTtBQUNBLElBQU0sY0FBYyxRQUFwQjs7QUFFQTs7O0lBRXFCLFM7OztBQUVuQixxQkFBWSxRQUFaLEVBQXNCLEVBQXRCLEVBQTBCLFVBQTFCLEVBQXNEO0FBQUEsUUFBaEIsT0FBZ0IseURBQU4sSUFBTTs7QUFBQTs7QUFBQTs7QUFFcEQsVUFBSyxTQUFMLEdBQWlCLFFBQWpCO0FBQ0EsVUFBSyxHQUFMLEdBQVcsRUFBWDtBQUNBLFVBQUssT0FBTCxHQUFlLFVBQWY7QUFDQSxVQUFLLFFBQUwsR0FBZ0IsT0FBaEI7O0FBRUEsVUFBSyxVQUFMLEdBQWtCLEtBQUssR0FBTCxFQUFsQjtBQUNBLFVBQUssTUFBTCxHQUFjLENBQWQ7QUFDQSxVQUFLLEtBQUwsR0FBYSxDQUFiO0FBQ0EsVUFBSyxVQUFMLEdBQWtCLENBQWxCOztBQUVBLFVBQUssT0FBTCxDQUFhLEVBQWIsQ0FBZ0IsUUFBaEIsRUFBMEIsVUFBQyxLQUFELEVBQVc7QUFDbkMsVUFBSSxjQUFjLEtBQUssR0FBTCxFQUFsQjtBQUNBLFlBQUssV0FBTCxHQUFtQixLQUFLLEdBQUwsQ0FBUyxDQUFDLGNBQWMsTUFBSyxVQUFwQixDQUFULEVBQTBDLENBQTFDLENBQW5CO0FBQ0EsVUFBSSxNQUFLLFdBQUwsR0FBbUIsSUFBdkIsRUFBNkI7QUFDM0IsY0FBSyxNQUFMLEdBQWMsY0FBYyxNQUFLLFdBQWpDO0FBQ0EsY0FBSyxLQUFMLEdBQWEsTUFBSyxNQUFMLElBQWUsS0FBSyxHQUFwQixDQUFiO0FBQ0EsWUFBSSxJQUFLLE1BQUssS0FBTCxJQUFjLE1BQUssV0FBTCxHQUFtQixXQUFqQyxDQUFELEdBQWtELFdBQTFEO0FBQ0EsY0FBSyxVQUFMLElBQW1CLEtBQUssS0FBTCxDQUFXLElBQUksR0FBZixJQUFzQixHQUF6QztBQUNBLG1CQUFXLFlBQU07QUFDZixjQUFJLE1BQU0sS0FBSyxHQUFMLEVBQVY7QUFDQSxjQUFLLE1BQU0sTUFBSyxVQUFaLElBQTJCLFdBQTNCLElBQ0MsTUFBSyxVQUFMLEdBQWtCLFNBRHZCLEVBRUU7QUFDQSxnQkFBTSxVQUFhLEVBQWIsaUJBQTJCLE1BQUssVUFBaEMsUUFBTjtBQUNBLDBGQUFhLE9BQWI7O0FBRUE7QUFDQSxrQkFBSyxPQUFMLENBQWEsTUFBYjs7QUFFQTtBQUNBLGdCQUFJLE1BQUssUUFBTCxJQUFpQixNQUFLLFFBQUwsQ0FBYyxPQUFkLEVBQXJCLEVBQThDO0FBQzVDLG9CQUFLLFFBQUwsQ0FBYyxLQUFkLENBQW9CLE9BQXBCO0FBQ0EseUJBQVcsWUFBTTtBQUNmLHNCQUFLLFFBQUwsQ0FBYyxLQUFkO0FBQ0QsZUFGRCxFQUVHLEdBRkg7QUFHRDs7QUFFRDtBQUNBLGtCQUFLLFVBQUwsR0FBa0IsQ0FBbEI7QUFDRDtBQUNGLFNBdEJELEVBc0JHLElBdEJIO0FBdUJEOztBQUVELFlBQUssVUFBTCxHQUFrQixXQUFsQjtBQUNELEtBbENEO0FBWm9EO0FBK0NyRDs7QUFFRDs7Ozs7NEJBQ1EsTSxFQUFRO0FBQUE7O0FBQ2Q7QUFDQSxXQUFLLFNBQUwsQ0FBZSxRQUFmLEdBQTBCLEdBQTFCLFdBQXNDLEtBQUssR0FBM0MsRUFBa0QsSUFBbEQsQ0FBdUQsT0FBdkQsRUFBZ0UsSUFBaEUsQ0FBcUUsVUFBQyxRQUFELEVBQWM7QUFDakYsWUFBTSxPQUFPLFNBQVMsR0FBVCxHQUFlLElBQTVCO0FBQ0EsWUFBTSxXQUFXO0FBQ2YsZ0JBQU0sSUFEUztBQUVmLGtCQUFRLE1BRk87QUFHZixtQkFBVSxJQUFJLElBQUosRUFBRCxDQUFhLE9BQWI7QUFITSxTQUFqQjs7QUFNQTtBQUNBLFlBQU0sT0FBTyxPQUFLLFNBQUwsQ0FBZSxRQUFmLEdBQTBCLEdBQTFCLFVBQXVDLElBQXZDLENBQTRDLFFBQTVDLEVBQXNELEdBQW5FO0FBQ0EsZUFBSyxTQUFMLENBQWUsUUFBZixHQUEwQixHQUExQixZQUF1QyxJQUF2QyxlQUFxRCxJQUFyRCxFQUE2RCxHQUE3RCxDQUFpRSxJQUFqRTtBQUNELE9BWEQ7QUFZRDs7Ozs7O2tCQWxFa0IsUyIsImZpbGUiOiJmbG93LW1ldGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEh1YlNlbnNvciBmcm9tICdzZW5zb3JzL2h1Yi1zZW5zb3InO1xuXG4vLyB0aHJlc2hvbGQgaXMgdG8gYXZvaWQgc2xpZ2h0IG1vdmVtZW50cyBpbiBmbG93IG1ldGVyXG5jb25zdCB0aHJlc2hvbGQgPSAwLjA3NTtcbmNvbnN0IG1zUGVyU2Vjb25kID0gMTAwMDtcblxuLy8gYW4gYXJiaXRyYXJ5IGFkanVzdG1lbnQgdmFsdWUgZnJvbSBmbG93IHRvIG91bmNlc1xuY29uc3QgY2FsaWJyYXRpb24gPSAyMC4xMTMzODtcblxuLypcbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGbG93TWV0ZXIgZXh0ZW5kcyBIdWJTZW5zb3Ige1xuXG4gIGNvbnN0cnVjdG9yKGZpcmViYXNlLCBpZCwgZml2ZVNlbnNvciwgZGlzcGxheSA9IG51bGwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2ZpcmViYXNlID0gZmlyZWJhc2U7XG4gICAgdGhpcy5faWQgPSBpZDtcbiAgICB0aGlzLl9zZW5zb3IgPSBmaXZlU2Vuc29yO1xuICAgIHRoaXMuX2Rpc3BsYXkgPSBkaXNwbGF5O1xuXG4gICAgdGhpcy5fbGFzdFB1bHNlID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLl9oZXJ0eiA9IDA7XG4gICAgdGhpcy5fZmxvdyA9IDA7XG4gICAgdGhpcy5fdG90YWxQb3VyID0gMDtcbiAgICBcbiAgICB0aGlzLl9zZW5zb3Iub24oJ2NoYW5nZScsICh2YWx1ZSkgPT4ge1xuICAgICAgbGV0IGN1cnJlbnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgIHRoaXMuX2NsaWNrRGVsdGEgPSBNYXRoLm1heChbY3VycmVudFRpbWUgLSB0aGlzLl9sYXN0UHVsc2VdLCAxKTtcbiAgICAgIGlmICh0aGlzLl9jbGlja0RlbHRhIDwgMTAwMCkge1xuICAgICAgICB0aGlzLl9oZXJ0eiA9IG1zUGVyU2Vjb25kIC8gdGhpcy5fY2xpY2tEZWx0YTtcbiAgICAgICAgdGhpcy5fZmxvdyA9IHRoaXMuX2hlcnR6IC8gKDYwICogNy41KTtcbiAgICAgICAgbGV0IHAgPSAodGhpcy5fZmxvdyAqICh0aGlzLl9jbGlja0RlbHRhIC8gbXNQZXJTZWNvbmQpKSAqIGNhbGlicmF0aW9uO1xuICAgICAgICB0aGlzLl90b3RhbFBvdXIgKz0gTWF0aC5yb3VuZChwICogMTAwKSAvIDEwMDtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgbGV0IG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgICAgaWYgKChub3cgLSB0aGlzLl9sYXN0UHVsc2UpID49IG1zUGVyU2Vjb25kIFxuICAgICAgICAgICAgJiYgdGhpcy5fdG90YWxQb3VyID4gdGhyZXNob2xkXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gYCR7aWR9IHBvdXJlZDogJHt0aGlzLl90b3RhbFBvdXJ9IG96YDtcbiAgICAgICAgICAgIHN1cGVyLnJlcG9ydChtZXNzYWdlKTtcbiAgICAgIFxuICAgICAgICAgICAgLy8gcmVwb3J0IHRvIGZpcmViYXNlXG4gICAgICAgICAgICB0aGlzLmxvZ1BvdXIob3VuY2VzKTtcbiAgICAgIFxuICAgICAgICAgICAgLy8gd3JpdGUgdG8gZGlzcGxheVxuICAgICAgICAgICAgaWYgKHRoaXMuX2Rpc3BsYXkgJiYgdGhpcy5fZGlzcGxheS5nZXRJc09uKCkpIHtcbiAgICAgICAgICAgICAgdGhpcy5fZGlzcGxheS53cml0ZShtZXNzYWdlKTtcbiAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGlzcGxheS5jbGVhcigpO1xuICAgICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyByZXNldFxuICAgICAgICAgICAgdGhpcy5fdG90YWxQb3VyID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgfVxuICAgICAgXG4gICAgICB0aGlzLl9sYXN0UHVsc2UgPSBjdXJyZW50VGltZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIHNhdmUgdGhlIGxhc3QgcG91clxuICBsb2dQb3VyKG91bmNlcykge1xuICAgIC8vIGdldCBiZWVyIGlkIGZvciByZWxhdGlvbnNoaXBcbiAgICB0aGlzLl9maXJlYmFzZS5kYXRhYmFzZSgpLnJlZihgdGFwcy8ke3RoaXMuX2lkfWApLm9uY2UoJ3ZhbHVlJykudGhlbigoc25hcHNob3QpID0+IHtcbiAgICAgIGNvbnN0IGJlZXIgPSBzbmFwc2hvdC52YWwoKS5iZWVyO1xuICAgICAgY29uc3QgcG91ckRhdGEgPSB7XG4gICAgICAgIGJlZXI6IGJlZXIsXG4gICAgICAgIG91bmNlczogb3VuY2VzLFxuICAgICAgICBjcmVhdGVkOiAobmV3IERhdGUoKSkuZ2V0VGltZSgpXG4gICAgICB9O1xuXG4gICAgICAvLyByZWNvcmQgcG91ciBmb3IgYmVlclxuICAgICAgY29uc3QgcG91ciA9IHRoaXMuX2ZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGBwb3Vyc2ApLnB1c2gocG91ckRhdGEpLmtleTtcbiAgICAgIHRoaXMuX2ZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGBiZWVycy8ke2JlZXJ9L3BvdXJzLyR7cG91cn1gKS5zZXQodHJ1ZSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==