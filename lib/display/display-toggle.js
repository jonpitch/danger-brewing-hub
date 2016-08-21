'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
  Activate sensor to write to display
*/
var DisplayToggle = function DisplayToggle(five, pin, display) {
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
      // turn off display
      // TODO randomize
      _this._display.write('goodbye');
      setTimeout(function () {
        _this._display.clear();
        _this._display.off();
      }, 1000);
    } else {
      // turn on display
      _this._display.on();

      // TODO randomize
      _this._display.write('greetings');
      setTimeout(function () {
        _this._display.clear();
      }, 1000);
    }
  });
};

exports.default = DisplayToggle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwbGF5L2Rpc3BsYXktdG9nZ2xlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7OztJQUdxQixhLEdBRW5CLHVCQUFZLElBQVosRUFBa0IsR0FBbEIsRUFBdUIsT0FBdkIsRUFBZ0M7QUFBQTs7QUFBQTs7QUFDOUIsT0FBSyxPQUFMLEdBQWUsSUFBSSxLQUFLLE1BQVQsQ0FBZ0IsR0FBaEIsQ0FBZjtBQUNBLE9BQUssUUFBTCxHQUFnQixPQUFoQjs7QUFFQTtBQUNBLE9BQUssUUFBTCxDQUFjLEtBQWQ7QUFDQSxPQUFLLFFBQUwsQ0FBYyxHQUFkOztBQUVBO0FBQ0EsT0FBSyxPQUFMLENBQWEsRUFBYixDQUFnQixJQUFoQixFQUFzQixZQUFNO0FBQzFCLFFBQUksTUFBSyxRQUFMLENBQWMsT0FBZCxFQUFKLEVBQTZCO0FBQzNCO0FBQ0E7QUFDQSxZQUFLLFFBQUwsQ0FBYyxLQUFkLENBQW9CLFNBQXBCO0FBQ0EsaUJBQVcsWUFBTTtBQUNmLGNBQUssUUFBTCxDQUFjLEtBQWQ7QUFDQSxjQUFLLFFBQUwsQ0FBYyxHQUFkO0FBQ0QsT0FIRCxFQUdHLElBSEg7QUFJRCxLQVJELE1BUU87QUFDTDtBQUNBLFlBQUssUUFBTCxDQUFjLEVBQWQ7O0FBRUE7QUFDQSxZQUFLLFFBQUwsQ0FBYyxLQUFkLENBQW9CLFdBQXBCO0FBQ0EsaUJBQVcsWUFBTTtBQUNmLGNBQUssUUFBTCxDQUFjLEtBQWQ7QUFDRCxPQUZELEVBRUcsSUFGSDtBQUdEO0FBQ0YsR0FuQkQ7QUFvQkQsQzs7a0JBL0JrQixhIiwiZmlsZSI6ImRpc3BsYXktdG9nZ2xlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gIEFjdGl2YXRlIHNlbnNvciB0byB3cml0ZSB0byBkaXNwbGF5XG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlzcGxheVRvZ2dsZSB7XG5cbiAgY29uc3RydWN0b3IoZml2ZSwgcGluLCBkaXNwbGF5KSB7XG4gICAgdGhpcy5fdG9nZ2xlID0gbmV3IGZpdmUuQnV0dG9uKHBpbik7XG4gICAgdGhpcy5fZGlzcGxheSA9IGRpc3BsYXk7XG5cbiAgICAvLyByZXNldCBkaXNwbGF5XG4gICAgdGhpcy5fZGlzcGxheS5jbGVhcigpO1xuICAgIHRoaXMuX2Rpc3BsYXkub2ZmKCk7XG5cbiAgICAvLyBoYW5kbGUgdG9nZ2xlXG4gICAgdGhpcy5fdG9nZ2xlLm9uKCd1cCcsICgpID0+IHtcbiAgICAgIGlmICh0aGlzLl9kaXNwbGF5LmdldElzT24oKSkge1xuICAgICAgICAvLyB0dXJuIG9mZiBkaXNwbGF5XG4gICAgICAgIC8vIFRPRE8gcmFuZG9taXplXG4gICAgICAgIHRoaXMuX2Rpc3BsYXkud3JpdGUoJ2dvb2RieWUnKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fZGlzcGxheS5jbGVhcigpO1xuICAgICAgICAgIHRoaXMuX2Rpc3BsYXkub2ZmKCk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdHVybiBvbiBkaXNwbGF5XG4gICAgICAgIHRoaXMuX2Rpc3BsYXkub24oKTtcblxuICAgICAgICAvLyBUT0RPIHJhbmRvbWl6ZVxuICAgICAgICB0aGlzLl9kaXNwbGF5LndyaXRlKCdncmVldGluZ3MnKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fZGlzcGxheS5jbGVhcigpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19