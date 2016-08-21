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

    var hardware = null;
    if (_config2.default.get('hardware.display.oled')) {
      var address = _config2.default.get('hardware.display.oled.address');
      hardware = new _oledJs2.default(board, five, {
        width: _config2.default.get('hardware.display.oled.w'),
        height: _config2.default.get('hardware.display.oled.h'),
        address: parseInt(address, 16)
      });

      this._device = hardware;

      // clear display on initialization - just in case
      this._device.update();
    } else {
      console.log('no oled device found, skipping');
    }

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
//# sourceMappingURL=ssd1306.js.map