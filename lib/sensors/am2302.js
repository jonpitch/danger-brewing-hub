'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _hubSensor = require('sensors/hub-sensor');

var _hubSensor2 = _interopRequireDefault(_hubSensor);

var _nodeDhtSensor = require('node-dht-sensor');

var _nodeDhtSensor2 = _interopRequireDefault(_nodeDhtSensor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
  AM2302 Temperature/Humidity Sensor
*/
var Am2302 = function (_HubSensor) {
  _inherits(Am2302, _HubSensor);

  function Am2302(firebase, id, pin, interval) {
    _classCallCheck(this, Am2302);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Am2302).call(this));

    _this._firebase = firebase;
    _this._id = id;
    _this._pin = pin;
    _this._interval = interval;

    // start
    if (_nodeDhtSensor2.default.initialize(22, _this._pin)) {
      _this.probe();
    }
    return _this;
  }

  // read temperature and humidity at interval


  _createClass(Am2302, [{
    key: 'probe',
    value: function probe() {
      var _this2 = this;

      var reading = _nodeDhtSensor2.default.read();
      var temp = reading.temperature.toFixed(2);
      var humidity = reading.humidity.toFixed(2);

      // log
      _get(Object.getPrototypeOf(Am2302.prototype), 'report', this).call(this, this._pin + ': ' + temp + '°C ' + humidity + '%');

      // report to firebase
      this._firebase.database().ref('sensors/' + this._id).update({
        temperature: temp,
        humidity: humidity
      });

      setTimeout(function () {
        _this2.probe();
      }, this._interval);
    }
  }]);

  return Am2302;
}(_hubSensor2.default);

exports.default = Am2302;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZW5zb3JzL2FtMjMwMi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7OztJQUdxQixNOzs7QUFFbkIsa0JBQVksUUFBWixFQUFzQixFQUF0QixFQUEwQixHQUExQixFQUErQixRQUEvQixFQUF5QztBQUFBOztBQUFBOztBQUV2QyxVQUFLLFNBQUwsR0FBaUIsUUFBakI7QUFDQSxVQUFLLEdBQUwsR0FBVyxFQUFYO0FBQ0EsVUFBSyxJQUFMLEdBQVksR0FBWjtBQUNBLFVBQUssU0FBTCxHQUFpQixRQUFqQjs7QUFFQTtBQUNBLFFBQUksd0JBQUksVUFBSixDQUFlLEVBQWYsRUFBbUIsTUFBSyxJQUF4QixDQUFKLEVBQW1DO0FBQ2pDLFlBQUssS0FBTDtBQUNEO0FBVnNDO0FBV3hDOztBQUVEOzs7Ozs0QkFDUTtBQUFBOztBQUNOLFVBQU0sVUFBVSx3QkFBSSxJQUFKLEVBQWhCO0FBQ0EsVUFBTSxPQUFPLFFBQVEsV0FBUixDQUFvQixPQUFwQixDQUE0QixDQUE1QixDQUFiO0FBQ0EsVUFBTSxXQUFXLFFBQVEsUUFBUixDQUFpQixPQUFqQixDQUF5QixDQUF6QixDQUFqQjs7QUFFQTtBQUNBLCtFQUFnQixLQUFLLElBQXJCLFVBQThCLElBQTlCLFdBQXdDLFFBQXhDOztBQUVBO0FBQ0EsV0FBSyxTQUFMLENBQWUsUUFBZixHQUEwQixHQUExQixjQUF5QyxLQUFLLEdBQTlDLEVBQXFELE1BQXJELENBQTREO0FBQzFELHFCQUFhLElBRDZDO0FBRTFELGtCQUFVO0FBRmdELE9BQTVEOztBQUtBLGlCQUFXLFlBQU07QUFDZixlQUFLLEtBQUw7QUFDRCxPQUZELEVBRUcsS0FBSyxTQUZSO0FBR0Q7Ozs7OztrQkFqQ2tCLE0iLCJmaWxlIjoiYW0yMzAyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEh1YlNlbnNvciBmcm9tICdzZW5zb3JzL2h1Yi1zZW5zb3InO1xuaW1wb3J0IGJjbSBmcm9tICdub2RlLWRodC1zZW5zb3InO1xuXG4vKipcbiAgQU0yMzAyIFRlbXBlcmF0dXJlL0h1bWlkaXR5IFNlbnNvclxuKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFtMjMwMiBleHRlbmRzIEh1YlNlbnNvciB7XG5cbiAgY29uc3RydWN0b3IoZmlyZWJhc2UsIGlkLCBwaW4sIGludGVydmFsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9maXJlYmFzZSA9IGZpcmViYXNlO1xuICAgIHRoaXMuX2lkID0gaWQ7XG4gICAgdGhpcy5fcGluID0gcGluO1xuICAgIHRoaXMuX2ludGVydmFsID0gaW50ZXJ2YWw7XG5cbiAgICAvLyBzdGFydFxuICAgIGlmIChiY20uaW5pdGlhbGl6ZSgyMiwgdGhpcy5fcGluKSkge1xuICAgICAgdGhpcy5wcm9iZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHJlYWQgdGVtcGVyYXR1cmUgYW5kIGh1bWlkaXR5IGF0IGludGVydmFsXG4gIHByb2JlKCkge1xuICAgIGNvbnN0IHJlYWRpbmcgPSBiY20ucmVhZCgpO1xuICAgIGNvbnN0IHRlbXAgPSByZWFkaW5nLnRlbXBlcmF0dXJlLnRvRml4ZWQoMik7XG4gICAgY29uc3QgaHVtaWRpdHkgPSByZWFkaW5nLmh1bWlkaXR5LnRvRml4ZWQoMik7XG5cbiAgICAvLyBsb2dcbiAgICBzdXBlci5yZXBvcnQoYCR7dGhpcy5fcGlufTogJHt0ZW1wfcKwQyAke2h1bWlkaXR5fSVgKTtcblxuICAgIC8vIHJlcG9ydCB0byBmaXJlYmFzZVxuICAgIHRoaXMuX2ZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGBzZW5zb3JzLyR7dGhpcy5faWR9YCkudXBkYXRlKHtcbiAgICAgIHRlbXBlcmF0dXJlOiB0ZW1wLFxuICAgICAgaHVtaWRpdHk6IGh1bWlkaXR5XG4gICAgfSk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMucHJvYmUoKTtcbiAgICB9LCB0aGlzLl9pbnRlcnZhbCk7XG4gIH1cbn1cbiJdfQ==