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

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

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

      _get(Object.getPrototypeOf(Am2302.prototype), 'report', this).call(this, this._pin + ': ' + temp + '°C ' + humidity + '%');

      // report to firebase
      var hubId = _config2.default.get('hub.id');
      // firebase.database().ref(`hubs/${hubId}`).set({
      //   upperTemp: temp,
      //   humidity: humidity
      // });

      setTimeout(function () {
        _this2.probe();
      }, this._interval);
    }
  }]);

  return Am2302;
}(_hubSensor2.default);

exports.default = Am2302;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZW5zb3JzL2FtMjMwMi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7O0lBR3FCLE07OztBQUVuQixrQkFBWSxRQUFaLEVBQXNCLEVBQXRCLEVBQTBCLEdBQTFCLEVBQStCLFFBQS9CLEVBQXlDO0FBQUE7O0FBQUE7O0FBRXZDLFVBQUssR0FBTCxHQUFXLEVBQVg7QUFDQSxVQUFLLElBQUwsR0FBWSxHQUFaO0FBQ0EsVUFBSyxTQUFMLEdBQWlCLFFBQWpCOztBQUVBO0FBQ0EsUUFBSSx3QkFBSSxVQUFKLENBQWUsRUFBZixFQUFtQixNQUFLLElBQXhCLENBQUosRUFBbUM7QUFDakMsWUFBSyxLQUFMO0FBQ0Q7QUFUc0M7QUFVeEM7O0FBRUQ7Ozs7OzRCQUNRO0FBQUE7O0FBQ04sVUFBTSxVQUFVLHdCQUFJLElBQUosRUFBaEI7QUFDQSxVQUFNLE9BQU8sUUFBUSxXQUFSLENBQW9CLE9BQXBCLENBQTRCLENBQTVCLENBQWI7QUFDQSxVQUFNLFdBQVcsUUFBUSxRQUFSLENBQWlCLE9BQWpCLENBQXlCLENBQXpCLENBQWpCOztBQUVBLCtFQUFnQixLQUFLLElBQXJCLFVBQThCLElBQTlCLFdBQXdDLFFBQXhDOztBQUVBO0FBQ0EsVUFBTSxRQUFRLGlCQUFPLEdBQVAsQ0FBVyxRQUFYLENBQWQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBVyxZQUFNO0FBQ2YsZUFBSyxLQUFMO0FBQ0QsT0FGRCxFQUVHLEtBQUssU0FGUjtBQUdEOzs7Ozs7a0JBaENrQixNIiwiZmlsZSI6ImFtMjMwMi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBIdWJTZW5zb3IgZnJvbSAnc2Vuc29ycy9odWItc2Vuc29yJztcbmltcG9ydCBiY20gZnJvbSAnbm9kZS1kaHQtc2Vuc29yJztcbmltcG9ydCBjb25maWcgZnJvbSAnY29uZmlnJztcblxuLyoqXG4gIEFNMjMwMiBUZW1wZXJhdHVyZS9IdW1pZGl0eSBTZW5zb3JcbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbTIzMDIgZXh0ZW5kcyBIdWJTZW5zb3Ige1xuXG4gIGNvbnN0cnVjdG9yKGZpcmViYXNlLCBpZCwgcGluLCBpbnRlcnZhbCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5faWQgPSBpZDtcbiAgICB0aGlzLl9waW4gPSBwaW47XG4gICAgdGhpcy5faW50ZXJ2YWwgPSBpbnRlcnZhbDtcblxuICAgIC8vIHN0YXJ0XG4gICAgaWYgKGJjbS5pbml0aWFsaXplKDIyLCB0aGlzLl9waW4pKSB7XG4gICAgICB0aGlzLnByb2JlKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gcmVhZCB0ZW1wZXJhdHVyZSBhbmQgaHVtaWRpdHkgYXQgaW50ZXJ2YWxcbiAgcHJvYmUoKSB7XG4gICAgY29uc3QgcmVhZGluZyA9IGJjbS5yZWFkKCk7XG4gICAgY29uc3QgdGVtcCA9IHJlYWRpbmcudGVtcGVyYXR1cmUudG9GaXhlZCgyKTtcbiAgICBjb25zdCBodW1pZGl0eSA9IHJlYWRpbmcuaHVtaWRpdHkudG9GaXhlZCgyKTtcblxuICAgIHN1cGVyLnJlcG9ydChgJHt0aGlzLl9waW59OiAke3RlbXB9wrBDICR7aHVtaWRpdHl9JWApO1xuXG4gICAgLy8gcmVwb3J0IHRvIGZpcmViYXNlXG4gICAgY29uc3QgaHViSWQgPSBjb25maWcuZ2V0KCdodWIuaWQnKTtcbiAgICAvLyBmaXJlYmFzZS5kYXRhYmFzZSgpLnJlZihgaHVicy8ke2h1YklkfWApLnNldCh7XG4gICAgLy8gICB1cHBlclRlbXA6IHRlbXAsXG4gICAgLy8gICBodW1pZGl0eTogaHVtaWRpdHlcbiAgICAvLyB9KTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5wcm9iZSgpO1xuICAgIH0sIHRoaXMuX2ludGVydmFsKTtcbiAgfVxufVxuIl19