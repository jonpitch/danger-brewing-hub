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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwbGF5L3NzZDEzMDYuanMiXSwibmFtZXMiOlsiU3NkMTMwNiIsImJvYXJkIiwiZml2ZSIsImFkZHJlc3MiLCJnZXQiLCJoYXJkd2FyZSIsIndpZHRoIiwiaGVpZ2h0IiwicGFyc2VJbnQiLCJfZGV2aWNlIiwidXBkYXRlIiwiX29uIiwidHVybk9uRGlzcGxheSIsInR1cm5PZmZEaXNwbGF5IiwiY2xlYXJEaXNwbGF5IiwidGV4dCIsImNsZWFyIiwic2V0Q3Vyc29yIiwid3JpdGVTdHJpbmciLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFQTs7O0lBR3FCQSxPOztBQUVuQjtBQUNBLG1CQUFZQyxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUN2QixRQUFJQyxVQUFVLGlCQUFPQyxHQUFQLENBQVcscUJBQVgsQ0FBZDtBQUNBLFFBQU1DLFdBQVcscUJBQVNKLEtBQVQsRUFBZ0JDLElBQWhCLEVBQXNCO0FBQ3JDSSxhQUFPLGlCQUFPRixHQUFQLENBQVcsZUFBWCxDQUQ4QjtBQUVyQ0csY0FBUSxpQkFBT0gsR0FBUCxDQUFXLGVBQVgsQ0FGNkI7QUFHckNELGVBQVNLLFNBQVNMLE9BQVQsRUFBa0IsRUFBbEI7QUFINEIsS0FBdEIsQ0FBakI7O0FBTUEsU0FBS00sT0FBTCxHQUFlSixRQUFmOztBQUVBO0FBQ0EsU0FBS0ksT0FBTCxDQUFhQyxNQUFiOztBQUVBLFNBQUtDLEdBQUwsR0FBVyxLQUFYO0FBQ0Q7O0FBRUQ7Ozs7O3lCQUNLO0FBQ0gsV0FBS0EsR0FBTCxHQUFXLElBQVg7QUFDQSxVQUFJLEtBQUtGLE9BQVQsRUFBa0I7QUFDaEIsYUFBS0EsT0FBTCxDQUFhRyxhQUFiO0FBQ0Q7QUFDRjs7QUFFRDs7OzswQkFDTTtBQUNKLFdBQUtELEdBQUwsR0FBVyxLQUFYO0FBQ0EsVUFBSSxLQUFLRixPQUFULEVBQWtCO0FBQ2hCLGFBQUtBLE9BQUwsQ0FBYUksY0FBYjtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7NEJBQ1E7QUFDTixVQUFJLEtBQUtKLE9BQVQsRUFBa0I7QUFDaEIsYUFBS0EsT0FBTCxDQUFhSyxZQUFiO0FBQ0Q7QUFDRjs7QUFFRDs7OzswQkFDTUMsSSxFQUFNO0FBQ1YsV0FBS0MsS0FBTDtBQUNBLFVBQUksS0FBS1AsT0FBVCxFQUFrQjtBQUNoQixhQUFLQSxPQUFMLENBQWFRLFNBQWIsQ0FBdUIsQ0FBdkIsRUFBMEIsQ0FBMUI7QUFDQSxhQUFLUixPQUFMLENBQWFTLFdBQWIsdUJBQStCLENBQS9CLEVBQWtDSCxJQUFsQyxFQUF3QyxDQUF4QyxFQUEyQyxJQUEzQyxFQUFpRCxDQUFqRDtBQUNELE9BSEQsTUFHTztBQUNMSSxnQkFBUUMsR0FBUixDQUFZTCxJQUFaO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs4QkFDVTtBQUNSLGFBQU8sS0FBS0osR0FBWjtBQUNEOzs7Ozs7a0JBeERrQlgsTyIsImZpbGUiOiJzc2QxMzA2LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG9sZWQgZnJvbSAnb2xlZC1qcyc7XG5pbXBvcnQgZm9udCBmcm9tICdvbGVkLWZvbnQtNXg3JztcbmltcG9ydCBjb25maWcgZnJvbSAnY29uZmlnJztcblxuLyoqXG5cbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTc2QxMzA2IHtcblxuICAvLyBzZXR1cCBvbGVkIGRpc3BsYXkgaWYgYXZhaWxhYmxlIC0gZmFsbGJhY2sgdG8gY29uc29sZVxuICBjb25zdHJ1Y3Rvcihib2FyZCwgZml2ZSkge1xuICAgIGxldCBhZGRyZXNzID0gY29uZmlnLmdldCgnaHViLmRpc3BsYXkuYWRkcmVzcycpO1xuICAgIGNvbnN0IGhhcmR3YXJlID0gbmV3IG9sZWQoYm9hcmQsIGZpdmUsIHtcbiAgICAgIHdpZHRoOiBjb25maWcuZ2V0KCdodWIuZGlzcGxheS53JyksXG4gICAgICBoZWlnaHQ6IGNvbmZpZy5nZXQoJ2h1Yi5kaXNwbGF5LmgnKSxcbiAgICAgIGFkZHJlc3M6IHBhcnNlSW50KGFkZHJlc3MsIDE2KVxuICAgIH0pO1xuXG4gICAgdGhpcy5fZGV2aWNlID0gaGFyZHdhcmU7XG5cbiAgICAvLyBjbGVhciBkaXNwbGF5IG9uIGluaXRpYWxpemF0aW9uIC0ganVzdCBpbiBjYXNlXG4gICAgdGhpcy5fZGV2aWNlLnVwZGF0ZSgpO1xuXG4gICAgdGhpcy5fb24gPSBmYWxzZTtcbiAgfVxuXG4gIC8vIHRydW4gZGlzcGxheSBvblxuICBvbigpIHtcbiAgICB0aGlzLl9vbiA9IHRydWU7XG4gICAgaWYgKHRoaXMuX2RldmljZSkge1xuICAgICAgdGhpcy5fZGV2aWNlLnR1cm5PbkRpc3BsYXkoKTtcbiAgICB9XG4gIH1cblxuICAvLyB0dXJuIGRpc3BsYXkgb2ZmXG4gIG9mZigpIHtcbiAgICB0aGlzLl9vbiA9IGZhbHNlO1xuICAgIGlmICh0aGlzLl9kZXZpY2UpIHtcbiAgICAgIHRoaXMuX2RldmljZS50dXJuT2ZmRGlzcGxheSgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGNsZWFyIGRpc3BsYXlcbiAgY2xlYXIoKSB7XG4gICAgaWYgKHRoaXMuX2RldmljZSkge1xuICAgICAgdGhpcy5fZGV2aWNlLmNsZWFyRGlzcGxheSgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHdyaXRlIHN0cmluZyB0byBzY3JlZW5cbiAgd3JpdGUodGV4dCkge1xuICAgIHRoaXMuY2xlYXIoKTtcbiAgICBpZiAodGhpcy5fZGV2aWNlKSB7XG4gICAgICB0aGlzLl9kZXZpY2Uuc2V0Q3Vyc29yKDEsIDEpO1xuICAgICAgdGhpcy5fZGV2aWNlLndyaXRlU3RyaW5nKGZvbnQsIDEsIHRleHQsIDEsIHRydWUsIDIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyh0ZXh0KTtcbiAgICB9XG4gIH1cblxuICAvLyBpcyB0aGUgZGlzcGxheSBvblxuICBnZXRJc09uKCkge1xuICAgIHJldHVybiB0aGlzLl9vbjtcbiAgfVxufVxuIl19