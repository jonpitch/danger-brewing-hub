'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

    _this._lastPulse = Date.now();
    _this._clickDelta = 0;
    _this._hertz = 0;

    // pulses per session - gets reset
    var sessionPulses = 0;

    // state of flow meter
    var isOpen = false;

    _this._sensor.on('change', function (value) {
      if (!value) {
        console.log('no value');
        return;
      }

      sessionPulses++;
      isOpen = true;

      var currentTime = Date.now();
      _this._clickDelta = Math.max([currentTime - _this._lastPulse], 1);
      console.log('id: ' + id + ' - delta: ' + _this._clickDelta);

      // let currentSession = sessionPulses;
      // setTimeout(() => {
      //   if (currentSession === sessionPulses) {
      //     const ounces = Math.round((sessionPulses / pulsesPerOunce) * 100) / 100;
      //     if (ounces > pourThreshold) {
      //       const message = `${id} poured: ${ounces} oz`;
      //       super.report(message);
      // 
      //       // report to firebase
      //       this.logPour(ounces);
      // 
      //       // write to display
      //       if (this._display && this._display.getIsOn()) {
      //         this._display.write(message);
      //         setTimeout(() => {
      //           this._display.clear();
      //         }, 500);
      //       }
      // 
      //       // reset session
      //       sessionPulses = 0;
      //       isOpen = false;
      //     }
      //   }
      // }, 1000);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZW5zb3JzL2Zsb3ctbWV0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0FBRUE7QUFDQSxJQUFNLGdCQUFnQixJQUF0Qjs7QUFFQTtBQUNBLElBQU0saUJBQWlCLEdBQXZCO0FBQ0EsSUFBTSxpQkFBaUIsTUFBdkI7QUFDQSxJQUFNLGlCQUFpQixNQUF2Qjs7QUFFQTs7OztJQUdxQixTOzs7QUFFbkIscUJBQVksUUFBWixFQUFzQixFQUF0QixFQUEwQixVQUExQixFQUFzRDtBQUFBLFFBQWhCLE9BQWdCLHlEQUFOLElBQU07O0FBQUE7O0FBQUE7O0FBRXBELFVBQUssU0FBTCxHQUFpQixRQUFqQjtBQUNBLFVBQUssR0FBTCxHQUFXLEVBQVg7QUFDQSxVQUFLLE9BQUwsR0FBZSxVQUFmO0FBQ0EsVUFBSyxRQUFMLEdBQWdCLE9BQWhCOztBQUdBLFVBQUssVUFBTCxHQUFrQixLQUFLLEdBQUwsRUFBbEI7QUFDQSxVQUFLLFdBQUwsR0FBbUIsQ0FBbkI7QUFDQSxVQUFLLE1BQUwsR0FBYyxDQUFkOztBQUVBO0FBQ0EsUUFBSSxnQkFBZ0IsQ0FBcEI7O0FBRUE7QUFDQSxRQUFJLFNBQVMsS0FBYjs7QUFFQSxVQUFLLE9BQUwsQ0FBYSxFQUFiLENBQWdCLFFBQWhCLEVBQTBCLFVBQUMsS0FBRCxFQUFXO0FBQ25DLFVBQUksQ0FBQyxLQUFMLEVBQVk7QUFDVixnQkFBUSxHQUFSLENBQVksVUFBWjtBQUNBO0FBQ0Q7O0FBRUQ7QUFDQSxlQUFTLElBQVQ7O0FBRUEsVUFBSSxjQUFjLEtBQUssR0FBTCxFQUFsQjtBQUNBLFlBQUssV0FBTCxHQUFtQixLQUFLLEdBQUwsQ0FBUyxDQUFDLGNBQWMsTUFBSyxVQUFwQixDQUFULEVBQTBDLENBQTFDLENBQW5CO0FBQ0EsY0FBUSxHQUFSLFVBQW1CLEVBQW5CLGtCQUFrQyxNQUFLLFdBQXZDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0QsS0F0Q0Q7QUFsQm9EO0FBeURyRDs7QUFFRDs7Ozs7NEJBQ1EsTSxFQUFRO0FBQUE7O0FBQ2Q7QUFDQSxXQUFLLFNBQUwsQ0FBZSxRQUFmLEdBQTBCLEdBQTFCLFdBQXNDLEtBQUssR0FBM0MsRUFBa0QsSUFBbEQsQ0FBdUQsT0FBdkQsRUFBZ0UsSUFBaEUsQ0FBcUUsVUFBQyxRQUFELEVBQWM7QUFDakYsWUFBTSxPQUFPLFNBQVMsR0FBVCxHQUFlLElBQTVCO0FBQ0EsWUFBTSxXQUFXO0FBQ2YsZ0JBQU0sSUFEUztBQUVmLGtCQUFRLE1BRk87QUFHZixtQkFBVSxJQUFJLElBQUosRUFBRCxDQUFhLE9BQWI7QUFITSxTQUFqQjs7QUFNQTtBQUNBLFlBQU0sT0FBTyxPQUFLLFNBQUwsQ0FBZSxRQUFmLEdBQTBCLEdBQTFCLFVBQXVDLElBQXZDLENBQTRDLFFBQTVDLEVBQXNELEdBQW5FO0FBQ0EsZUFBSyxTQUFMLENBQWUsUUFBZixHQUEwQixHQUExQixZQUF1QyxJQUF2QyxlQUFxRCxJQUFyRCxFQUE2RCxHQUE3RCxDQUFpRSxJQUFqRTtBQUNELE9BWEQ7QUFZRDs7Ozs7O2tCQTVFa0IsUyIsImZpbGUiOiJmbG93LW1ldGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEh1YlNlbnNvciBmcm9tICdzZW5zb3JzL2h1Yi1zZW5zb3InO1xuXG4vLyB0aGUgYW1vdW50IG9mIG91bmNlcyByZXF1aXJlZCB0byBmbG93IHRvIGNvbnNpZGVyIGEgcG91ciBvY2N1cnJlZFxuY29uc3QgcG91clRocmVzaG9sZCA9IDAuMTU7XG5cbi8vIG1heSByZXF1aXJlIGNhbGlicmF0aW9uXG5jb25zdCBwdWxzZXNQZXJMaXRlciA9IDQ1MDtcbmNvbnN0IG91bmNlc1BlckxpdGVyID0gMzMuODE0O1xuY29uc3QgcHVsc2VzUGVyT3VuY2UgPSAxMy4zMDg7XG5cbi8qXG5cbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGbG93TWV0ZXIgZXh0ZW5kcyBIdWJTZW5zb3Ige1xuXG4gIGNvbnN0cnVjdG9yKGZpcmViYXNlLCBpZCwgZml2ZVNlbnNvciwgZGlzcGxheSA9IG51bGwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2ZpcmViYXNlID0gZmlyZWJhc2U7XG4gICAgdGhpcy5faWQgPSBpZDtcbiAgICB0aGlzLl9zZW5zb3IgPSBmaXZlU2Vuc29yO1xuICAgIHRoaXMuX2Rpc3BsYXkgPSBkaXNwbGF5O1xuICAgIFxuICAgIFxuICAgIHRoaXMuX2xhc3RQdWxzZSA9IERhdGUubm93KCk7XG4gICAgdGhpcy5fY2xpY2tEZWx0YSA9IDA7XG4gICAgdGhpcy5faGVydHogPSAwO1xuXG4gICAgLy8gcHVsc2VzIHBlciBzZXNzaW9uIC0gZ2V0cyByZXNldFxuICAgIGxldCBzZXNzaW9uUHVsc2VzID0gMDtcblxuICAgIC8vIHN0YXRlIG9mIGZsb3cgbWV0ZXJcbiAgICBsZXQgaXNPcGVuID0gZmFsc2U7XG5cbiAgICB0aGlzLl9zZW5zb3Iub24oJ2NoYW5nZScsICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnbm8gdmFsdWUnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzZXNzaW9uUHVsc2VzKys7XG4gICAgICBpc09wZW4gPSB0cnVlO1xuICAgICAgXG4gICAgICBsZXQgY3VycmVudFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgdGhpcy5fY2xpY2tEZWx0YSA9IE1hdGgubWF4KFtjdXJyZW50VGltZSAtIHRoaXMuX2xhc3RQdWxzZV0sIDEpO1xuICAgICAgY29uc29sZS5sb2coYGlkOiAke2lkfSAtIGRlbHRhOiAke3RoaXMuX2NsaWNrRGVsdGF9YCk7XG5cbiAgICAgIC8vIGxldCBjdXJyZW50U2Vzc2lvbiA9IHNlc3Npb25QdWxzZXM7XG4gICAgICAvLyBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vICAgaWYgKGN1cnJlbnRTZXNzaW9uID09PSBzZXNzaW9uUHVsc2VzKSB7XG4gICAgICAvLyAgICAgY29uc3Qgb3VuY2VzID0gTWF0aC5yb3VuZCgoc2Vzc2lvblB1bHNlcyAvIHB1bHNlc1Blck91bmNlKSAqIDEwMCkgLyAxMDA7XG4gICAgICAvLyAgICAgaWYgKG91bmNlcyA+IHBvdXJUaHJlc2hvbGQpIHtcbiAgICAgIC8vICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBgJHtpZH0gcG91cmVkOiAke291bmNlc30gb3pgO1xuICAgICAgLy8gICAgICAgc3VwZXIucmVwb3J0KG1lc3NhZ2UpO1xuICAgICAgLy8gXG4gICAgICAvLyAgICAgICAvLyByZXBvcnQgdG8gZmlyZWJhc2VcbiAgICAgIC8vICAgICAgIHRoaXMubG9nUG91cihvdW5jZXMpO1xuICAgICAgLy8gXG4gICAgICAvLyAgICAgICAvLyB3cml0ZSB0byBkaXNwbGF5XG4gICAgICAvLyAgICAgICBpZiAodGhpcy5fZGlzcGxheSAmJiB0aGlzLl9kaXNwbGF5LmdldElzT24oKSkge1xuICAgICAgLy8gICAgICAgICB0aGlzLl9kaXNwbGF5LndyaXRlKG1lc3NhZ2UpO1xuICAgICAgLy8gICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vICAgICAgICAgICB0aGlzLl9kaXNwbGF5LmNsZWFyKCk7XG4gICAgICAvLyAgICAgICAgIH0sIDUwMCk7XG4gICAgICAvLyAgICAgICB9XG4gICAgICAvLyBcbiAgICAgIC8vICAgICAgIC8vIHJlc2V0IHNlc3Npb25cbiAgICAgIC8vICAgICAgIHNlc3Npb25QdWxzZXMgPSAwO1xuICAgICAgLy8gICAgICAgaXNPcGVuID0gZmFsc2U7XG4gICAgICAvLyAgICAgfVxuICAgICAgLy8gICB9XG4gICAgICAvLyB9LCAxMDAwKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIHNhdmUgdGhlIGxhc3QgcG91clxuICBsb2dQb3VyKG91bmNlcykge1xuICAgIC8vIGdldCBiZWVyIGlkIGZvciByZWxhdGlvbnNoaXBcbiAgICB0aGlzLl9maXJlYmFzZS5kYXRhYmFzZSgpLnJlZihgdGFwcy8ke3RoaXMuX2lkfWApLm9uY2UoJ3ZhbHVlJykudGhlbigoc25hcHNob3QpID0+IHtcbiAgICAgIGNvbnN0IGJlZXIgPSBzbmFwc2hvdC52YWwoKS5iZWVyO1xuICAgICAgY29uc3QgcG91ckRhdGEgPSB7XG4gICAgICAgIGJlZXI6IGJlZXIsXG4gICAgICAgIG91bmNlczogb3VuY2VzLFxuICAgICAgICBjcmVhdGVkOiAobmV3IERhdGUoKSkuZ2V0VGltZSgpXG4gICAgICB9O1xuXG4gICAgICAvLyByZWNvcmQgcG91ciBmb3IgYmVlclxuICAgICAgY29uc3QgcG91ciA9IHRoaXMuX2ZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGBwb3Vyc2ApLnB1c2gocG91ckRhdGEpLmtleTtcbiAgICAgIHRoaXMuX2ZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGBiZWVycy8ke2JlZXJ9L3BvdXJzLyR7cG91cn1gKS5zZXQodHJ1ZSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==