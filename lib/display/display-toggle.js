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
        var greetings = _config2.default.get('display.greetings');
        return greetings[Math.floor(Math.random() * greetings.length)];
      }

      return 'hello';
    }

    // display a random goodbye when turning off the display

  }, {
    key: 'randomGoodbye',
    value: function randomGoodbye() {
      if (_config2.default.has('hub.display.goodbyes')) {
        var goodbyes = _config2.default.get('goodbyes');
        return goodbyes[Math.floor(Math.random() * goodbyes.length)];
      }

      return 'goodbye';
    }
  }]);

  return DisplayToggle;
}();

exports.default = DisplayToggle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwbGF5L2Rpc3BsYXktdG9nZ2xlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7O0FBRUE7OztJQUdxQixhO0FBRW5CLHlCQUFZLElBQVosRUFBa0IsR0FBbEIsRUFBdUIsT0FBdkIsRUFBZ0M7QUFBQTs7QUFBQTs7QUFDOUIsU0FBSyxPQUFMLEdBQWUsSUFBSSxLQUFLLE1BQVQsQ0FBZ0IsR0FBaEIsQ0FBZjtBQUNBLFNBQUssUUFBTCxHQUFnQixPQUFoQjs7QUFFQTtBQUNBLFNBQUssUUFBTCxDQUFjLEtBQWQ7QUFDQSxTQUFLLFFBQUwsQ0FBYyxHQUFkOztBQUVBO0FBQ0EsU0FBSyxPQUFMLENBQWEsRUFBYixDQUFnQixJQUFoQixFQUFzQixZQUFNO0FBQzFCLFVBQUksTUFBSyxRQUFMLENBQWMsT0FBZCxFQUFKLEVBQTZCO0FBQzNCO0FBQ0EsWUFBTSxVQUFVLE1BQUssYUFBTCxFQUFoQjtBQUNBLGNBQUssUUFBTCxDQUFjLEtBQWQsQ0FBb0IsT0FBcEI7QUFDQSxtQkFBVyxZQUFNO0FBQ2YsZ0JBQUssUUFBTCxDQUFjLEtBQWQ7QUFDQSxnQkFBSyxRQUFMLENBQWMsR0FBZDtBQUNELFNBSEQsRUFHRyxJQUhIO0FBSUQsT0FSRCxNQVFPO0FBQ0w7QUFDQSxjQUFLLFFBQUwsQ0FBYyxFQUFkOztBQUVBO0FBQ0EsWUFBTSxRQUFRLE1BQUssY0FBTCxFQUFkO0FBQ0EsY0FBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixLQUFwQjtBQUNBLG1CQUFXLFlBQU07QUFDZixnQkFBSyxRQUFMLENBQWMsS0FBZDtBQUNELFNBRkQsRUFFRyxJQUZIO0FBR0Q7QUFDRixLQXBCRDtBQXFCRDs7QUFFRDs7Ozs7cUNBQ2lCO0FBQ2YsVUFBSSxpQkFBTyxHQUFQLENBQVcsdUJBQVgsQ0FBSixFQUF5QztBQUN2QyxZQUFNLFlBQVksaUJBQU8sR0FBUCxDQUFXLG1CQUFYLENBQWxCO0FBQ0EsZUFBTyxVQUFVLEtBQUssS0FBTCxDQUFXLEtBQUssTUFBTCxLQUFnQixVQUFVLE1BQXJDLENBQVYsQ0FBUDtBQUNEOztBQUVELGFBQU8sT0FBUDtBQUNEOztBQUVEOzs7O29DQUNnQjtBQUNkLFVBQUksaUJBQU8sR0FBUCxDQUFXLHNCQUFYLENBQUosRUFBd0M7QUFDdEMsWUFBTSxXQUFXLGlCQUFPLEdBQVAsQ0FBVyxVQUFYLENBQWpCO0FBQ0EsZUFBTyxTQUFTLEtBQUssS0FBTCxDQUFXLEtBQUssTUFBTCxLQUFnQixTQUFTLE1BQXBDLENBQVQsQ0FBUDtBQUNEOztBQUVELGFBQU8sU0FBUDtBQUNEOzs7Ozs7a0JBcERrQixhIiwiZmlsZSI6ImRpc3BsYXktdG9nZ2xlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbmZpZyBmcm9tICdjb25maWcnO1xuXG4vKipcbiAgQWN0aXZhdGUgc2Vuc29yIHRvIHdyaXRlIHRvIGRpc3BsYXlcbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaXNwbGF5VG9nZ2xlIHtcblxuICBjb25zdHJ1Y3RvcihmaXZlLCBwaW4sIGRpc3BsYXkpIHtcbiAgICB0aGlzLl90b2dnbGUgPSBuZXcgZml2ZS5CdXR0b24ocGluKTtcbiAgICB0aGlzLl9kaXNwbGF5ID0gZGlzcGxheTtcblxuICAgIC8vIHJlc2V0IGRpc3BsYXlcbiAgICB0aGlzLl9kaXNwbGF5LmNsZWFyKCk7XG4gICAgdGhpcy5fZGlzcGxheS5vZmYoKTtcblxuICAgIC8vIGhhbmRsZSB0b2dnbGVcbiAgICB0aGlzLl90b2dnbGUub24oJ3VwJywgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuX2Rpc3BsYXkuZ2V0SXNPbigpKSB7XG4gICAgICAgIC8vIHNheSBnb29kYnllIGFuZCB0dXJuIG9mZiBkaXNwbGF5XG4gICAgICAgIGNvbnN0IGdvb2RieWUgPSB0aGlzLnJhbmRvbUdvb2RieWUoKTtcbiAgICAgICAgdGhpcy5fZGlzcGxheS53cml0ZShnb29kYnllKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fZGlzcGxheS5jbGVhcigpO1xuICAgICAgICAgIHRoaXMuX2Rpc3BsYXkub2ZmKCk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdHVybiBvbiBkaXNwbGF5XG4gICAgICAgIHRoaXMuX2Rpc3BsYXkub24oKTtcblxuICAgICAgICAvLyBzYXkgaGVsbG9cbiAgICAgICAgY29uc3QgaGVsbG8gPSB0aGlzLnJhbmRvbUdyZWV0aW5nKCk7XG4gICAgICAgIHRoaXMuX2Rpc3BsYXkud3JpdGUoaGVsbG8pO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9kaXNwbGF5LmNsZWFyKCk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gZGlzcGxheSBhIHJhbmRvbSBncmVldGluZyB3aGVuIHR1cm5pbmcgb24gdGhlIGRpc3BsYXlcbiAgcmFuZG9tR3JlZXRpbmcoKSB7XG4gICAgaWYgKGNvbmZpZy5oYXMoJ2h1Yi5kaXNwbGF5LmdyZWV0aW5ncycpKSB7XG4gICAgICBjb25zdCBncmVldGluZ3MgPSBjb25maWcuZ2V0KCdkaXNwbGF5LmdyZWV0aW5ncycpO1xuICAgICAgcmV0dXJuIGdyZWV0aW5nc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBncmVldGluZ3MubGVuZ3RoKV07XG4gICAgfVxuXG4gICAgcmV0dXJuICdoZWxsbyc7XG4gIH1cblxuICAvLyBkaXNwbGF5IGEgcmFuZG9tIGdvb2RieWUgd2hlbiB0dXJuaW5nIG9mZiB0aGUgZGlzcGxheVxuICByYW5kb21Hb29kYnllKCkge1xuICAgIGlmIChjb25maWcuaGFzKCdodWIuZGlzcGxheS5nb29kYnllcycpKSB7XG4gICAgICBjb25zdCBnb29kYnllcyA9IGNvbmZpZy5nZXQoJ2dvb2RieWVzJyk7XG4gICAgICByZXR1cm4gZ29vZGJ5ZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ29vZGJ5ZXMubGVuZ3RoKV07XG4gICAgfVxuXG4gICAgcmV0dXJuICdnb29kYnllJztcbiAgfVxufVxuIl19