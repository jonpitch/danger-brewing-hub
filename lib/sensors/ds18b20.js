'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _hubSensor = require('sensors/hub-sensor');

var _hubSensor2 = _interopRequireDefault(_hubSensor);

var _ds18x = require('ds18x20');

var _ds18x2 = _interopRequireDefault(_ds18x);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
  DS18B20 Temperature Sensor
*/
var Ds18b20 = function (_HubSensor) {
  _inherits(Ds18b20, _HubSensor);

  function Ds18b20(firebase, id, address, interval) {
    _classCallCheck(this, Ds18b20);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Ds18b20).call(this));

    _this._id = id;
    _this._address = address;
    _this._interval = interval;

    // start
    _this.probe();
    return _this;
  }

  // read temperatures every interval


  _createClass(Ds18b20, [{
    key: 'probe',
    value: function probe() {
      var _this2 = this;

      var temperatures = _ds18x2.default.getAll();
      var temperature = temperatures[this._address];
      _get(Object.getPrototypeOf(Ds18b20.prototype), 'report', this).call(this, this._address + ': ' + temperature + '°C');

      // report to firebase
      var hubId = _config2.default.get('hub.id');
      // firebase.database().ref(`hubs/${hubId}/lowerTemp`).set(temperature);

      setTimeout(function () {
        _this2.probe();
      }, this._interval);
    }
  }]);

  return Ds18b20;
}(_hubSensor2.default);

exports.default = Ds18b20;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZW5zb3JzL2RzMThiMjAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7OztJQUdxQixPOzs7QUFFbkIsbUJBQVksUUFBWixFQUFzQixFQUF0QixFQUEwQixPQUExQixFQUFtQyxRQUFuQyxFQUE2QztBQUFBOztBQUFBOztBQUUzQyxVQUFLLEdBQUwsR0FBVyxFQUFYO0FBQ0EsVUFBSyxRQUFMLEdBQWdCLE9BQWhCO0FBQ0EsVUFBSyxTQUFMLEdBQWlCLFFBQWpCOztBQUVBO0FBQ0EsVUFBSyxLQUFMO0FBUDJDO0FBUTVDOztBQUVEOzs7Ozs0QkFDUTtBQUFBOztBQUNOLFVBQU0sZUFBZSxnQkFBTyxNQUFQLEVBQXJCO0FBQ0EsVUFBTSxjQUFjLGFBQWEsS0FBSyxRQUFsQixDQUFwQjtBQUNBLGdGQUFnQixLQUFLLFFBQXJCLFVBQWtDLFdBQWxDOztBQUVBO0FBQ0EsVUFBTSxRQUFRLGlCQUFPLEdBQVAsQ0FBVyxRQUFYLENBQWQ7QUFDQTs7QUFFQSxpQkFBVyxZQUFNO0FBQ2YsZUFBSyxLQUFMO0FBQ0QsT0FGRCxFQUVHLEtBQUssU0FGUjtBQUdEOzs7Ozs7a0JBekJrQixPIiwiZmlsZSI6ImRzMThiMjAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSHViU2Vuc29yIGZyb20gJ3NlbnNvcnMvaHViLXNlbnNvcic7XG5pbXBvcnQgc2Vuc29yIGZyb20gJ2RzMTh4MjAnO1xuaW1wb3J0IGNvbmZpZyBmcm9tICdjb25maWcnO1xuXG4vKipcbiAgRFMxOEIyMCBUZW1wZXJhdHVyZSBTZW5zb3JcbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEczE4YjIwIGV4dGVuZHMgSHViU2Vuc29yIHtcblxuICBjb25zdHJ1Y3RvcihmaXJlYmFzZSwgaWQsIGFkZHJlc3MsIGludGVydmFsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9pZCA9IGlkO1xuICAgIHRoaXMuX2FkZHJlc3MgPSBhZGRyZXNzO1xuICAgIHRoaXMuX2ludGVydmFsID0gaW50ZXJ2YWw7XG5cbiAgICAvLyBzdGFydFxuICAgIHRoaXMucHJvYmUoKTtcbiAgfVxuXG4gIC8vIHJlYWQgdGVtcGVyYXR1cmVzIGV2ZXJ5IGludGVydmFsXG4gIHByb2JlKCkge1xuICAgIGNvbnN0IHRlbXBlcmF0dXJlcyA9IHNlbnNvci5nZXRBbGwoKTtcbiAgICBjb25zdCB0ZW1wZXJhdHVyZSA9IHRlbXBlcmF0dXJlc1t0aGlzLl9hZGRyZXNzXTtcbiAgICBzdXBlci5yZXBvcnQoYCR7dGhpcy5fYWRkcmVzc306ICR7dGVtcGVyYXR1cmV9wrBDYCk7XG5cbiAgICAvLyByZXBvcnQgdG8gZmlyZWJhc2VcbiAgICBjb25zdCBodWJJZCA9IGNvbmZpZy5nZXQoJ2h1Yi5pZCcpO1xuICAgIC8vIGZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGBodWJzLyR7aHViSWR9L2xvd2VyVGVtcGApLnNldCh0ZW1wZXJhdHVyZSk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMucHJvYmUoKTtcbiAgICB9LCB0aGlzLl9pbnRlcnZhbCk7XG4gIH1cbn1cbiJdfQ==