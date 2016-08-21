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

// the amount of ounces required to flow to consider a pour occurred
var pourThreshold = 0.15;

// may require calibration
var pulsesPerLiter = 450;
var ouncesPerLiter = 33.814;
var pulsesPerOunce = 13.308;

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

    // total pulses from flow meter
    var pulses = 0;

    // pulses per session - gets reset
    var sessionPulses = 0;

    // state of flow meter
    var isOpen = false;

    _this._sensor.on('change', function () {
      pulses++;
      sessionPulses++;
      isOpen = true;

      var currentSession = sessionPulses;
      setTimeout(function () {
        if (currentSession === sessionPulses) {
          var ounces = Math.round(sessionPulses / pulsesPerOunce * 100) / 100;
          if (ounces > pourThreshold) {
            var message = id + ' poured: ' + ounces + ' oz';
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

            // reset session
            sessionPulses = 0;
            isOpen = false;
          }
        }
      }, 1000);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZW5zb3JzL2Zsb3ctbWV0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7QUFFQTtBQUNBLElBQU0sZ0JBQWdCLElBQXRCOztBQUVBO0FBQ0EsSUFBTSxpQkFBaUIsR0FBdkI7QUFDQSxJQUFNLGlCQUFpQixNQUF2QjtBQUNBLElBQU0saUJBQWlCLE1BQXZCOztBQUVBOzs7O0lBR3FCLFM7OztBQUVuQixxQkFBWSxRQUFaLEVBQXNCLEVBQXRCLEVBQTBCLFVBQTFCLEVBQXNEO0FBQUEsUUFBaEIsT0FBZ0IseURBQU4sSUFBTTs7QUFBQTs7QUFBQTs7QUFFcEQsVUFBSyxTQUFMLEdBQWlCLFFBQWpCO0FBQ0EsVUFBSyxHQUFMLEdBQVcsRUFBWDtBQUNBLFVBQUssT0FBTCxHQUFlLFVBQWY7QUFDQSxVQUFLLFFBQUwsR0FBZ0IsT0FBaEI7O0FBRUE7QUFDQSxRQUFJLFNBQVMsQ0FBYjs7QUFFQTtBQUNBLFFBQUksZ0JBQWdCLENBQXBCOztBQUVBO0FBQ0EsUUFBSSxTQUFTLEtBQWI7O0FBRUEsVUFBSyxPQUFMLENBQWEsRUFBYixDQUFnQixRQUFoQixFQUEwQixZQUFNO0FBQzlCO0FBQ0E7QUFDQSxlQUFTLElBQVQ7O0FBRUEsVUFBSSxpQkFBaUIsYUFBckI7QUFDQSxpQkFBVyxZQUFNO0FBQ2YsWUFBSSxtQkFBbUIsYUFBdkIsRUFBc0M7QUFDcEMsY0FBTSxTQUFTLEtBQUssS0FBTCxDQUFZLGdCQUFnQixjQUFqQixHQUFtQyxHQUE5QyxJQUFxRCxHQUFwRTtBQUNBLGNBQUksU0FBUyxhQUFiLEVBQTRCO0FBQzFCLGdCQUFNLFVBQWEsRUFBYixpQkFBMkIsTUFBM0IsUUFBTjtBQUNBLDBGQUFhLE9BQWI7O0FBRUE7QUFDQSxrQkFBSyxPQUFMLENBQWEsTUFBYjs7QUFFQTtBQUNBLGdCQUFJLE1BQUssUUFBTCxJQUFpQixNQUFLLFFBQUwsQ0FBYyxPQUFkLEVBQXJCLEVBQThDO0FBQzVDLG9CQUFLLFFBQUwsQ0FBYyxLQUFkLENBQW9CLE9BQXBCO0FBQ0EseUJBQVcsWUFBTTtBQUNmLHNCQUFLLFFBQUwsQ0FBYyxLQUFkO0FBQ0QsZUFGRCxFQUVHLEdBRkg7QUFHRDs7QUFFRDtBQUNBLDRCQUFnQixDQUFoQjtBQUNBLHFCQUFTLEtBQVQ7QUFDRDtBQUNGO0FBQ0YsT0F2QkQsRUF1QkcsSUF2Qkg7QUF3QkQsS0E5QkQ7QUFoQm9EO0FBK0NyRDs7QUFFRDs7Ozs7NEJBQ1EsTSxFQUFRO0FBQUE7O0FBQ2Q7QUFDQSxXQUFLLFNBQUwsQ0FBZSxRQUFmLEdBQTBCLEdBQTFCLFdBQXNDLEtBQUssR0FBM0MsRUFBa0QsSUFBbEQsQ0FBdUQsT0FBdkQsRUFBZ0UsSUFBaEUsQ0FBcUUsVUFBQyxRQUFELEVBQWM7QUFDakYsWUFBTSxPQUFPLFNBQVMsR0FBVCxHQUFlLElBQTVCO0FBQ0EsWUFBTSxXQUFXO0FBQ2YsZ0JBQU0sSUFEUztBQUVmLGtCQUFRLE1BRk87QUFHZixtQkFBVSxJQUFJLElBQUosRUFBRCxDQUFhLE9BQWI7QUFITSxTQUFqQjs7QUFNQTtBQUNBLFlBQU0sT0FBTyxPQUFLLFNBQUwsQ0FBZSxRQUFmLEdBQTBCLEdBQTFCLFVBQXVDLElBQXZDLENBQTRDLFFBQTVDLEVBQXNELEdBQW5FO0FBQ0EsZUFBSyxTQUFMLENBQWUsUUFBZixHQUEwQixHQUExQixZQUF1QyxJQUF2QyxlQUFxRCxJQUFyRCxFQUE2RCxHQUE3RCxDQUFpRSxJQUFqRTtBQUNELE9BWEQ7QUFZRDs7Ozs7O2tCQWxFa0IsUyIsImZpbGUiOiJmbG93LW1ldGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEh1YlNlbnNvciBmcm9tICdzZW5zb3JzL2h1Yi1zZW5zb3InO1xuXG4vLyB0aGUgYW1vdW50IG9mIG91bmNlcyByZXF1aXJlZCB0byBmbG93IHRvIGNvbnNpZGVyIGEgcG91ciBvY2N1cnJlZFxuY29uc3QgcG91clRocmVzaG9sZCA9IDAuMTU7XG5cbi8vIG1heSByZXF1aXJlIGNhbGlicmF0aW9uXG5jb25zdCBwdWxzZXNQZXJMaXRlciA9IDQ1MDtcbmNvbnN0IG91bmNlc1BlckxpdGVyID0gMzMuODE0O1xuY29uc3QgcHVsc2VzUGVyT3VuY2UgPSAxMy4zMDg7XG5cbi8qXG5cbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGbG93TWV0ZXIgZXh0ZW5kcyBIdWJTZW5zb3Ige1xuXG4gIGNvbnN0cnVjdG9yKGZpcmViYXNlLCBpZCwgZml2ZVNlbnNvciwgZGlzcGxheSA9IG51bGwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2ZpcmViYXNlID0gZmlyZWJhc2U7XG4gICAgdGhpcy5faWQgPSBpZDtcbiAgICB0aGlzLl9zZW5zb3IgPSBmaXZlU2Vuc29yO1xuICAgIHRoaXMuX2Rpc3BsYXkgPSBkaXNwbGF5O1xuXG4gICAgLy8gdG90YWwgcHVsc2VzIGZyb20gZmxvdyBtZXRlclxuICAgIGxldCBwdWxzZXMgPSAwO1xuXG4gICAgLy8gcHVsc2VzIHBlciBzZXNzaW9uIC0gZ2V0cyByZXNldFxuICAgIGxldCBzZXNzaW9uUHVsc2VzID0gMDtcblxuICAgIC8vIHN0YXRlIG9mIGZsb3cgbWV0ZXJcbiAgICBsZXQgaXNPcGVuID0gZmFsc2U7XG5cbiAgICB0aGlzLl9zZW5zb3Iub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgIHB1bHNlcysrO1xuICAgICAgc2Vzc2lvblB1bHNlcysrO1xuICAgICAgaXNPcGVuID0gdHJ1ZTtcblxuICAgICAgbGV0IGN1cnJlbnRTZXNzaW9uID0gc2Vzc2lvblB1bHNlcztcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAoY3VycmVudFNlc3Npb24gPT09IHNlc3Npb25QdWxzZXMpIHtcbiAgICAgICAgICBjb25zdCBvdW5jZXMgPSBNYXRoLnJvdW5kKChzZXNzaW9uUHVsc2VzIC8gcHVsc2VzUGVyT3VuY2UpICogMTAwKSAvIDEwMDtcbiAgICAgICAgICBpZiAob3VuY2VzID4gcG91clRocmVzaG9sZCkge1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGAke2lkfSBwb3VyZWQ6ICR7b3VuY2VzfSBvemA7XG4gICAgICAgICAgICBzdXBlci5yZXBvcnQobWVzc2FnZSk7XG5cbiAgICAgICAgICAgIC8vIHJlcG9ydCB0byBmaXJlYmFzZVxuICAgICAgICAgICAgdGhpcy5sb2dQb3VyKG91bmNlcyk7XG5cbiAgICAgICAgICAgIC8vIHdyaXRlIHRvIGRpc3BsYXlcbiAgICAgICAgICAgIGlmICh0aGlzLl9kaXNwbGF5ICYmIHRoaXMuX2Rpc3BsYXkuZ2V0SXNPbigpKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXkud3JpdGUobWVzc2FnZSk7XG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXkuY2xlYXIoKTtcbiAgICAgICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcmVzZXQgc2Vzc2lvblxuICAgICAgICAgICAgc2Vzc2lvblB1bHNlcyA9IDA7XG4gICAgICAgICAgICBpc09wZW4gPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIDEwMDApO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gc2F2ZSB0aGUgbGFzdCBwb3VyXG4gIGxvZ1BvdXIob3VuY2VzKSB7XG4gICAgLy8gZ2V0IGJlZXIgaWQgZm9yIHJlbGF0aW9uc2hpcFxuICAgIHRoaXMuX2ZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGB0YXBzLyR7dGhpcy5faWR9YCkub25jZSgndmFsdWUnKS50aGVuKChzbmFwc2hvdCkgPT4ge1xuICAgICAgY29uc3QgYmVlciA9IHNuYXBzaG90LnZhbCgpLmJlZXI7XG4gICAgICBjb25zdCBwb3VyRGF0YSA9IHtcbiAgICAgICAgYmVlcjogYmVlcixcbiAgICAgICAgb3VuY2VzOiBvdW5jZXMsXG4gICAgICAgIGNyZWF0ZWQ6IChuZXcgRGF0ZSgpKS5nZXRUaW1lKClcbiAgICAgIH07XG5cbiAgICAgIC8vIHJlY29yZCBwb3VyIGZvciBiZWVyXG4gICAgICBjb25zdCBwb3VyID0gdGhpcy5fZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoYHBvdXJzYCkucHVzaChwb3VyRGF0YSkua2V5O1xuICAgICAgdGhpcy5fZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoYGJlZXJzLyR7YmVlcn0vcG91cnMvJHtwb3VyfWApLnNldCh0cnVlKTtcbiAgICB9KTtcbiAgfVxufVxuIl19