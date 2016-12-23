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
        console.log('skipping ' + id + ' value');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZW5zb3JzL2Zsb3ctbWV0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7QUFFQTtBQUNBLElBQU0sWUFBWSxLQUFsQjtBQUNBLElBQU0sY0FBYyxJQUFwQjs7QUFFQTtBQUNBLElBQU0sY0FBYyxRQUFwQjs7QUFFQTs7OztJQUdxQixTOzs7QUFFbkIscUJBQVksUUFBWixFQUFzQixFQUF0QixFQUEwQixVQUExQixFQUFzRDtBQUFBLFFBQWhCLE9BQWdCLHlEQUFOLElBQU07O0FBQUE7O0FBQUE7O0FBRXBELFVBQUssU0FBTCxHQUFpQixRQUFqQjtBQUNBLFVBQUssR0FBTCxHQUFXLEVBQVg7QUFDQSxVQUFLLE9BQUwsR0FBZSxVQUFmO0FBQ0EsVUFBSyxRQUFMLEdBQWdCLE9BQWhCOztBQUVBLFVBQUssVUFBTCxHQUFrQixLQUFLLEdBQUwsRUFBbEI7QUFDQSxVQUFLLE1BQUwsR0FBYyxDQUFkO0FBQ0EsVUFBSyxLQUFMLEdBQWEsQ0FBYjtBQUNBLFVBQUssVUFBTCxHQUFrQixDQUFsQjs7QUFFQSxVQUFLLE9BQUwsQ0FBYSxFQUFiLENBQWdCLFFBQWhCLEVBQTBCLFVBQUMsS0FBRCxFQUFXO0FBQ25DLFVBQUksQ0FBQyxLQUFMLEVBQVk7QUFDVixnQkFBUSxHQUFSLGVBQXdCLEVBQXhCO0FBQ0E7QUFDRDs7QUFFRCxVQUFJLGNBQWMsS0FBSyxHQUFMLEVBQWxCO0FBQ0EsWUFBSyxXQUFMLEdBQW1CLEtBQUssR0FBTCxDQUFTLENBQUMsY0FBYyxNQUFLLFVBQXBCLENBQVQsRUFBMEMsQ0FBMUMsQ0FBbkI7QUFDQSxVQUFJLE1BQUssV0FBTCxHQUFtQixJQUF2QixFQUE2QjtBQUMzQixjQUFLLE1BQUwsR0FBYyxjQUFjLE1BQUssV0FBakM7QUFDQSxjQUFLLEtBQUwsR0FBYSxNQUFLLE1BQUwsSUFBZSxLQUFLLEdBQXBCLENBQWI7QUFDQSxZQUFJLElBQUssTUFBSyxLQUFMLElBQWMsTUFBSyxXQUFMLEdBQW1CLFdBQWpDLENBQUQsR0FBa0QsV0FBMUQ7QUFDQSxjQUFLLFVBQUwsSUFBbUIsQ0FBbkI7QUFDQSxnQkFBUSxHQUFSLENBQWUsRUFBZixpQkFBNkIsTUFBSyxVQUFsQztBQUNBLG1CQUFXLFlBQU07QUFDZixjQUFJLE1BQU0sS0FBSyxHQUFMLEVBQVY7QUFDQSxrQkFBUSxHQUFSLENBQWUsRUFBZixlQUEyQixNQUFLLFVBQWhDLGNBQW1ELEdBQW5ELGlCQUFrRSxNQUFLLFVBQXZFO0FBQ0EsY0FBSyxNQUFNLE1BQUssVUFBWixJQUEyQixXQUEzQixJQUNDLE1BQUssVUFBTCxHQUFrQixTQUR2QixFQUVFO0FBQ0EsZ0JBQU0sVUFBYSxFQUFiLGlCQUEyQixNQUFLLFVBQWhDLFFBQU47QUFDQSwwRkFBYSxPQUFiOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBSSxNQUFLLFFBQUwsSUFBaUIsTUFBSyxRQUFMLENBQWMsT0FBZCxFQUFyQixFQUE4QztBQUM1QyxvQkFBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixPQUFwQjtBQUNBLHlCQUFXLFlBQU07QUFDZixzQkFBSyxRQUFMLENBQWMsS0FBZDtBQUNELGVBRkQsRUFFRyxHQUZIO0FBR0Q7O0FBRUQ7QUFDQSxrQkFBSyxVQUFMLEdBQWtCLENBQWxCO0FBQ0Q7QUFDRixTQXZCRCxFQXVCRyxJQXZCSDtBQXdCRDs7QUFFRCxZQUFLLFVBQUwsR0FBa0IsV0FBbEI7QUFDRCxLQXpDRDtBQVpvRDtBQXNEckQ7O0FBRUQ7Ozs7OzRCQUNRLE0sRUFBUTtBQUFBOztBQUNkO0FBQ0EsV0FBSyxTQUFMLENBQWUsUUFBZixHQUEwQixHQUExQixXQUFzQyxLQUFLLEdBQTNDLEVBQWtELElBQWxELENBQXVELE9BQXZELEVBQWdFLElBQWhFLENBQXFFLFVBQUMsUUFBRCxFQUFjO0FBQ2pGLFlBQU0sT0FBTyxTQUFTLEdBQVQsR0FBZSxJQUE1QjtBQUNBLFlBQU0sV0FBVztBQUNmLGdCQUFNLElBRFM7QUFFZixrQkFBUSxNQUZPO0FBR2YsbUJBQVUsSUFBSSxJQUFKLEVBQUQsQ0FBYSxPQUFiO0FBSE0sU0FBakI7O0FBTUE7QUFDQSxZQUFNLE9BQU8sT0FBSyxTQUFMLENBQWUsUUFBZixHQUEwQixHQUExQixVQUF1QyxJQUF2QyxDQUE0QyxRQUE1QyxFQUFzRCxHQUFuRTtBQUNBLGVBQUssU0FBTCxDQUFlLFFBQWYsR0FBMEIsR0FBMUIsWUFBdUMsSUFBdkMsZUFBcUQsSUFBckQsRUFBNkQsR0FBN0QsQ0FBaUUsSUFBakU7QUFDRCxPQVhEO0FBWUQ7Ozs7OztrQkF6RWtCLFMiLCJmaWxlIjoiZmxvdy1tZXRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBIdWJTZW5zb3IgZnJvbSAnc2Vuc29ycy9odWItc2Vuc29yJztcblxuLy8gdGhyZXNob2xkIGlzIHRvIGF2b2lkIHNsaWdodCBtb3ZlbWVudHMgaW4gZmxvdyBtZXRlclxuY29uc3QgdGhyZXNob2xkID0gMC4wNzU7XG5jb25zdCBtc1BlclNlY29uZCA9IDEwMDA7XG5cbi8vIFRPRE9cbmNvbnN0IGNhbGlicmF0aW9uID0gMjEuMTEzMzg7XG5cbi8qXG5cbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGbG93TWV0ZXIgZXh0ZW5kcyBIdWJTZW5zb3Ige1xuXG4gIGNvbnN0cnVjdG9yKGZpcmViYXNlLCBpZCwgZml2ZVNlbnNvciwgZGlzcGxheSA9IG51bGwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2ZpcmViYXNlID0gZmlyZWJhc2U7XG4gICAgdGhpcy5faWQgPSBpZDtcbiAgICB0aGlzLl9zZW5zb3IgPSBmaXZlU2Vuc29yO1xuICAgIHRoaXMuX2Rpc3BsYXkgPSBkaXNwbGF5O1xuXG4gICAgdGhpcy5fbGFzdFB1bHNlID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLl9oZXJ0eiA9IDA7XG4gICAgdGhpcy5fZmxvdyA9IDA7XG4gICAgdGhpcy5fdG90YWxQb3VyID0gMDtcbiAgICBcbiAgICB0aGlzLl9zZW5zb3Iub24oJ2NoYW5nZScsICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhgc2tpcHBpbmcgJHtpZH0gdmFsdWVgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgICBsZXQgY3VycmVudFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgdGhpcy5fY2xpY2tEZWx0YSA9IE1hdGgubWF4KFtjdXJyZW50VGltZSAtIHRoaXMuX2xhc3RQdWxzZV0sIDEpO1xuICAgICAgaWYgKHRoaXMuX2NsaWNrRGVsdGEgPCAxMDAwKSB7XG4gICAgICAgIHRoaXMuX2hlcnR6ID0gbXNQZXJTZWNvbmQgLyB0aGlzLl9jbGlja0RlbHRhO1xuICAgICAgICB0aGlzLl9mbG93ID0gdGhpcy5faGVydHogLyAoNjAgKiA3LjUpO1xuICAgICAgICBsZXQgcCA9ICh0aGlzLl9mbG93ICogKHRoaXMuX2NsaWNrRGVsdGEgLyBtc1BlclNlY29uZCkpICogY2FsaWJyYXRpb247XG4gICAgICAgIHRoaXMuX3RvdGFsUG91ciArPSBwO1xuICAgICAgICBjb25zb2xlLmxvZyhgJHtpZH0gcG91cmVkOiAke3RoaXMuX3RvdGFsUG91cn1gKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgbGV0IG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgICAgY29uc29sZS5sb2coYCR7aWR9IGxhc3Q6ICR7dGhpcy5fbGFzdFB1bHNlfSBub3c6ICR7bm93fSBwb3VyZWQ6ICR7dGhpcy5fdG90YWxQb3VyfWApO1xuICAgICAgICAgIGlmICgobm93IC0gdGhpcy5fbGFzdFB1bHNlKSA+PSBtc1BlclNlY29uZCBcbiAgICAgICAgICAgICYmIHRoaXMuX3RvdGFsUG91ciA+IHRocmVzaG9sZFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGAke2lkfSBwb3VyZWQ6ICR7dGhpcy5fdG90YWxQb3VyfSBvemA7XG4gICAgICAgICAgICBzdXBlci5yZXBvcnQobWVzc2FnZSk7XG4gICAgICBcbiAgICAgICAgICAgIC8vIHJlcG9ydCB0byBmaXJlYmFzZVxuICAgICAgICAgICAgLy8gdGhpcy5sb2dQb3VyKG91bmNlcyk7XG4gICAgICBcbiAgICAgICAgICAgIC8vIHdyaXRlIHRvIGRpc3BsYXlcbiAgICAgICAgICAgIGlmICh0aGlzLl9kaXNwbGF5ICYmIHRoaXMuX2Rpc3BsYXkuZ2V0SXNPbigpKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXkud3JpdGUobWVzc2FnZSk7XG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXkuY2xlYXIoKTtcbiAgICAgICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gcmVzZXRcbiAgICAgICAgICAgIHRoaXMuX3RvdGFsUG91ciA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAxMDAwKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdGhpcy5fbGFzdFB1bHNlID0gY3VycmVudFRpbWU7XG4gICAgfSk7XG4gIH1cblxuICAvLyBzYXZlIHRoZSBsYXN0IHBvdXJcbiAgbG9nUG91cihvdW5jZXMpIHtcbiAgICAvLyBnZXQgYmVlciBpZCBmb3IgcmVsYXRpb25zaGlwXG4gICAgdGhpcy5fZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoYHRhcHMvJHt0aGlzLl9pZH1gKS5vbmNlKCd2YWx1ZScpLnRoZW4oKHNuYXBzaG90KSA9PiB7XG4gICAgICBjb25zdCBiZWVyID0gc25hcHNob3QudmFsKCkuYmVlcjtcbiAgICAgIGNvbnN0IHBvdXJEYXRhID0ge1xuICAgICAgICBiZWVyOiBiZWVyLFxuICAgICAgICBvdW5jZXM6IG91bmNlcyxcbiAgICAgICAgY3JlYXRlZDogKG5ldyBEYXRlKCkpLmdldFRpbWUoKVxuICAgICAgfTtcblxuICAgICAgLy8gcmVjb3JkIHBvdXIgZm9yIGJlZXJcbiAgICAgIGNvbnN0IHBvdXIgPSB0aGlzLl9maXJlYmFzZS5kYXRhYmFzZSgpLnJlZihgcG91cnNgKS5wdXNoKHBvdXJEYXRhKS5rZXk7XG4gICAgICB0aGlzLl9maXJlYmFzZS5kYXRhYmFzZSgpLnJlZihgYmVlcnMvJHtiZWVyfS9wb3Vycy8ke3BvdXJ9YCkuc2V0KHRydWUpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=