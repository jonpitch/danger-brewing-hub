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

var threshold = 0.075;
var msPerSecond = 1000;
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
        setTimeout(function () {
          var now = Date.now();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZW5zb3JzL2Zsb3ctbWV0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNLFlBQVksS0FBbEI7QUFDQSxJQUFNLGNBQWMsSUFBcEI7QUFDQSxJQUFNLGNBQWMsUUFBcEI7O0FBRUE7Ozs7SUFHcUIsUzs7O0FBRW5CLHFCQUFZLFFBQVosRUFBc0IsRUFBdEIsRUFBMEIsVUFBMUIsRUFBc0Q7QUFBQSxRQUFoQixPQUFnQix5REFBTixJQUFNOztBQUFBOztBQUFBOztBQUVwRCxVQUFLLFNBQUwsR0FBaUIsUUFBakI7QUFDQSxVQUFLLEdBQUwsR0FBVyxFQUFYO0FBQ0EsVUFBSyxPQUFMLEdBQWUsVUFBZjtBQUNBLFVBQUssUUFBTCxHQUFnQixPQUFoQjs7QUFFQSxVQUFLLFVBQUwsR0FBa0IsS0FBSyxHQUFMLEVBQWxCO0FBQ0EsVUFBSyxNQUFMLEdBQWMsQ0FBZDtBQUNBLFVBQUssS0FBTCxHQUFhLENBQWI7QUFDQSxVQUFLLFVBQUwsR0FBa0IsQ0FBbEI7O0FBRUEsVUFBSyxPQUFMLENBQWEsRUFBYixDQUFnQixRQUFoQixFQUEwQixVQUFDLEtBQUQsRUFBVztBQUNuQyxVQUFJLENBQUMsS0FBTCxFQUFZO0FBQ1Y7QUFDRDs7QUFFRCxVQUFJLGNBQWMsS0FBSyxHQUFMLEVBQWxCO0FBQ0EsWUFBSyxXQUFMLEdBQW1CLEtBQUssR0FBTCxDQUFTLENBQUMsY0FBYyxNQUFLLFVBQXBCLENBQVQsRUFBMEMsQ0FBMUMsQ0FBbkI7QUFDQSxVQUFJLE1BQUssV0FBTCxHQUFtQixJQUF2QixFQUE2QjtBQUN6QixjQUFLLE1BQUwsR0FBYyxjQUFjLE1BQUssV0FBakM7QUFDQSxjQUFLLEtBQUwsR0FBYSxNQUFLLE1BQUwsSUFBZSxLQUFLLEdBQXBCLENBQWI7QUFDQSxZQUFJLElBQUssTUFBSyxLQUFMLElBQWMsTUFBSyxXQUFMLEdBQW1CLFdBQWpDLENBQUQsR0FBa0QsV0FBMUQ7QUFDQSxjQUFLLFVBQUwsSUFBbUIsQ0FBbkI7QUFDQSxtQkFBVyxZQUFNO0FBQ2YsY0FBSSxNQUFNLEtBQUssR0FBTCxFQUFWO0FBQ0EsY0FBSSxNQUFNLE1BQUssVUFBWCxJQUF5QixXQUF6QixJQUF3QyxNQUFLLFVBQUwsR0FBa0IsU0FBOUQsRUFBeUU7QUFDdkUsZ0JBQU0sVUFBYSxFQUFiLGlCQUEyQixNQUFLLFVBQWhDLFFBQU47QUFDQSwwRkFBYSxPQUFiOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBSSxNQUFLLFFBQUwsSUFBaUIsTUFBSyxRQUFMLENBQWMsT0FBZCxFQUFyQixFQUE4QztBQUM1QyxvQkFBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixPQUFwQjtBQUNBLHlCQUFXLFlBQU07QUFDZixzQkFBSyxRQUFMLENBQWMsS0FBZDtBQUNELGVBRkQsRUFFRyxHQUZIO0FBR0Q7O0FBRUQ7QUFDQSxrQkFBSyxVQUFMLEdBQWtCLENBQWxCO0FBQ0Q7QUFDRixTQXBCRCxFQW9CRyxJQXBCSDtBQXFCSDs7QUFFRCxZQUFLLFVBQUwsR0FBa0IsV0FBbEI7QUFDRCxLQXBDRDtBQVpvRDtBQWlEckQ7O0FBRUQ7Ozs7OzRCQUNRLE0sRUFBUTtBQUFBOztBQUNkO0FBQ0EsV0FBSyxTQUFMLENBQWUsUUFBZixHQUEwQixHQUExQixXQUFzQyxLQUFLLEdBQTNDLEVBQWtELElBQWxELENBQXVELE9BQXZELEVBQWdFLElBQWhFLENBQXFFLFVBQUMsUUFBRCxFQUFjO0FBQ2pGLFlBQU0sT0FBTyxTQUFTLEdBQVQsR0FBZSxJQUE1QjtBQUNBLFlBQU0sV0FBVztBQUNmLGdCQUFNLElBRFM7QUFFZixrQkFBUSxNQUZPO0FBR2YsbUJBQVUsSUFBSSxJQUFKLEVBQUQsQ0FBYSxPQUFiO0FBSE0sU0FBakI7O0FBTUE7QUFDQSxZQUFNLE9BQU8sT0FBSyxTQUFMLENBQWUsUUFBZixHQUEwQixHQUExQixVQUF1QyxJQUF2QyxDQUE0QyxRQUE1QyxFQUFzRCxHQUFuRTtBQUNBLGVBQUssU0FBTCxDQUFlLFFBQWYsR0FBMEIsR0FBMUIsWUFBdUMsSUFBdkMsZUFBcUQsSUFBckQsRUFBNkQsR0FBN0QsQ0FBaUUsSUFBakU7QUFDRCxPQVhEO0FBWUQ7Ozs7OztrQkFwRWtCLFMiLCJmaWxlIjoiZmxvdy1tZXRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBIdWJTZW5zb3IgZnJvbSAnc2Vuc29ycy9odWItc2Vuc29yJztcblxuY29uc3QgdGhyZXNob2xkID0gMC4wNzU7XG5jb25zdCBtc1BlclNlY29uZCA9IDEwMDA7XG5jb25zdCBjYWxpYnJhdGlvbiA9IDIxLjExMzM4O1xuXG4vKlxuXG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmxvd01ldGVyIGV4dGVuZHMgSHViU2Vuc29yIHtcblxuICBjb25zdHJ1Y3RvcihmaXJlYmFzZSwgaWQsIGZpdmVTZW5zb3IsIGRpc3BsYXkgPSBudWxsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9maXJlYmFzZSA9IGZpcmViYXNlO1xuICAgIHRoaXMuX2lkID0gaWQ7XG4gICAgdGhpcy5fc2Vuc29yID0gZml2ZVNlbnNvcjtcbiAgICB0aGlzLl9kaXNwbGF5ID0gZGlzcGxheTtcblxuICAgIHRoaXMuX2xhc3RQdWxzZSA9IERhdGUubm93KCk7XG4gICAgdGhpcy5faGVydHogPSAwO1xuICAgIHRoaXMuX2Zsb3cgPSAwO1xuICAgIHRoaXMuX3RvdGFsUG91ciA9IDA7XG4gICAgXG4gICAgdGhpcy5fc2Vuc29yLm9uKCdjaGFuZ2UnLCAodmFsdWUpID0+IHtcbiAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgICBsZXQgY3VycmVudFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgdGhpcy5fY2xpY2tEZWx0YSA9IE1hdGgubWF4KFtjdXJyZW50VGltZSAtIHRoaXMuX2xhc3RQdWxzZV0sIDEpO1xuICAgICAgaWYgKHRoaXMuX2NsaWNrRGVsdGEgPCAxMDAwKSB7XG4gICAgICAgICAgdGhpcy5faGVydHogPSBtc1BlclNlY29uZCAvIHRoaXMuX2NsaWNrRGVsdGE7XG4gICAgICAgICAgdGhpcy5fZmxvdyA9IHRoaXMuX2hlcnR6IC8gKDYwICogNy41KTtcbiAgICAgICAgICBsZXQgcCA9ICh0aGlzLl9mbG93ICogKHRoaXMuX2NsaWNrRGVsdGEgLyBtc1BlclNlY29uZCkpICogY2FsaWJyYXRpb247XG4gICAgICAgICAgdGhpcy5fdG90YWxQb3VyICs9IHA7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBsZXQgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIGlmIChub3cgLSB0aGlzLl9sYXN0UHVsc2UgPj0gbXNQZXJTZWNvbmQgJiYgdGhpcy5fdG90YWxQb3VyID4gdGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBgJHtpZH0gcG91cmVkOiAke3RoaXMuX3RvdGFsUG91cn0gb3pgO1xuICAgICAgICAgICAgICBzdXBlci5yZXBvcnQobWVzc2FnZSk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAvLyByZXBvcnQgdG8gZmlyZWJhc2VcbiAgICAgICAgICAgICAgLy8gdGhpcy5sb2dQb3VyKG91bmNlcyk7XG4gICAgICAgIFxuICAgICAgICAgICAgICAvLyB3cml0ZSB0byBkaXNwbGF5XG4gICAgICAgICAgICAgIGlmICh0aGlzLl9kaXNwbGF5ICYmIHRoaXMuX2Rpc3BsYXkuZ2V0SXNPbigpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGlzcGxheS53cml0ZShtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXkuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAvLyByZXNldFxuICAgICAgICAgICAgICB0aGlzLl90b3RhbFBvdXIgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgfVxuICAgICAgXG4gICAgICB0aGlzLl9sYXN0UHVsc2UgPSBjdXJyZW50VGltZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIHNhdmUgdGhlIGxhc3QgcG91clxuICBsb2dQb3VyKG91bmNlcykge1xuICAgIC8vIGdldCBiZWVyIGlkIGZvciByZWxhdGlvbnNoaXBcbiAgICB0aGlzLl9maXJlYmFzZS5kYXRhYmFzZSgpLnJlZihgdGFwcy8ke3RoaXMuX2lkfWApLm9uY2UoJ3ZhbHVlJykudGhlbigoc25hcHNob3QpID0+IHtcbiAgICAgIGNvbnN0IGJlZXIgPSBzbmFwc2hvdC52YWwoKS5iZWVyO1xuICAgICAgY29uc3QgcG91ckRhdGEgPSB7XG4gICAgICAgIGJlZXI6IGJlZXIsXG4gICAgICAgIG91bmNlczogb3VuY2VzLFxuICAgICAgICBjcmVhdGVkOiAobmV3IERhdGUoKSkuZ2V0VGltZSgpXG4gICAgICB9O1xuXG4gICAgICAvLyByZWNvcmQgcG91ciBmb3IgYmVlclxuICAgICAgY29uc3QgcG91ciA9IHRoaXMuX2ZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGBwb3Vyc2ApLnB1c2gocG91ckRhdGEpLmtleTtcbiAgICAgIHRoaXMuX2ZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGBiZWVycy8ke2JlZXJ9L3BvdXJzLyR7cG91cn1gKS5zZXQodHJ1ZSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==