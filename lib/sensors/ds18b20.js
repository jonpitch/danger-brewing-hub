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

    var _this = _possibleConstructorReturn(this, (Ds18b20.__proto__ || Object.getPrototypeOf(Ds18b20)).call(this));

    _this._firebase = firebase;
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
      _get(Ds18b20.prototype.__proto__ || Object.getPrototypeOf(Ds18b20.prototype), 'report', this).call(this, this._address + ': ' + temperature + '\xB0C');

      // report to firebase
      this._firebase.database().ref('sensors/' + this._id).update({
        temperature: temperature
      });

      setTimeout(function () {
        _this2.probe();
      }, this._interval);
    }
  }]);

  return Ds18b20;
}(_hubSensor2.default);

exports.default = Ds18b20;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZW5zb3JzL2RzMThiMjAuanMiXSwibmFtZXMiOlsiRHMxOGIyMCIsImZpcmViYXNlIiwiaWQiLCJhZGRyZXNzIiwiaW50ZXJ2YWwiLCJfZmlyZWJhc2UiLCJfaWQiLCJfYWRkcmVzcyIsIl9pbnRlcnZhbCIsInByb2JlIiwidGVtcGVyYXR1cmVzIiwiZ2V0QWxsIiwidGVtcGVyYXR1cmUiLCJkYXRhYmFzZSIsInJlZiIsInVwZGF0ZSIsInNldFRpbWVvdXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7O0lBR3FCQSxPOzs7QUFFbkIsbUJBQVlDLFFBQVosRUFBc0JDLEVBQXRCLEVBQTBCQyxPQUExQixFQUFtQ0MsUUFBbkMsRUFBNkM7QUFBQTs7QUFBQTs7QUFFM0MsVUFBS0MsU0FBTCxHQUFpQkosUUFBakI7QUFDQSxVQUFLSyxHQUFMLEdBQVdKLEVBQVg7QUFDQSxVQUFLSyxRQUFMLEdBQWdCSixPQUFoQjtBQUNBLFVBQUtLLFNBQUwsR0FBaUJKLFFBQWpCOztBQUVBO0FBQ0EsVUFBS0ssS0FBTDtBQVIyQztBQVM1Qzs7QUFFRDs7Ozs7NEJBQ1E7QUFBQTs7QUFDTixVQUFNQyxlQUFlLGdCQUFPQyxNQUFQLEVBQXJCO0FBQ0EsVUFBTUMsY0FBY0YsYUFBYSxLQUFLSCxRQUFsQixDQUFwQjtBQUNBLCtHQUFnQixLQUFLQSxRQUFyQixVQUFrQ0ssV0FBbEM7O0FBRUE7QUFDQSxXQUFLUCxTQUFMLENBQWVRLFFBQWYsR0FBMEJDLEdBQTFCLGNBQXlDLEtBQUtSLEdBQTlDLEVBQXFEUyxNQUFyRCxDQUE0RDtBQUMxREgscUJBQWFBO0FBRDZDLE9BQTVEOztBQUlBSSxpQkFBVyxZQUFNO0FBQ2YsZUFBS1AsS0FBTDtBQUNELE9BRkQsRUFFRyxLQUFLRCxTQUZSO0FBR0Q7Ozs7OztrQkEzQmtCUixPIiwiZmlsZSI6ImRzMThiMjAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSHViU2Vuc29yIGZyb20gJ3NlbnNvcnMvaHViLXNlbnNvcic7XG5pbXBvcnQgc2Vuc29yIGZyb20gJ2RzMTh4MjAnO1xuXG4vKipcbiAgRFMxOEIyMCBUZW1wZXJhdHVyZSBTZW5zb3JcbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEczE4YjIwIGV4dGVuZHMgSHViU2Vuc29yIHtcblxuICBjb25zdHJ1Y3RvcihmaXJlYmFzZSwgaWQsIGFkZHJlc3MsIGludGVydmFsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9maXJlYmFzZSA9IGZpcmViYXNlO1xuICAgIHRoaXMuX2lkID0gaWQ7XG4gICAgdGhpcy5fYWRkcmVzcyA9IGFkZHJlc3M7XG4gICAgdGhpcy5faW50ZXJ2YWwgPSBpbnRlcnZhbDtcblxuICAgIC8vIHN0YXJ0XG4gICAgdGhpcy5wcm9iZSgpO1xuICB9XG5cbiAgLy8gcmVhZCB0ZW1wZXJhdHVyZXMgZXZlcnkgaW50ZXJ2YWxcbiAgcHJvYmUoKSB7XG4gICAgY29uc3QgdGVtcGVyYXR1cmVzID0gc2Vuc29yLmdldEFsbCgpO1xuICAgIGNvbnN0IHRlbXBlcmF0dXJlID0gdGVtcGVyYXR1cmVzW3RoaXMuX2FkZHJlc3NdO1xuICAgIHN1cGVyLnJlcG9ydChgJHt0aGlzLl9hZGRyZXNzfTogJHt0ZW1wZXJhdHVyZX3CsENgKTtcblxuICAgIC8vIHJlcG9ydCB0byBmaXJlYmFzZVxuICAgIHRoaXMuX2ZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGBzZW5zb3JzLyR7dGhpcy5faWR9YCkudXBkYXRlKHtcbiAgICAgIHRlbXBlcmF0dXJlOiB0ZW1wZXJhdHVyZVxuICAgIH0pO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnByb2JlKCk7XG4gICAgfSwgdGhpcy5faW50ZXJ2YWwpO1xuICB9XG59XG4iXX0=