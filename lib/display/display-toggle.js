'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
  Activate sensor to write to display
*/
var DisplayToggle = function DisplayToggle(pin, display) {
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
//# sourceMappingURL=display-toggle.js.map