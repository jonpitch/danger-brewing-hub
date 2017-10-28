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
    var display = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    _classCallCheck(this, FlowMeter);

    var _this = _possibleConstructorReturn(this, (FlowMeter.__proto__ || Object.getPrototypeOf(FlowMeter)).call(this));

    _this._firebase = firebase;
    _this._id = id;
    _this._sensor = fiveSensor;
    _this._display = display;

    _this._lastPulse = Date.now();
    _this._hertz = 0;
    _this._flow = 0;
    _this._totalPour = 0;

    _this._sensor.on('change', function () {
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
            _get(FlowMeter.prototype.__proto__ || Object.getPrototypeOf(FlowMeter.prototype), 'report', _this).call(_this, message);

            // report to firebase
            _this.logPour(_this._totalPour);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZW5zb3JzL2Zsb3ctbWV0ZXIuanMiXSwibmFtZXMiOlsidGhyZXNob2xkIiwibXNQZXJTZWNvbmQiLCJjYWxpYnJhdGlvbiIsIkZsb3dNZXRlciIsImZpcmViYXNlIiwiaWQiLCJmaXZlU2Vuc29yIiwiZGlzcGxheSIsIl9maXJlYmFzZSIsIl9pZCIsIl9zZW5zb3IiLCJfZGlzcGxheSIsIl9sYXN0UHVsc2UiLCJEYXRlIiwibm93IiwiX2hlcnR6IiwiX2Zsb3ciLCJfdG90YWxQb3VyIiwib24iLCJjdXJyZW50VGltZSIsIl9jbGlja0RlbHRhIiwiTWF0aCIsIm1heCIsInAiLCJyb3VuZCIsInNldFRpbWVvdXQiLCJtZXNzYWdlIiwibG9nUG91ciIsImdldElzT24iLCJ3cml0ZSIsImNsZWFyIiwib3VuY2VzIiwiZGF0YWJhc2UiLCJyZWYiLCJvbmNlIiwidGhlbiIsInNuYXBzaG90IiwiYmVlciIsInZhbCIsInBvdXJEYXRhIiwiY3JlYXRlZCIsImdldFRpbWUiLCJwb3VyIiwicHVzaCIsImtleSIsInNldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7QUFFQTtBQUNBLElBQU1BLFlBQVksS0FBbEI7QUFDQSxJQUFNQyxjQUFjLElBQXBCOztBQUVBO0FBQ0EsSUFBTUMsY0FBYyxRQUFwQjs7QUFFQTs7O0lBRXFCQyxTOzs7QUFFbkIscUJBQVlDLFFBQVosRUFBc0JDLEVBQXRCLEVBQTBCQyxVQUExQixFQUFzRDtBQUFBLFFBQWhCQyxPQUFnQix1RUFBTixJQUFNOztBQUFBOztBQUFBOztBQUVwRCxVQUFLQyxTQUFMLEdBQWlCSixRQUFqQjtBQUNBLFVBQUtLLEdBQUwsR0FBV0osRUFBWDtBQUNBLFVBQUtLLE9BQUwsR0FBZUosVUFBZjtBQUNBLFVBQUtLLFFBQUwsR0FBZ0JKLE9BQWhCOztBQUVBLFVBQUtLLFVBQUwsR0FBa0JDLEtBQUtDLEdBQUwsRUFBbEI7QUFDQSxVQUFLQyxNQUFMLEdBQWMsQ0FBZDtBQUNBLFVBQUtDLEtBQUwsR0FBYSxDQUFiO0FBQ0EsVUFBS0MsVUFBTCxHQUFrQixDQUFsQjs7QUFFQSxVQUFLUCxPQUFMLENBQWFRLEVBQWIsQ0FBZ0IsUUFBaEIsRUFBMEIsWUFBTTtBQUM5QixVQUFJQyxjQUFjTixLQUFLQyxHQUFMLEVBQWxCO0FBQ0EsWUFBS00sV0FBTCxHQUFtQkMsS0FBS0MsR0FBTCxDQUFTLENBQUNILGNBQWMsTUFBS1AsVUFBcEIsQ0FBVCxFQUEwQyxDQUExQyxDQUFuQjtBQUNBLFVBQUksTUFBS1EsV0FBTCxHQUFtQixJQUF2QixFQUE2QjtBQUMzQixjQUFLTCxNQUFMLEdBQWNkLGNBQWMsTUFBS21CLFdBQWpDO0FBQ0EsY0FBS0osS0FBTCxHQUFhLE1BQUtELE1BQUwsSUFBZSxLQUFLLEdBQXBCLENBQWI7QUFDQSxZQUFJUSxJQUFLLE1BQUtQLEtBQUwsSUFBYyxNQUFLSSxXQUFMLEdBQW1CbkIsV0FBakMsQ0FBRCxHQUFrREMsV0FBMUQ7QUFDQSxjQUFLZSxVQUFMLElBQW1CSSxLQUFLRyxLQUFMLENBQVdELElBQUksR0FBZixJQUFzQixHQUF6QztBQUNBRSxtQkFBVyxZQUFNO0FBQ2YsY0FBSVgsTUFBTUQsS0FBS0MsR0FBTCxFQUFWO0FBQ0EsY0FBS0EsTUFBTSxNQUFLRixVQUFaLElBQTJCWCxXQUEzQixJQUNDLE1BQUtnQixVQUFMLEdBQWtCakIsU0FEdkIsRUFFRTtBQUNBLGdCQUFNMEIsVUFBYXJCLEVBQWIsaUJBQTJCLE1BQUtZLFVBQWhDLFFBQU47QUFDQSwySEFBYVMsT0FBYjs7QUFFQTtBQUNBLGtCQUFLQyxPQUFMLENBQWEsTUFBS1YsVUFBbEI7O0FBRUE7QUFDQSxnQkFBSSxNQUFLTixRQUFMLElBQWlCLE1BQUtBLFFBQUwsQ0FBY2lCLE9BQWQsRUFBckIsRUFBOEM7QUFDNUMsb0JBQUtqQixRQUFMLENBQWNrQixLQUFkLENBQW9CSCxPQUFwQjtBQUNBRCx5QkFBVyxZQUFNO0FBQ2Ysc0JBQUtkLFFBQUwsQ0FBY21CLEtBQWQ7QUFDRCxlQUZELEVBRUcsR0FGSDtBQUdEOztBQUVEO0FBQ0Esa0JBQUtiLFVBQUwsR0FBa0IsQ0FBbEI7QUFDRDtBQUNGLFNBdEJELEVBc0JHLElBdEJIO0FBdUJEOztBQUVELFlBQUtMLFVBQUwsR0FBa0JPLFdBQWxCO0FBQ0QsS0FsQ0Q7QUFab0Q7QUErQ3JEOztBQUVEOzs7Ozs0QkFDUVksTSxFQUFRO0FBQUE7O0FBQ2Q7QUFDQSxXQUFLdkIsU0FBTCxDQUFld0IsUUFBZixHQUEwQkMsR0FBMUIsV0FBc0MsS0FBS3hCLEdBQTNDLEVBQWtEeUIsSUFBbEQsQ0FBdUQsT0FBdkQsRUFBZ0VDLElBQWhFLENBQXFFLFVBQUNDLFFBQUQsRUFBYztBQUNqRixZQUFNQyxPQUFPRCxTQUFTRSxHQUFULEdBQWVELElBQTVCO0FBQ0EsWUFBTUUsV0FBVztBQUNmRixnQkFBTUEsSUFEUztBQUVmTixrQkFBUUEsTUFGTztBQUdmUyxtQkFBVSxJQUFJM0IsSUFBSixFQUFELENBQWE0QixPQUFiO0FBSE0sU0FBakI7O0FBTUE7QUFDQSxZQUFNQyxPQUFPLE9BQUtsQyxTQUFMLENBQWV3QixRQUFmLEdBQTBCQyxHQUExQixVQUF1Q1UsSUFBdkMsQ0FBNENKLFFBQTVDLEVBQXNESyxHQUFuRTtBQUNBLGVBQUtwQyxTQUFMLENBQWV3QixRQUFmLEdBQTBCQyxHQUExQixZQUF1Q0ksSUFBdkMsZUFBcURLLElBQXJELEVBQTZERyxHQUE3RCxDQUFpRSxJQUFqRTtBQUNELE9BWEQ7QUFZRDs7Ozs7O2tCQWxFa0IxQyxTIiwiZmlsZSI6ImZsb3ctbWV0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSHViU2Vuc29yIGZyb20gJ3NlbnNvcnMvaHViLXNlbnNvcic7XG5cbi8vIHRocmVzaG9sZCBpcyB0byBhdm9pZCBzbGlnaHQgbW92ZW1lbnRzIGluIGZsb3cgbWV0ZXJcbmNvbnN0IHRocmVzaG9sZCA9IDAuMDc1O1xuY29uc3QgbXNQZXJTZWNvbmQgPSAxMDAwO1xuXG4vLyBhbiBhcmJpdHJhcnkgYWRqdXN0bWVudCB2YWx1ZSBmcm9tIGZsb3cgdG8gb3VuY2VzXG5jb25zdCBjYWxpYnJhdGlvbiA9IDIwLjExMzM4O1xuXG4vKlxuKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZsb3dNZXRlciBleHRlbmRzIEh1YlNlbnNvciB7XG5cbiAgY29uc3RydWN0b3IoZmlyZWJhc2UsIGlkLCBmaXZlU2Vuc29yLCBkaXNwbGF5ID0gbnVsbCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fZmlyZWJhc2UgPSBmaXJlYmFzZTtcbiAgICB0aGlzLl9pZCA9IGlkO1xuICAgIHRoaXMuX3NlbnNvciA9IGZpdmVTZW5zb3I7XG4gICAgdGhpcy5fZGlzcGxheSA9IGRpc3BsYXk7XG5cbiAgICB0aGlzLl9sYXN0UHVsc2UgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMuX2hlcnR6ID0gMDtcbiAgICB0aGlzLl9mbG93ID0gMDtcbiAgICB0aGlzLl90b3RhbFBvdXIgPSAwO1xuICAgIFxuICAgIHRoaXMuX3NlbnNvci5vbignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgbGV0IGN1cnJlbnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgIHRoaXMuX2NsaWNrRGVsdGEgPSBNYXRoLm1heChbY3VycmVudFRpbWUgLSB0aGlzLl9sYXN0UHVsc2VdLCAxKTtcbiAgICAgIGlmICh0aGlzLl9jbGlja0RlbHRhIDwgMTAwMCkge1xuICAgICAgICB0aGlzLl9oZXJ0eiA9IG1zUGVyU2Vjb25kIC8gdGhpcy5fY2xpY2tEZWx0YTtcbiAgICAgICAgdGhpcy5fZmxvdyA9IHRoaXMuX2hlcnR6IC8gKDYwICogNy41KTtcbiAgICAgICAgbGV0IHAgPSAodGhpcy5fZmxvdyAqICh0aGlzLl9jbGlja0RlbHRhIC8gbXNQZXJTZWNvbmQpKSAqIGNhbGlicmF0aW9uO1xuICAgICAgICB0aGlzLl90b3RhbFBvdXIgKz0gTWF0aC5yb3VuZChwICogMTAwKSAvIDEwMDtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgbGV0IG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgICAgaWYgKChub3cgLSB0aGlzLl9sYXN0UHVsc2UpID49IG1zUGVyU2Vjb25kIFxuICAgICAgICAgICAgJiYgdGhpcy5fdG90YWxQb3VyID4gdGhyZXNob2xkXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gYCR7aWR9IHBvdXJlZDogJHt0aGlzLl90b3RhbFBvdXJ9IG96YDtcbiAgICAgICAgICAgIHN1cGVyLnJlcG9ydChtZXNzYWdlKTtcbiAgICAgIFxuICAgICAgICAgICAgLy8gcmVwb3J0IHRvIGZpcmViYXNlXG4gICAgICAgICAgICB0aGlzLmxvZ1BvdXIodGhpcy5fdG90YWxQb3VyKTtcbiAgICAgIFxuICAgICAgICAgICAgLy8gd3JpdGUgdG8gZGlzcGxheVxuICAgICAgICAgICAgaWYgKHRoaXMuX2Rpc3BsYXkgJiYgdGhpcy5fZGlzcGxheS5nZXRJc09uKCkpIHtcbiAgICAgICAgICAgICAgdGhpcy5fZGlzcGxheS53cml0ZShtZXNzYWdlKTtcbiAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGlzcGxheS5jbGVhcigpO1xuICAgICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyByZXNldFxuICAgICAgICAgICAgdGhpcy5fdG90YWxQb3VyID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgfVxuICAgICAgXG4gICAgICB0aGlzLl9sYXN0UHVsc2UgPSBjdXJyZW50VGltZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIHNhdmUgdGhlIGxhc3QgcG91clxuICBsb2dQb3VyKG91bmNlcykge1xuICAgIC8vIGdldCBiZWVyIGlkIGZvciByZWxhdGlvbnNoaXBcbiAgICB0aGlzLl9maXJlYmFzZS5kYXRhYmFzZSgpLnJlZihgdGFwcy8ke3RoaXMuX2lkfWApLm9uY2UoJ3ZhbHVlJykudGhlbigoc25hcHNob3QpID0+IHtcbiAgICAgIGNvbnN0IGJlZXIgPSBzbmFwc2hvdC52YWwoKS5iZWVyO1xuICAgICAgY29uc3QgcG91ckRhdGEgPSB7XG4gICAgICAgIGJlZXI6IGJlZXIsXG4gICAgICAgIG91bmNlczogb3VuY2VzLFxuICAgICAgICBjcmVhdGVkOiAobmV3IERhdGUoKSkuZ2V0VGltZSgpXG4gICAgICB9O1xuXG4gICAgICAvLyByZWNvcmQgcG91ciBmb3IgYmVlclxuICAgICAgY29uc3QgcG91ciA9IHRoaXMuX2ZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGBwb3Vyc2ApLnB1c2gocG91ckRhdGEpLmtleTtcbiAgICAgIHRoaXMuX2ZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGBiZWVycy8ke2JlZXJ9L3BvdXJzLyR7cG91cn1gKS5zZXQodHJ1ZSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==