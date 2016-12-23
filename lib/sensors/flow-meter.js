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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZW5zb3JzL2Zsb3ctbWV0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNLFlBQVksS0FBbEI7QUFDQSxJQUFNLGNBQWMsSUFBcEI7QUFDQSxJQUFNLGNBQWMsUUFBcEI7O0FBRUE7Ozs7SUFHcUIsUzs7O0FBRW5CLHFCQUFZLFFBQVosRUFBc0IsRUFBdEIsRUFBMEIsVUFBMUIsRUFBc0Q7QUFBQSxRQUFoQixPQUFnQix5REFBTixJQUFNOztBQUFBOztBQUFBOztBQUVwRCxVQUFLLFNBQUwsR0FBaUIsUUFBakI7QUFDQSxVQUFLLEdBQUwsR0FBVyxFQUFYO0FBQ0EsVUFBSyxPQUFMLEdBQWUsVUFBZjtBQUNBLFVBQUssUUFBTCxHQUFnQixPQUFoQjs7QUFFQSxVQUFLLFVBQUwsR0FBa0IsS0FBSyxHQUFMLEVBQWxCO0FBQ0EsVUFBSyxNQUFMLEdBQWMsQ0FBZDtBQUNBLFVBQUssS0FBTCxHQUFhLENBQWI7QUFDQSxVQUFLLFVBQUwsR0FBa0IsQ0FBbEI7O0FBRUEsVUFBSyxPQUFMLENBQWEsRUFBYixDQUFnQixRQUFoQixFQUEwQixVQUFDLEtBQUQsRUFBVztBQUNuQyxVQUFJLENBQUMsS0FBTCxFQUFZO0FBQ1Y7QUFDRDs7QUFFRCxVQUFJLGNBQWMsS0FBSyxHQUFMLEVBQWxCO0FBQ0EsWUFBSyxXQUFMLEdBQW1CLEtBQUssR0FBTCxDQUFTLENBQUMsY0FBYyxNQUFLLFVBQXBCLENBQVQsRUFBMEMsQ0FBMUMsQ0FBbkI7QUFDQSxVQUFJLE1BQUssV0FBTCxHQUFtQixJQUF2QixFQUE2QjtBQUMzQixjQUFLLE1BQUwsR0FBYyxjQUFjLE1BQUssV0FBakM7QUFDQSxjQUFLLEtBQUwsR0FBYSxNQUFLLE1BQUwsSUFBZSxLQUFLLEdBQXBCLENBQWI7QUFDQSxZQUFJLElBQUssTUFBSyxLQUFMLElBQWMsTUFBSyxXQUFMLEdBQW1CLFdBQWpDLENBQUQsR0FBa0QsV0FBMUQ7QUFDQSxjQUFLLFVBQUwsSUFBbUIsQ0FBbkI7QUFDQSxtQkFBVyxZQUFNO0FBQ2YsY0FBSSxNQUFNLEtBQUssR0FBTCxFQUFWO0FBQ0Esa0JBQVEsR0FBUixDQUFlLEVBQWYsZUFBMkIsTUFBSyxVQUFoQyxjQUFtRCxHQUFuRCxpQkFBa0UsTUFBSyxVQUF2RTtBQUNBLGNBQUssTUFBTSxNQUFLLFVBQVosSUFBMkIsV0FBM0IsSUFDQyxNQUFLLFVBQUwsR0FBa0IsU0FEdkIsRUFFRTtBQUNBLGdCQUFNLFVBQWEsRUFBYixpQkFBMkIsTUFBSyxVQUFoQyxRQUFOO0FBQ0EsMEZBQWEsT0FBYjs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQUksTUFBSyxRQUFMLElBQWlCLE1BQUssUUFBTCxDQUFjLE9BQWQsRUFBckIsRUFBOEM7QUFDNUMsb0JBQUssUUFBTCxDQUFjLEtBQWQsQ0FBb0IsT0FBcEI7QUFDQSx5QkFBVyxZQUFNO0FBQ2Ysc0JBQUssUUFBTCxDQUFjLEtBQWQ7QUFDRCxlQUZELEVBRUcsR0FGSDtBQUdEOztBQUVEO0FBQ0Esa0JBQUssVUFBTCxHQUFrQixDQUFsQjtBQUNEO0FBQ0YsU0F2QkQsRUF1QkcsSUF2Qkg7QUF3QkQ7O0FBRUQsWUFBSyxVQUFMLEdBQWtCLFdBQWxCO0FBQ0QsS0F2Q0Q7QUFab0Q7QUFvRHJEOztBQUVEOzs7Ozs0QkFDUSxNLEVBQVE7QUFBQTs7QUFDZDtBQUNBLFdBQUssU0FBTCxDQUFlLFFBQWYsR0FBMEIsR0FBMUIsV0FBc0MsS0FBSyxHQUEzQyxFQUFrRCxJQUFsRCxDQUF1RCxPQUF2RCxFQUFnRSxJQUFoRSxDQUFxRSxVQUFDLFFBQUQsRUFBYztBQUNqRixZQUFNLE9BQU8sU0FBUyxHQUFULEdBQWUsSUFBNUI7QUFDQSxZQUFNLFdBQVc7QUFDZixnQkFBTSxJQURTO0FBRWYsa0JBQVEsTUFGTztBQUdmLG1CQUFVLElBQUksSUFBSixFQUFELENBQWEsT0FBYjtBQUhNLFNBQWpCOztBQU1BO0FBQ0EsWUFBTSxPQUFPLE9BQUssU0FBTCxDQUFlLFFBQWYsR0FBMEIsR0FBMUIsVUFBdUMsSUFBdkMsQ0FBNEMsUUFBNUMsRUFBc0QsR0FBbkU7QUFDQSxlQUFLLFNBQUwsQ0FBZSxRQUFmLEdBQTBCLEdBQTFCLFlBQXVDLElBQXZDLGVBQXFELElBQXJELEVBQTZELEdBQTdELENBQWlFLElBQWpFO0FBQ0QsT0FYRDtBQVlEOzs7Ozs7a0JBdkVrQixTIiwiZmlsZSI6ImZsb3ctbWV0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSHViU2Vuc29yIGZyb20gJ3NlbnNvcnMvaHViLXNlbnNvcic7XG5cbmNvbnN0IHRocmVzaG9sZCA9IDAuMDc1O1xuY29uc3QgbXNQZXJTZWNvbmQgPSAxMDAwO1xuY29uc3QgY2FsaWJyYXRpb24gPSAyMS4xMTMzODtcblxuLypcblxuKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZsb3dNZXRlciBleHRlbmRzIEh1YlNlbnNvciB7XG5cbiAgY29uc3RydWN0b3IoZmlyZWJhc2UsIGlkLCBmaXZlU2Vuc29yLCBkaXNwbGF5ID0gbnVsbCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fZmlyZWJhc2UgPSBmaXJlYmFzZTtcbiAgICB0aGlzLl9pZCA9IGlkO1xuICAgIHRoaXMuX3NlbnNvciA9IGZpdmVTZW5zb3I7XG4gICAgdGhpcy5fZGlzcGxheSA9IGRpc3BsYXk7XG5cbiAgICB0aGlzLl9sYXN0UHVsc2UgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMuX2hlcnR6ID0gMDtcbiAgICB0aGlzLl9mbG93ID0gMDtcbiAgICB0aGlzLl90b3RhbFBvdXIgPSAwO1xuICAgIFxuICAgIHRoaXMuX3NlbnNvci5vbignY2hhbmdlJywgKHZhbHVlKSA9PiB7XG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgbGV0IGN1cnJlbnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgIHRoaXMuX2NsaWNrRGVsdGEgPSBNYXRoLm1heChbY3VycmVudFRpbWUgLSB0aGlzLl9sYXN0UHVsc2VdLCAxKTtcbiAgICAgIGlmICh0aGlzLl9jbGlja0RlbHRhIDwgMTAwMCkge1xuICAgICAgICB0aGlzLl9oZXJ0eiA9IG1zUGVyU2Vjb25kIC8gdGhpcy5fY2xpY2tEZWx0YTtcbiAgICAgICAgdGhpcy5fZmxvdyA9IHRoaXMuX2hlcnR6IC8gKDYwICogNy41KTtcbiAgICAgICAgbGV0IHAgPSAodGhpcy5fZmxvdyAqICh0aGlzLl9jbGlja0RlbHRhIC8gbXNQZXJTZWNvbmQpKSAqIGNhbGlicmF0aW9uO1xuICAgICAgICB0aGlzLl90b3RhbFBvdXIgKz0gcDtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgbGV0IG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgICAgY29uc29sZS5sb2coYCR7aWR9IGxhc3Q6ICR7dGhpcy5fbGFzdFB1bHNlfSBub3c6ICR7bm93fSBwb3VyZWQ6ICR7dGhpcy5fdG90YWxQb3VyfWApO1xuICAgICAgICAgIGlmICgobm93IC0gdGhpcy5fbGFzdFB1bHNlKSA+PSBtc1BlclNlY29uZCBcbiAgICAgICAgICAgICYmIHRoaXMuX3RvdGFsUG91ciA+IHRocmVzaG9sZFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGAke2lkfSBwb3VyZWQ6ICR7dGhpcy5fdG90YWxQb3VyfSBvemA7XG4gICAgICAgICAgICBzdXBlci5yZXBvcnQobWVzc2FnZSk7XG4gICAgICBcbiAgICAgICAgICAgIC8vIHJlcG9ydCB0byBmaXJlYmFzZVxuICAgICAgICAgICAgLy8gdGhpcy5sb2dQb3VyKG91bmNlcyk7XG4gICAgICBcbiAgICAgICAgICAgIC8vIHdyaXRlIHRvIGRpc3BsYXlcbiAgICAgICAgICAgIGlmICh0aGlzLl9kaXNwbGF5ICYmIHRoaXMuX2Rpc3BsYXkuZ2V0SXNPbigpKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXkud3JpdGUobWVzc2FnZSk7XG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXkuY2xlYXIoKTtcbiAgICAgICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gcmVzZXRcbiAgICAgICAgICAgIHRoaXMuX3RvdGFsUG91ciA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAxMDAwKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdGhpcy5fbGFzdFB1bHNlID0gY3VycmVudFRpbWU7XG4gICAgfSk7XG4gIH1cblxuICAvLyBzYXZlIHRoZSBsYXN0IHBvdXJcbiAgbG9nUG91cihvdW5jZXMpIHtcbiAgICAvLyBnZXQgYmVlciBpZCBmb3IgcmVsYXRpb25zaGlwXG4gICAgdGhpcy5fZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoYHRhcHMvJHt0aGlzLl9pZH1gKS5vbmNlKCd2YWx1ZScpLnRoZW4oKHNuYXBzaG90KSA9PiB7XG4gICAgICBjb25zdCBiZWVyID0gc25hcHNob3QudmFsKCkuYmVlcjtcbiAgICAgIGNvbnN0IHBvdXJEYXRhID0ge1xuICAgICAgICBiZWVyOiBiZWVyLFxuICAgICAgICBvdW5jZXM6IG91bmNlcyxcbiAgICAgICAgY3JlYXRlZDogKG5ldyBEYXRlKCkpLmdldFRpbWUoKVxuICAgICAgfTtcblxuICAgICAgLy8gcmVjb3JkIHBvdXIgZm9yIGJlZXJcbiAgICAgIGNvbnN0IHBvdXIgPSB0aGlzLl9maXJlYmFzZS5kYXRhYmFzZSgpLnJlZihgcG91cnNgKS5wdXNoKHBvdXJEYXRhKS5rZXk7XG4gICAgICB0aGlzLl9maXJlYmFzZS5kYXRhYmFzZSgpLnJlZihgYmVlcnMvJHtiZWVyfS9wb3Vycy8ke3BvdXJ9YCkuc2V0KHRydWUpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=