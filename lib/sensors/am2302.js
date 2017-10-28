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

    var _this = _possibleConstructorReturn(this, (Am2302.__proto__ || Object.getPrototypeOf(Am2302)).call(this));

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
      _get(Am2302.prototype.__proto__ || Object.getPrototypeOf(Am2302.prototype), 'report', this).call(this, this._pin + ': ' + temp + '\xB0C ' + humidity + '%');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZW5zb3JzL2FtMjMwMi5qcyJdLCJuYW1lcyI6WyJBbTIzMDIiLCJmaXJlYmFzZSIsImlkIiwicGluIiwiaW50ZXJ2YWwiLCJfZmlyZWJhc2UiLCJfaWQiLCJfcGluIiwiX2ludGVydmFsIiwiaW5pdGlhbGl6ZSIsInByb2JlIiwicmVhZGluZyIsInJlYWQiLCJ0ZW1wIiwidGVtcGVyYXR1cmUiLCJ0b0ZpeGVkIiwiaHVtaWRpdHkiLCJkYXRhYmFzZSIsInJlZiIsInVwZGF0ZSIsInNldFRpbWVvdXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7O0lBR3FCQSxNOzs7QUFFbkIsa0JBQVlDLFFBQVosRUFBc0JDLEVBQXRCLEVBQTBCQyxHQUExQixFQUErQkMsUUFBL0IsRUFBeUM7QUFBQTs7QUFBQTs7QUFFdkMsVUFBS0MsU0FBTCxHQUFpQkosUUFBakI7QUFDQSxVQUFLSyxHQUFMLEdBQVdKLEVBQVg7QUFDQSxVQUFLSyxJQUFMLEdBQVlKLEdBQVo7QUFDQSxVQUFLSyxTQUFMLEdBQWlCSixRQUFqQjs7QUFFQTtBQUNBLFFBQUksd0JBQUlLLFVBQUosQ0FBZSxFQUFmLEVBQW1CLE1BQUtGLElBQXhCLENBQUosRUFBbUM7QUFDakMsWUFBS0csS0FBTDtBQUNEO0FBVnNDO0FBV3hDOztBQUVEOzs7Ozs0QkFDUTtBQUFBOztBQUNOLFVBQU1DLFVBQVUsd0JBQUlDLElBQUosRUFBaEI7QUFDQSxVQUFNQyxPQUFPRixRQUFRRyxXQUFSLENBQW9CQyxPQUFwQixDQUE0QixDQUE1QixDQUFiO0FBQ0EsVUFBTUMsV0FBV0wsUUFBUUssUUFBUixDQUFpQkQsT0FBakIsQ0FBeUIsQ0FBekIsQ0FBakI7O0FBRUE7QUFDQSw2R0FBZ0IsS0FBS1IsSUFBckIsVUFBOEJNLElBQTlCLGNBQXdDRyxRQUF4Qzs7QUFFQTtBQUNBLFdBQUtYLFNBQUwsQ0FBZVksUUFBZixHQUEwQkMsR0FBMUIsY0FBeUMsS0FBS1osR0FBOUMsRUFBcURhLE1BQXJELENBQTREO0FBQzFETCxxQkFBYUQsSUFENkM7QUFFMURHLGtCQUFVQTtBQUZnRCxPQUE1RDs7QUFLQUksaUJBQVcsWUFBTTtBQUNmLGVBQUtWLEtBQUw7QUFDRCxPQUZELEVBRUcsS0FBS0YsU0FGUjtBQUdEOzs7Ozs7a0JBakNrQlIsTSIsImZpbGUiOiJhbTIzMDIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSHViU2Vuc29yIGZyb20gJ3NlbnNvcnMvaHViLXNlbnNvcic7XG5pbXBvcnQgYmNtIGZyb20gJ25vZGUtZGh0LXNlbnNvcic7XG5cbi8qKlxuICBBTTIzMDIgVGVtcGVyYXR1cmUvSHVtaWRpdHkgU2Vuc29yXG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW0yMzAyIGV4dGVuZHMgSHViU2Vuc29yIHtcblxuICBjb25zdHJ1Y3RvcihmaXJlYmFzZSwgaWQsIHBpbiwgaW50ZXJ2YWwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2ZpcmViYXNlID0gZmlyZWJhc2U7XG4gICAgdGhpcy5faWQgPSBpZDtcbiAgICB0aGlzLl9waW4gPSBwaW47XG4gICAgdGhpcy5faW50ZXJ2YWwgPSBpbnRlcnZhbDtcblxuICAgIC8vIHN0YXJ0XG4gICAgaWYgKGJjbS5pbml0aWFsaXplKDIyLCB0aGlzLl9waW4pKSB7XG4gICAgICB0aGlzLnByb2JlKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gcmVhZCB0ZW1wZXJhdHVyZSBhbmQgaHVtaWRpdHkgYXQgaW50ZXJ2YWxcbiAgcHJvYmUoKSB7XG4gICAgY29uc3QgcmVhZGluZyA9IGJjbS5yZWFkKCk7XG4gICAgY29uc3QgdGVtcCA9IHJlYWRpbmcudGVtcGVyYXR1cmUudG9GaXhlZCgyKTtcbiAgICBjb25zdCBodW1pZGl0eSA9IHJlYWRpbmcuaHVtaWRpdHkudG9GaXhlZCgyKTtcblxuICAgIC8vIGxvZ1xuICAgIHN1cGVyLnJlcG9ydChgJHt0aGlzLl9waW59OiAke3RlbXB9wrBDICR7aHVtaWRpdHl9JWApO1xuXG4gICAgLy8gcmVwb3J0IHRvIGZpcmViYXNlXG4gICAgdGhpcy5fZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoYHNlbnNvcnMvJHt0aGlzLl9pZH1gKS51cGRhdGUoe1xuICAgICAgdGVtcGVyYXR1cmU6IHRlbXAsXG4gICAgICBodW1pZGl0eTogaHVtaWRpdHlcbiAgICB9KTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5wcm9iZSgpO1xuICAgIH0sIHRoaXMuX2ludGVydmFsKTtcbiAgfVxufVxuIl19