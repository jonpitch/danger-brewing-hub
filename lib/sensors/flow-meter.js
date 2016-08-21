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

/*

*/
var FlowMeter = function (_HubSensor) {
  _inherits(FlowMeter, _HubSensor);

  function FlowMeter(firebase, id, fiveSensor) {
    var display = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

    _classCallCheck(this, FlowMeter);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FlowMeter).call(this));

    _this._id = id;
    _this._sensor = fiveSensor;
    _this._display = display;

    // the amount of ounces required to flow to consider a pour occurred
    var pourThreshold = 0.1;

    // total pulses from flow meter
    var pulses = 0;

    // pulses per session - gets reset
    var sessionPulses = 0;

    // state of flow meter
    var isOpen = false;

    // may require calibration
    var pulsesPerLiter = 450;
    var ouncesPerLiter = 33.814;
    var pulsesPerOunce = 13.308;

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
      // get beer id for relationship
      // firebase.database().ref(`taps/${this._id}`).once('value').then((snapshot) => {
      //   const beer = snapshot.val().beer;
      //   const pour = {
      //     beer: beer,
      //     ounces: ounces,
      //     created: (new Date()).getTime()
      //   };
      //
      //   // TODO revisit - create correct structure for ember data
      //   firebase.database().ref(`pours`).push(pour);
      // });
    }
  }]);

  return FlowMeter;
}(_hubSensor2.default);

exports.default = FlowMeter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZW5zb3JzL2Zsb3ctbWV0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7QUFFQTs7O0lBR3FCLFM7OztBQUVuQixxQkFBWSxRQUFaLEVBQXNCLEVBQXRCLEVBQTBCLFVBQTFCLEVBQXNEO0FBQUEsUUFBaEIsT0FBZ0IseURBQU4sSUFBTTs7QUFBQTs7QUFBQTs7QUFFcEQsVUFBSyxHQUFMLEdBQVcsRUFBWDtBQUNBLFVBQUssT0FBTCxHQUFlLFVBQWY7QUFDQSxVQUFLLFFBQUwsR0FBZ0IsT0FBaEI7O0FBRUE7QUFDQSxRQUFNLGdCQUFnQixHQUF0Qjs7QUFFQTtBQUNBLFFBQUksU0FBUyxDQUFiOztBQUVBO0FBQ0EsUUFBSSxnQkFBZ0IsQ0FBcEI7O0FBRUE7QUFDQSxRQUFJLFNBQVMsS0FBYjs7QUFFQTtBQUNBLFFBQU0saUJBQWlCLEdBQXZCO0FBQ0EsUUFBTSxpQkFBaUIsTUFBdkI7QUFDQSxRQUFNLGlCQUFpQixNQUF2Qjs7QUFFQSxVQUFLLE9BQUwsQ0FBYSxFQUFiLENBQWdCLFFBQWhCLEVBQTBCLFlBQU07QUFDOUI7QUFDQTtBQUNBLGVBQVMsSUFBVDs7QUFFQSxVQUFJLGlCQUFpQixhQUFyQjtBQUNBLGlCQUFXLFlBQU07QUFDZixZQUFJLG1CQUFtQixhQUF2QixFQUFzQztBQUNwQyxjQUFNLFNBQVMsS0FBSyxLQUFMLENBQVksZ0JBQWdCLGNBQWpCLEdBQW1DLEdBQTlDLElBQXFELEdBQXBFO0FBQ0EsY0FBSSxTQUFTLGFBQWIsRUFBNEI7QUFDMUIsZ0JBQU0sVUFBYSxFQUFiLGlCQUEyQixNQUEzQixRQUFOO0FBQ0EsMEZBQWEsT0FBYjs7QUFFQTtBQUNBLGtCQUFLLE9BQUwsQ0FBYSxNQUFiOztBQUVBO0FBQ0EsZ0JBQUksTUFBSyxRQUFMLElBQWlCLE1BQUssUUFBTCxDQUFjLE9BQWQsRUFBckIsRUFBOEM7QUFDNUMsb0JBQUssUUFBTCxDQUFjLEtBQWQsQ0FBb0IsT0FBcEI7QUFDQSx5QkFBVyxZQUFNO0FBQ2Ysc0JBQUssUUFBTCxDQUFjLEtBQWQ7QUFDRCxlQUZELEVBRUcsR0FGSDtBQUdEOztBQUVEO0FBQ0EsNEJBQWdCLENBQWhCO0FBQ0EscUJBQVMsS0FBVDtBQUNEO0FBQ0Y7QUFDRixPQXZCRCxFQXVCRyxJQXZCSDtBQXdCRCxLQTlCRDtBQXZCb0Q7QUFzRHJEOztBQUVEOzs7Ozs0QkFDUSxNLEVBQVE7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRDs7Ozs7O2tCQXhFa0IsUyIsImZpbGUiOiJmbG93LW1ldGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEh1YlNlbnNvciBmcm9tICdzZW5zb3JzL2h1Yi1zZW5zb3InO1xuXG4vKlxuXG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmxvd01ldGVyIGV4dGVuZHMgSHViU2Vuc29yIHtcblxuICBjb25zdHJ1Y3RvcihmaXJlYmFzZSwgaWQsIGZpdmVTZW5zb3IsIGRpc3BsYXkgPSBudWxsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9pZCA9IGlkO1xuICAgIHRoaXMuX3NlbnNvciA9IGZpdmVTZW5zb3I7XG4gICAgdGhpcy5fZGlzcGxheSA9IGRpc3BsYXk7XG5cbiAgICAvLyB0aGUgYW1vdW50IG9mIG91bmNlcyByZXF1aXJlZCB0byBmbG93IHRvIGNvbnNpZGVyIGEgcG91ciBvY2N1cnJlZFxuICAgIGNvbnN0IHBvdXJUaHJlc2hvbGQgPSAwLjE7XG5cbiAgICAvLyB0b3RhbCBwdWxzZXMgZnJvbSBmbG93IG1ldGVyXG4gICAgbGV0IHB1bHNlcyA9IDA7XG5cbiAgICAvLyBwdWxzZXMgcGVyIHNlc3Npb24gLSBnZXRzIHJlc2V0XG4gICAgbGV0IHNlc3Npb25QdWxzZXMgPSAwO1xuXG4gICAgLy8gc3RhdGUgb2YgZmxvdyBtZXRlclxuICAgIGxldCBpc09wZW4gPSBmYWxzZTtcblxuICAgIC8vIG1heSByZXF1aXJlIGNhbGlicmF0aW9uXG4gICAgY29uc3QgcHVsc2VzUGVyTGl0ZXIgPSA0NTA7XG4gICAgY29uc3Qgb3VuY2VzUGVyTGl0ZXIgPSAzMy44MTQ7XG4gICAgY29uc3QgcHVsc2VzUGVyT3VuY2UgPSAxMy4zMDg7XG5cbiAgICB0aGlzLl9zZW5zb3Iub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgIHB1bHNlcysrO1xuICAgICAgc2Vzc2lvblB1bHNlcysrO1xuICAgICAgaXNPcGVuID0gdHJ1ZTtcblxuICAgICAgbGV0IGN1cnJlbnRTZXNzaW9uID0gc2Vzc2lvblB1bHNlcztcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAoY3VycmVudFNlc3Npb24gPT09IHNlc3Npb25QdWxzZXMpIHtcbiAgICAgICAgICBjb25zdCBvdW5jZXMgPSBNYXRoLnJvdW5kKChzZXNzaW9uUHVsc2VzIC8gcHVsc2VzUGVyT3VuY2UpICogMTAwKSAvIDEwMDtcbiAgICAgICAgICBpZiAob3VuY2VzID4gcG91clRocmVzaG9sZCkge1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGAke2lkfSBwb3VyZWQ6ICR7b3VuY2VzfSBvemA7XG4gICAgICAgICAgICBzdXBlci5yZXBvcnQobWVzc2FnZSk7XG5cbiAgICAgICAgICAgIC8vIHJlcG9ydCB0byBmaXJlYmFzZVxuICAgICAgICAgICAgdGhpcy5sb2dQb3VyKG91bmNlcyk7XG5cbiAgICAgICAgICAgIC8vIHdyaXRlIHRvIGRpc3BsYXlcbiAgICAgICAgICAgIGlmICh0aGlzLl9kaXNwbGF5ICYmIHRoaXMuX2Rpc3BsYXkuZ2V0SXNPbigpKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXkud3JpdGUobWVzc2FnZSk7XG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXkuY2xlYXIoKTtcbiAgICAgICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcmVzZXQgc2Vzc2lvblxuICAgICAgICAgICAgc2Vzc2lvblB1bHNlcyA9IDA7XG4gICAgICAgICAgICBpc09wZW4gPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIDEwMDApO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gc2F2ZSB0aGUgbGFzdCBwb3VyXG4gIGxvZ1BvdXIob3VuY2VzKSB7XG4gICAgLy8gZ2V0IGJlZXIgaWQgZm9yIHJlbGF0aW9uc2hpcFxuICAgIC8vIGZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGB0YXBzLyR7dGhpcy5faWR9YCkub25jZSgndmFsdWUnKS50aGVuKChzbmFwc2hvdCkgPT4ge1xuICAgIC8vICAgY29uc3QgYmVlciA9IHNuYXBzaG90LnZhbCgpLmJlZXI7XG4gICAgLy8gICBjb25zdCBwb3VyID0ge1xuICAgIC8vICAgICBiZWVyOiBiZWVyLFxuICAgIC8vICAgICBvdW5jZXM6IG91bmNlcyxcbiAgICAvLyAgICAgY3JlYXRlZDogKG5ldyBEYXRlKCkpLmdldFRpbWUoKVxuICAgIC8vICAgfTtcbiAgICAvL1xuICAgIC8vICAgLy8gVE9ETyByZXZpc2l0IC0gY3JlYXRlIGNvcnJlY3Qgc3RydWN0dXJlIGZvciBlbWJlciBkYXRhXG4gICAgLy8gICBmaXJlYmFzZS5kYXRhYmFzZSgpLnJlZihgcG91cnNgKS5wdXNoKHBvdXIpO1xuICAgIC8vIH0pO1xuICB9XG59XG4iXX0=