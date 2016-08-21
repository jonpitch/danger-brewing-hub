'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _oledJs = require('oled-js');

var _oledJs2 = _interopRequireDefault(_oledJs);

var _oledFont5x = require('oled-font-5x7');

var _oledFont5x2 = _interopRequireDefault(_oledFont5x);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**

*/
var Ssd1306 = function () {

  // setup oled display if available - fallback to console
  function Ssd1306(board, five) {
    _classCallCheck(this, Ssd1306);

    var address = _config2.default.get('hub.display.address');
    var hardware = new _oledJs2.default(board, five, {
      width: _config2.default.get('hub.display.w'),
      height: _config2.default.get('hub.display.h'),
      address: parseInt(address, 16)
    });

    this._device = hardware;

    // clear display on initialization - just in case
    this._device.update();

    this._on = false;
  }

  // trun display on


  _createClass(Ssd1306, [{
    key: 'on',
    value: function on() {
      this._on = true;
      if (this._device) {
        this._device.turnOnDisplay();
      }
    }

    // turn display off

  }, {
    key: 'off',
    value: function off() {
      this._on = false;
      if (this._device) {
        this._device.turnOffDisplay();
      }
    }

    // clear display

  }, {
    key: 'clear',
    value: function clear() {
      if (this._device) {
        this._device.clearDisplay();
      }
    }

    // write string to screen

  }, {
    key: 'write',
    value: function write(text) {
      this.clear();
      if (this._device) {
        this._device.setCursor(1, 1);
        this._device.writeString(_oledFont5x2.default, 1, text, 1, true, 2);
      } else {
        console.log(text);
      }
    }

    // is the display on

  }, {
    key: 'getIsOn',
    value: function getIsOn() {
      return this._on;
    }
  }]);

  return Ssd1306;
}();

exports.default = Ssd1306;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwbGF5L3NzZDEzMDYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUE7OztJQUdxQixPOztBQUVuQjtBQUNBLG1CQUFZLEtBQVosRUFBbUIsSUFBbkIsRUFBeUI7QUFBQTs7QUFDdkIsUUFBSSxVQUFVLGlCQUFPLEdBQVAsQ0FBVyxxQkFBWCxDQUFkO0FBQ0EsUUFBTSxXQUFXLHFCQUFTLEtBQVQsRUFBZ0IsSUFBaEIsRUFBc0I7QUFDckMsYUFBTyxpQkFBTyxHQUFQLENBQVcsZUFBWCxDQUQ4QjtBQUVyQyxjQUFRLGlCQUFPLEdBQVAsQ0FBVyxlQUFYLENBRjZCO0FBR3JDLGVBQVMsU0FBUyxPQUFULEVBQWtCLEVBQWxCO0FBSDRCLEtBQXRCLENBQWpCOztBQU1BLFNBQUssT0FBTCxHQUFlLFFBQWY7O0FBRUE7QUFDQSxTQUFLLE9BQUwsQ0FBYSxNQUFiOztBQUVBLFNBQUssR0FBTCxHQUFXLEtBQVg7QUFDRDs7QUFFRDs7Ozs7eUJBQ0s7QUFDSCxXQUFLLEdBQUwsR0FBVyxJQUFYO0FBQ0EsVUFBSSxLQUFLLE9BQVQsRUFBa0I7QUFDaEIsYUFBSyxPQUFMLENBQWEsYUFBYjtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7MEJBQ007QUFDSixXQUFLLEdBQUwsR0FBVyxLQUFYO0FBQ0EsVUFBSSxLQUFLLE9BQVQsRUFBa0I7QUFDaEIsYUFBSyxPQUFMLENBQWEsY0FBYjtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7NEJBQ1E7QUFDTixVQUFJLEtBQUssT0FBVCxFQUFrQjtBQUNoQixhQUFLLE9BQUwsQ0FBYSxZQUFiO0FBQ0Q7QUFDRjs7QUFFRDs7OzswQkFDTSxJLEVBQU07QUFDVixXQUFLLEtBQUw7QUFDQSxVQUFJLEtBQUssT0FBVCxFQUFrQjtBQUNoQixhQUFLLE9BQUwsQ0FBYSxTQUFiLENBQXVCLENBQXZCLEVBQTBCLENBQTFCO0FBQ0EsYUFBSyxPQUFMLENBQWEsV0FBYix1QkFBK0IsQ0FBL0IsRUFBa0MsSUFBbEMsRUFBd0MsQ0FBeEMsRUFBMkMsSUFBM0MsRUFBaUQsQ0FBakQ7QUFDRCxPQUhELE1BR087QUFDTCxnQkFBUSxHQUFSLENBQVksSUFBWjtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7OEJBQ1U7QUFDUixhQUFPLEtBQUssR0FBWjtBQUNEOzs7Ozs7a0JBeERrQixPIiwiZmlsZSI6InNzZDEzMDYuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgb2xlZCBmcm9tICdvbGVkLWpzJztcbmltcG9ydCBmb250IGZyb20gJ29sZWQtZm9udC01eDcnO1xuaW1wb3J0IGNvbmZpZyBmcm9tICdjb25maWcnO1xuXG4vKipcblxuKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNzZDEzMDYge1xuXG4gIC8vIHNldHVwIG9sZWQgZGlzcGxheSBpZiBhdmFpbGFibGUgLSBmYWxsYmFjayB0byBjb25zb2xlXG4gIGNvbnN0cnVjdG9yKGJvYXJkLCBmaXZlKSB7XG4gICAgbGV0IGFkZHJlc3MgPSBjb25maWcuZ2V0KCdodWIuZGlzcGxheS5hZGRyZXNzJyk7XG4gICAgY29uc3QgaGFyZHdhcmUgPSBuZXcgb2xlZChib2FyZCwgZml2ZSwge1xuICAgICAgd2lkdGg6IGNvbmZpZy5nZXQoJ2h1Yi5kaXNwbGF5LncnKSxcbiAgICAgIGhlaWdodDogY29uZmlnLmdldCgnaHViLmRpc3BsYXkuaCcpLFxuICAgICAgYWRkcmVzczogcGFyc2VJbnQoYWRkcmVzcywgMTYpXG4gICAgfSk7XG5cbiAgICB0aGlzLl9kZXZpY2UgPSBoYXJkd2FyZTtcblxuICAgIC8vIGNsZWFyIGRpc3BsYXkgb24gaW5pdGlhbGl6YXRpb24gLSBqdXN0IGluIGNhc2VcbiAgICB0aGlzLl9kZXZpY2UudXBkYXRlKCk7XG5cbiAgICB0aGlzLl9vbiA9IGZhbHNlO1xuICB9XG5cbiAgLy8gdHJ1biBkaXNwbGF5IG9uXG4gIG9uKCkge1xuICAgIHRoaXMuX29uID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5fZGV2aWNlKSB7XG4gICAgICB0aGlzLl9kZXZpY2UudHVybk9uRGlzcGxheSgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHR1cm4gZGlzcGxheSBvZmZcbiAgb2ZmKCkge1xuICAgIHRoaXMuX29uID0gZmFsc2U7XG4gICAgaWYgKHRoaXMuX2RldmljZSkge1xuICAgICAgdGhpcy5fZGV2aWNlLnR1cm5PZmZEaXNwbGF5KCk7XG4gICAgfVxuICB9XG5cbiAgLy8gY2xlYXIgZGlzcGxheVxuICBjbGVhcigpIHtcbiAgICBpZiAodGhpcy5fZGV2aWNlKSB7XG4gICAgICB0aGlzLl9kZXZpY2UuY2xlYXJEaXNwbGF5KCk7XG4gICAgfVxuICB9XG5cbiAgLy8gd3JpdGUgc3RyaW5nIHRvIHNjcmVlblxuICB3cml0ZSh0ZXh0KSB7XG4gICAgdGhpcy5jbGVhcigpO1xuICAgIGlmICh0aGlzLl9kZXZpY2UpIHtcbiAgICAgIHRoaXMuX2RldmljZS5zZXRDdXJzb3IoMSwgMSk7XG4gICAgICB0aGlzLl9kZXZpY2Uud3JpdGVTdHJpbmcoZm9udCwgMSwgdGV4dCwgMSwgdHJ1ZSwgMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKHRleHQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlzIHRoZSBkaXNwbGF5IG9uXG4gIGdldElzT24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX29uO1xuICB9XG59XG4iXX0=