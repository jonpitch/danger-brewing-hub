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

    // pulses per session - gets reset
    var sessionPulses = 0;

    // state of flow meter
    var isOpen = false;

    _this._lastPulse = Date.now();
    _this._hertz = 0;
    _this._flow = 0;
    _this._thisPour = 0;
    _this._totalPour = 0;

    _this._sensor.on('change', function (value) {
      if (!value) {
        return;
      }

      // sessionPulses++;
      // isOpen = true;

      var currentTime = Date.now();
      _this._clickDelta = Math.max([currentTime - _this._lastPulse], 1);
      if (_this._clickDelta < 1000) {
        _this._hertz = 1000 / _this._clickDelta;
        _this._flow = _this._hertz / (60 * 7.5);
        var p = _this._flow * (_this._clickDelta / 1000) * 25.11338;
        _this._thisPour += p;
        _this._totalPour += p;
        console.log(id + ' poured: ' + _this._thisPour);
        setTimeout(function () {
          var now = Date.now();
          console.log(id + ' now: ' + now + ' last: ' + _this._lastPulse);
        }, 1000);
      }

      _this._lastPulse = currentTime;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZW5zb3JzL2Zsb3ctbWV0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0FBRUE7QUFDQSxJQUFNLGdCQUFnQixJQUF0Qjs7QUFFQTtBQUNBLElBQU0saUJBQWlCLEdBQXZCO0FBQ0EsSUFBTSxpQkFBaUIsTUFBdkI7QUFDQSxJQUFNLGlCQUFpQixNQUF2Qjs7QUFFQTs7OztJQUdxQixTOzs7QUFFbkIscUJBQVksUUFBWixFQUFzQixFQUF0QixFQUEwQixVQUExQixFQUFzRDtBQUFBLFFBQWhCLE9BQWdCLHlEQUFOLElBQU07O0FBQUE7O0FBQUE7O0FBRXBELFVBQUssU0FBTCxHQUFpQixRQUFqQjtBQUNBLFVBQUssR0FBTCxHQUFXLEVBQVg7QUFDQSxVQUFLLE9BQUwsR0FBZSxVQUFmO0FBQ0EsVUFBSyxRQUFMLEdBQWdCLE9BQWhCOztBQUVBO0FBQ0EsUUFBSSxnQkFBZ0IsQ0FBcEI7O0FBRUE7QUFDQSxRQUFJLFNBQVMsS0FBYjs7QUFFQSxVQUFLLFVBQUwsR0FBa0IsS0FBSyxHQUFMLEVBQWxCO0FBQ0EsVUFBSyxNQUFMLEdBQWMsQ0FBZDtBQUNBLFVBQUssS0FBTCxHQUFhLENBQWI7QUFDQSxVQUFLLFNBQUwsR0FBaUIsQ0FBakI7QUFDQSxVQUFLLFVBQUwsR0FBa0IsQ0FBbEI7O0FBRUEsVUFBSyxPQUFMLENBQWEsRUFBYixDQUFnQixRQUFoQixFQUEwQixVQUFDLEtBQUQsRUFBVztBQUNuQyxVQUFJLENBQUMsS0FBTCxFQUFZO0FBQ1Y7QUFDRDs7QUFFRDtBQUNBOztBQUVBLFVBQUksY0FBYyxLQUFLLEdBQUwsRUFBbEI7QUFDQSxZQUFLLFdBQUwsR0FBbUIsS0FBSyxHQUFMLENBQVMsQ0FBQyxjQUFjLE1BQUssVUFBcEIsQ0FBVCxFQUEwQyxDQUExQyxDQUFuQjtBQUNBLFVBQUksTUFBSyxXQUFMLEdBQW1CLElBQXZCLEVBQTZCO0FBQ3pCLGNBQUssTUFBTCxHQUFjLE9BQU8sTUFBSyxXQUExQjtBQUNBLGNBQUssS0FBTCxHQUFhLE1BQUssTUFBTCxJQUFlLEtBQUssR0FBcEIsQ0FBYjtBQUNBLFlBQUksSUFBSyxNQUFLLEtBQUwsSUFBYyxNQUFLLFdBQUwsR0FBbUIsSUFBakMsQ0FBRCxHQUEyQyxRQUFuRDtBQUNBLGNBQUssU0FBTCxJQUFrQixDQUFsQjtBQUNBLGNBQUssVUFBTCxJQUFtQixDQUFuQjtBQUNBLGdCQUFRLEdBQVIsQ0FBZSxFQUFmLGlCQUE2QixNQUFLLFNBQWxDO0FBQ0EsbUJBQVcsWUFBTTtBQUNmLGNBQUksTUFBTSxLQUFLLEdBQUwsRUFBVjtBQUNBLGtCQUFRLEdBQVIsQ0FBZSxFQUFmLGNBQTBCLEdBQTFCLGVBQXVDLE1BQUssVUFBNUM7QUFDRCxTQUhELEVBR0csSUFISDtBQUlIOztBQUVELFlBQUssVUFBTCxHQUFrQixXQUFsQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNELEtBbEREO0FBbkJvRDtBQXNFckQ7O0FBRUQ7Ozs7OzRCQUNRLE0sRUFBUTtBQUFBOztBQUNkO0FBQ0EsV0FBSyxTQUFMLENBQWUsUUFBZixHQUEwQixHQUExQixXQUFzQyxLQUFLLEdBQTNDLEVBQWtELElBQWxELENBQXVELE9BQXZELEVBQWdFLElBQWhFLENBQXFFLFVBQUMsUUFBRCxFQUFjO0FBQ2pGLFlBQU0sT0FBTyxTQUFTLEdBQVQsR0FBZSxJQUE1QjtBQUNBLFlBQU0sV0FBVztBQUNmLGdCQUFNLElBRFM7QUFFZixrQkFBUSxNQUZPO0FBR2YsbUJBQVUsSUFBSSxJQUFKLEVBQUQsQ0FBYSxPQUFiO0FBSE0sU0FBakI7O0FBTUE7QUFDQSxZQUFNLE9BQU8sT0FBSyxTQUFMLENBQWUsUUFBZixHQUEwQixHQUExQixVQUF1QyxJQUF2QyxDQUE0QyxRQUE1QyxFQUFzRCxHQUFuRTtBQUNBLGVBQUssU0FBTCxDQUFlLFFBQWYsR0FBMEIsR0FBMUIsWUFBdUMsSUFBdkMsZUFBcUQsSUFBckQsRUFBNkQsR0FBN0QsQ0FBaUUsSUFBakU7QUFDRCxPQVhEO0FBWUQ7Ozs7OztrQkF6RmtCLFMiLCJmaWxlIjoiZmxvdy1tZXRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBIdWJTZW5zb3IgZnJvbSAnc2Vuc29ycy9odWItc2Vuc29yJztcblxuLy8gdGhlIGFtb3VudCBvZiBvdW5jZXMgcmVxdWlyZWQgdG8gZmxvdyB0byBjb25zaWRlciBhIHBvdXIgb2NjdXJyZWRcbmNvbnN0IHBvdXJUaHJlc2hvbGQgPSAwLjE1O1xuXG4vLyBtYXkgcmVxdWlyZSBjYWxpYnJhdGlvblxuY29uc3QgcHVsc2VzUGVyTGl0ZXIgPSA0NTA7XG5jb25zdCBvdW5jZXNQZXJMaXRlciA9IDMzLjgxNDtcbmNvbnN0IHB1bHNlc1Blck91bmNlID0gMTMuMzA4O1xuXG4vKlxuXG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmxvd01ldGVyIGV4dGVuZHMgSHViU2Vuc29yIHtcblxuICBjb25zdHJ1Y3RvcihmaXJlYmFzZSwgaWQsIGZpdmVTZW5zb3IsIGRpc3BsYXkgPSBudWxsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9maXJlYmFzZSA9IGZpcmViYXNlO1xuICAgIHRoaXMuX2lkID0gaWQ7XG4gICAgdGhpcy5fc2Vuc29yID0gZml2ZVNlbnNvcjtcbiAgICB0aGlzLl9kaXNwbGF5ID0gZGlzcGxheTtcblxuICAgIC8vIHB1bHNlcyBwZXIgc2Vzc2lvbiAtIGdldHMgcmVzZXRcbiAgICBsZXQgc2Vzc2lvblB1bHNlcyA9IDA7XG5cbiAgICAvLyBzdGF0ZSBvZiBmbG93IG1ldGVyXG4gICAgbGV0IGlzT3BlbiA9IGZhbHNlO1xuXG4gICAgdGhpcy5fbGFzdFB1bHNlID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLl9oZXJ0eiA9IDA7XG4gICAgdGhpcy5fZmxvdyA9IDA7XG4gICAgdGhpcy5fdGhpc1BvdXIgPSAwO1xuICAgIHRoaXMuX3RvdGFsUG91ciA9IDA7XG4gICAgXG4gICAgdGhpcy5fc2Vuc29yLm9uKCdjaGFuZ2UnLCAodmFsdWUpID0+IHtcbiAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBzZXNzaW9uUHVsc2VzKys7XG4gICAgICAvLyBpc09wZW4gPSB0cnVlO1xuICAgICAgXG4gICAgICBsZXQgY3VycmVudFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgdGhpcy5fY2xpY2tEZWx0YSA9IE1hdGgubWF4KFtjdXJyZW50VGltZSAtIHRoaXMuX2xhc3RQdWxzZV0sIDEpO1xuICAgICAgaWYgKHRoaXMuX2NsaWNrRGVsdGEgPCAxMDAwKSB7XG4gICAgICAgICAgdGhpcy5faGVydHogPSAxMDAwIC8gdGhpcy5fY2xpY2tEZWx0YTtcbiAgICAgICAgICB0aGlzLl9mbG93ID0gdGhpcy5faGVydHogLyAoNjAgKiA3LjUpO1xuICAgICAgICAgIGxldCBwID0gKHRoaXMuX2Zsb3cgKiAodGhpcy5fY2xpY2tEZWx0YSAvIDEwMDApKSAqIDI1LjExMzM4O1xuICAgICAgICAgIHRoaXMuX3RoaXNQb3VyICs9IHA7XG4gICAgICAgICAgdGhpcy5fdG90YWxQb3VyICs9IHA7XG4gICAgICAgICAgY29uc29sZS5sb2coYCR7aWR9IHBvdXJlZDogJHt0aGlzLl90aGlzUG91cn1gKTtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGxldCBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYCR7aWR9IG5vdzogJHtub3d9IGxhc3Q6ICR7dGhpcy5fbGFzdFB1bHNlfWApO1xuICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgfVxuICAgICAgXG4gICAgICB0aGlzLl9sYXN0UHVsc2UgPSBjdXJyZW50VGltZTtcblxuICAgICAgLy8gbGV0IGN1cnJlbnRTZXNzaW9uID0gc2Vzc2lvblB1bHNlcztcbiAgICAgIC8vIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gICBpZiAoY3VycmVudFNlc3Npb24gPT09IHNlc3Npb25QdWxzZXMpIHtcbiAgICAgIC8vICAgICBjb25zdCBvdW5jZXMgPSBNYXRoLnJvdW5kKChzZXNzaW9uUHVsc2VzIC8gcHVsc2VzUGVyT3VuY2UpICogMTAwKSAvIDEwMDtcbiAgICAgIC8vICAgICBpZiAob3VuY2VzID4gcG91clRocmVzaG9sZCkge1xuICAgICAgLy8gICAgICAgY29uc3QgbWVzc2FnZSA9IGAke2lkfSBwb3VyZWQ6ICR7b3VuY2VzfSBvemA7XG4gICAgICAvLyAgICAgICBzdXBlci5yZXBvcnQobWVzc2FnZSk7XG4gICAgICAvLyBcbiAgICAgIC8vICAgICAgIC8vIHJlcG9ydCB0byBmaXJlYmFzZVxuICAgICAgLy8gICAgICAgdGhpcy5sb2dQb3VyKG91bmNlcyk7XG4gICAgICAvLyBcbiAgICAgIC8vICAgICAgIC8vIHdyaXRlIHRvIGRpc3BsYXlcbiAgICAgIC8vICAgICAgIGlmICh0aGlzLl9kaXNwbGF5ICYmIHRoaXMuX2Rpc3BsYXkuZ2V0SXNPbigpKSB7XG4gICAgICAvLyAgICAgICAgIHRoaXMuX2Rpc3BsYXkud3JpdGUobWVzc2FnZSk7XG4gICAgICAvLyAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gICAgICAgICAgIHRoaXMuX2Rpc3BsYXkuY2xlYXIoKTtcbiAgICAgIC8vICAgICAgICAgfSwgNTAwKTtcbiAgICAgIC8vICAgICAgIH1cbiAgICAgIC8vIFxuICAgICAgLy8gICAgICAgLy8gcmVzZXQgc2Vzc2lvblxuICAgICAgLy8gICAgICAgc2Vzc2lvblB1bHNlcyA9IDA7XG4gICAgICAvLyAgICAgICBpc09wZW4gPSBmYWxzZTtcbiAgICAgIC8vICAgICB9XG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH0sIDEwMDApO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gc2F2ZSB0aGUgbGFzdCBwb3VyXG4gIGxvZ1BvdXIob3VuY2VzKSB7XG4gICAgLy8gZ2V0IGJlZXIgaWQgZm9yIHJlbGF0aW9uc2hpcFxuICAgIHRoaXMuX2ZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGB0YXBzLyR7dGhpcy5faWR9YCkub25jZSgndmFsdWUnKS50aGVuKChzbmFwc2hvdCkgPT4ge1xuICAgICAgY29uc3QgYmVlciA9IHNuYXBzaG90LnZhbCgpLmJlZXI7XG4gICAgICBjb25zdCBwb3VyRGF0YSA9IHtcbiAgICAgICAgYmVlcjogYmVlcixcbiAgICAgICAgb3VuY2VzOiBvdW5jZXMsXG4gICAgICAgIGNyZWF0ZWQ6IChuZXcgRGF0ZSgpKS5nZXRUaW1lKClcbiAgICAgIH07XG5cbiAgICAgIC8vIHJlY29yZCBwb3VyIGZvciBiZWVyXG4gICAgICBjb25zdCBwb3VyID0gdGhpcy5fZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoYHBvdXJzYCkucHVzaChwb3VyRGF0YSkua2V5O1xuICAgICAgdGhpcy5fZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoYGJlZXJzLyR7YmVlcn0vcG91cnMvJHtwb3VyfWApLnNldCh0cnVlKTtcbiAgICB9KTtcbiAgfVxufVxuIl19