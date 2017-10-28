'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
  Activate sensor to write to display
*/
var DisplayToggle = function () {
  function DisplayToggle(five, pin, display) {
    var _this = this;

    _classCallCheck(this, DisplayToggle);

    this._toggle = new five.Button(pin);
    this._display = display;

    // reset display
    this._display.clear();
    this._display.off();

    // handle toggle
    this._toggle.on('up', function () {
      if (_this._display.getIsOn()) {
        // say goodbye and turn off display
        var goodbye = _this.randomGoodbye();
        _this._display.write(goodbye);
        setTimeout(function () {
          _this._display.clear();
          _this._display.off();
        }, 1000);
      } else {
        // turn on display
        _this._display.on();

        // say hello
        var hello = _this.randomGreeting();
        _this._display.write(hello);
        setTimeout(function () {
          _this._display.clear();
        }, 1000);
      }
    });
  }

  // display a random greeting when turning on the display


  _createClass(DisplayToggle, [{
    key: 'randomGreeting',
    value: function randomGreeting() {
      if (_config2.default.has('hub.display.greetings')) {
        var greetings = _config2.default.get('hub.display.greetings');
        return greetings[Math.floor(Math.random() * greetings.length)];
      }

      return 'hello';
    }

    // display a random goodbye when turning off the display

  }, {
    key: 'randomGoodbye',
    value: function randomGoodbye() {
      if (_config2.default.has('hub.display.goodbyes')) {
        var goodbyes = _config2.default.get('hub.display.goodbyes');
        return goodbyes[Math.floor(Math.random() * goodbyes.length)];
      }

      return 'goodbye';
    }
  }]);

  return DisplayToggle;
}();

exports.default = DisplayToggle;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwbGF5L2Rpc3BsYXktdG9nZ2xlLmpzIl0sIm5hbWVzIjpbIkRpc3BsYXlUb2dnbGUiLCJmaXZlIiwicGluIiwiZGlzcGxheSIsIl90b2dnbGUiLCJCdXR0b24iLCJfZGlzcGxheSIsImNsZWFyIiwib2ZmIiwib24iLCJnZXRJc09uIiwiZ29vZGJ5ZSIsInJhbmRvbUdvb2RieWUiLCJ3cml0ZSIsInNldFRpbWVvdXQiLCJoZWxsbyIsInJhbmRvbUdyZWV0aW5nIiwiaGFzIiwiZ3JlZXRpbmdzIiwiZ2V0IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwibGVuZ3RoIiwiZ29vZGJ5ZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7O0FBRUE7OztJQUdxQkEsYTtBQUVuQix5QkFBWUMsSUFBWixFQUFrQkMsR0FBbEIsRUFBdUJDLE9BQXZCLEVBQWdDO0FBQUE7O0FBQUE7O0FBQzlCLFNBQUtDLE9BQUwsR0FBZSxJQUFJSCxLQUFLSSxNQUFULENBQWdCSCxHQUFoQixDQUFmO0FBQ0EsU0FBS0ksUUFBTCxHQUFnQkgsT0FBaEI7O0FBRUE7QUFDQSxTQUFLRyxRQUFMLENBQWNDLEtBQWQ7QUFDQSxTQUFLRCxRQUFMLENBQWNFLEdBQWQ7O0FBRUE7QUFDQSxTQUFLSixPQUFMLENBQWFLLEVBQWIsQ0FBZ0IsSUFBaEIsRUFBc0IsWUFBTTtBQUMxQixVQUFJLE1BQUtILFFBQUwsQ0FBY0ksT0FBZCxFQUFKLEVBQTZCO0FBQzNCO0FBQ0EsWUFBTUMsVUFBVSxNQUFLQyxhQUFMLEVBQWhCO0FBQ0EsY0FBS04sUUFBTCxDQUFjTyxLQUFkLENBQW9CRixPQUFwQjtBQUNBRyxtQkFBVyxZQUFNO0FBQ2YsZ0JBQUtSLFFBQUwsQ0FBY0MsS0FBZDtBQUNBLGdCQUFLRCxRQUFMLENBQWNFLEdBQWQ7QUFDRCxTQUhELEVBR0csSUFISDtBQUlELE9BUkQsTUFRTztBQUNMO0FBQ0EsY0FBS0YsUUFBTCxDQUFjRyxFQUFkOztBQUVBO0FBQ0EsWUFBTU0sUUFBUSxNQUFLQyxjQUFMLEVBQWQ7QUFDQSxjQUFLVixRQUFMLENBQWNPLEtBQWQsQ0FBb0JFLEtBQXBCO0FBQ0FELG1CQUFXLFlBQU07QUFDZixnQkFBS1IsUUFBTCxDQUFjQyxLQUFkO0FBQ0QsU0FGRCxFQUVHLElBRkg7QUFHRDtBQUNGLEtBcEJEO0FBcUJEOztBQUVEOzs7OztxQ0FDaUI7QUFDZixVQUFJLGlCQUFPVSxHQUFQLENBQVcsdUJBQVgsQ0FBSixFQUF5QztBQUN2QyxZQUFNQyxZQUFZLGlCQUFPQyxHQUFQLENBQVcsdUJBQVgsQ0FBbEI7QUFDQSxlQUFPRCxVQUFVRSxLQUFLQyxLQUFMLENBQVdELEtBQUtFLE1BQUwsS0FBZ0JKLFVBQVVLLE1BQXJDLENBQVYsQ0FBUDtBQUNEOztBQUVELGFBQU8sT0FBUDtBQUNEOztBQUVEOzs7O29DQUNnQjtBQUNkLFVBQUksaUJBQU9OLEdBQVAsQ0FBVyxzQkFBWCxDQUFKLEVBQXdDO0FBQ3RDLFlBQU1PLFdBQVcsaUJBQU9MLEdBQVAsQ0FBVyxzQkFBWCxDQUFqQjtBQUNBLGVBQU9LLFNBQVNKLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsTUFBTCxLQUFnQkUsU0FBU0QsTUFBcEMsQ0FBVCxDQUFQO0FBQ0Q7O0FBRUQsYUFBTyxTQUFQO0FBQ0Q7Ozs7OztrQkFwRGtCdkIsYSIsImZpbGUiOiJkaXNwbGF5LXRvZ2dsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb25maWcgZnJvbSAnY29uZmlnJztcblxuLyoqXG4gIEFjdGl2YXRlIHNlbnNvciB0byB3cml0ZSB0byBkaXNwbGF5XG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlzcGxheVRvZ2dsZSB7XG5cbiAgY29uc3RydWN0b3IoZml2ZSwgcGluLCBkaXNwbGF5KSB7XG4gICAgdGhpcy5fdG9nZ2xlID0gbmV3IGZpdmUuQnV0dG9uKHBpbik7XG4gICAgdGhpcy5fZGlzcGxheSA9IGRpc3BsYXk7XG5cbiAgICAvLyByZXNldCBkaXNwbGF5XG4gICAgdGhpcy5fZGlzcGxheS5jbGVhcigpO1xuICAgIHRoaXMuX2Rpc3BsYXkub2ZmKCk7XG5cbiAgICAvLyBoYW5kbGUgdG9nZ2xlXG4gICAgdGhpcy5fdG9nZ2xlLm9uKCd1cCcsICgpID0+IHtcbiAgICAgIGlmICh0aGlzLl9kaXNwbGF5LmdldElzT24oKSkge1xuICAgICAgICAvLyBzYXkgZ29vZGJ5ZSBhbmQgdHVybiBvZmYgZGlzcGxheVxuICAgICAgICBjb25zdCBnb29kYnllID0gdGhpcy5yYW5kb21Hb29kYnllKCk7XG4gICAgICAgIHRoaXMuX2Rpc3BsYXkud3JpdGUoZ29vZGJ5ZSk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2Rpc3BsYXkuY2xlYXIoKTtcbiAgICAgICAgICB0aGlzLl9kaXNwbGF5Lm9mZigpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHR1cm4gb24gZGlzcGxheVxuICAgICAgICB0aGlzLl9kaXNwbGF5Lm9uKCk7XG5cbiAgICAgICAgLy8gc2F5IGhlbGxvXG4gICAgICAgIGNvbnN0IGhlbGxvID0gdGhpcy5yYW5kb21HcmVldGluZygpO1xuICAgICAgICB0aGlzLl9kaXNwbGF5LndyaXRlKGhlbGxvKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fZGlzcGxheS5jbGVhcigpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIGRpc3BsYXkgYSByYW5kb20gZ3JlZXRpbmcgd2hlbiB0dXJuaW5nIG9uIHRoZSBkaXNwbGF5XG4gIHJhbmRvbUdyZWV0aW5nKCkge1xuICAgIGlmIChjb25maWcuaGFzKCdodWIuZGlzcGxheS5ncmVldGluZ3MnKSkge1xuICAgICAgY29uc3QgZ3JlZXRpbmdzID0gY29uZmlnLmdldCgnaHViLmRpc3BsYXkuZ3JlZXRpbmdzJyk7XG4gICAgICByZXR1cm4gZ3JlZXRpbmdzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdyZWV0aW5ncy5sZW5ndGgpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gJ2hlbGxvJztcbiAgfVxuXG4gIC8vIGRpc3BsYXkgYSByYW5kb20gZ29vZGJ5ZSB3aGVuIHR1cm5pbmcgb2ZmIHRoZSBkaXNwbGF5XG4gIHJhbmRvbUdvb2RieWUoKSB7XG4gICAgaWYgKGNvbmZpZy5oYXMoJ2h1Yi5kaXNwbGF5Lmdvb2RieWVzJykpIHtcbiAgICAgIGNvbnN0IGdvb2RieWVzID0gY29uZmlnLmdldCgnaHViLmRpc3BsYXkuZ29vZGJ5ZXMnKTtcbiAgICAgIHJldHVybiBnb29kYnllc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBnb29kYnllcy5sZW5ndGgpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gJ2dvb2RieWUnO1xuICB9XG59XG4iXX0=