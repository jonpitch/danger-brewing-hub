'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _raspiIo = require('raspi-io');

var _raspiIo2 = _interopRequireDefault(_raspiIo);

var _johnnyFive = require('johnny-five');

var _johnnyFive2 = _interopRequireDefault(_johnnyFive);

var _oledJs = require('oled-js');

var _oledJs2 = _interopRequireDefault(_oledJs);

var _oledFont5x = require('oled-font-5x7');

var _oledFont5x2 = _interopRequireDefault(_oledFont5x);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// setup board
var board = new _johnnyFive2.default.Board({
  io: new _raspiIo2.default()
});

//
/**

*/

var Display = function () {

  // TODO move height, width and address of display to config
  // TODO make display hardware optional.
  //  if someone wants to build the hub without display, fallback to console
  function Display(board, five) {
    var _this = this;

    _classCallCheck(this, Display);

    var hardware = new _oledJs2.default(board, five, {
      width: 128,
      height: 32,
      address: 0x3C
    });

    this._device = hardware;

    // setup toggle
    this._currentState = 0;
    this._states = ['off', 'flow', 'temp-lower', 'temp-upper'];

    // TODO pin is configurable
    var toggle = new five.Button('P1-36');
    toggle.on('up', function () {
      var next = _this._currentState + 1;
      if (next >= _this._states.length) {
        next = 0;
      }

      if (next === 0) {
        // display is off
        _this.clear();
        _this.off();
      } else if (next === 1) {
        // display set to flow meters
        _this.on();
        _this.write('temp');
      } else if (next === 2) {
        // display set to lower temperature
        _this.write('lower');
      } else if (next === 3) {
        // display set to upper temperature
        _this.write('upper');
      }

      _this._currentState = next;
    });

    // clear display on initialization - just in case
    this._device.update();
  }

  // trun display on


  _createClass(Display, [{
    key: 'on',
    value: function on() {
      this._device.turnOnDisplay();
    }

    // turn display off

  }, {
    key: 'off',
    value: function off() {
      this._device.turnOffDisplay();
    }

    // clear display

  }, {
    key: 'clear',
    value: function clear() {
      this._device.clearDisplay();
    }

    // write string to screen

  }, {
    key: 'write',
    value: function write(text) {
      this.clear();
      this._device.setCursor(1, 1);
      this._device.writeString(_oledFont5x2.default, 1, text, 1, true, 2);
    }
  }]);

  return Display;
}();

/*

*/


var FlowMeter = function FlowMeter(device, display) {
  var _this2 = this;

  _classCallCheck(this, FlowMeter);

  this._device = device;
  this._display = display;

  // total pulses from flow meter
  var pulses = 0;

  // pulses per session - gets reset
  var sessionPulses = 0;

  // state of flow meter
  var isOpen = false;

  // may require calibration
  var pulsesPerLiter = 450;
  var ouncesPerLiter = 33.814;
  var pulsesPerOunce = 13.308;

  this._device.on('change', function () {
    pulses++;
    sessionPulses++;
    isOpen = true;

    var currentSession = sessionPulses;
    setTimeout(function () {
      if (currentSession === sessionPulses) {
        var ounces = Math.round(sessionPulses / pulsesPerOunce * 100) / 100;
        _this2._display.write('poured: ' + ounces + ' oz');

        // reset
        sessionPulses = 0;
        isOpen = false;
        setTimeout(function () {
          _this2._display.clear();
        }, 500);
      }
    }, 1000);
  });
};

// setup hub


board.on('ready', function () {
  // initialize display
  var display = new Display(board, _johnnyFive2.default);

  // setup flow meter
  // TODO dynamic from configuration?
  // TODO move sensor to flowmeter class
  var f = new _johnnyFive2.default.Sensor.Digital('P1-22');
  var meter = new FlowMeter(f, display);

  // on shutdown
  // TODO notify web app event occurred
  this.on('exit', function () {
    display.off();
  });

  // helpers to add to REPL
  this.repl.inject({
    display: display
  });
});

//# sourceMappingURL=data:application/json;base64,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QWdCLGNBQWpCLEdBQW1DLEdBQTlDLElBQXFELEdBQXBFO0FBQ0EsZUFBSyxRQUFMLENBQWMsS0FBZCxjQUErQixNQUEvQjs7QUFFQTtBQUNBLHdCQUFnQixDQUFoQjtBQUNBLGlCQUFTLEtBQVQ7QUFDQSxtQkFBVyxZQUFNO0FBQ2YsaUJBQUssUUFBTCxDQUFjLEtBQWQ7QUFDRCxTQUZELEVBRUcsR0FGSDtBQUdEO0FBQ0YsS0FaRCxFQVlHLElBWkg7QUFhRCxHQW5CRDtBQW9CRCxDOztBQUdIOzs7QUFDQSxNQUFNLEVBQU4sQ0FBUyxPQUFULEVBQWtCLFlBQVc7QUFDM0I7QUFDQSxNQUFNLFVBQVUsSUFBSSxPQUFKLENBQVksS0FBWix1QkFBaEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTSxJQUFJLElBQUkscUJBQUssTUFBTCxDQUFZLE9BQWhCLENBQXdCLE9BQXhCLENBQVY7QUFDQSxNQUFNLFFBQVEsSUFBSSxTQUFKLENBQWMsQ0FBZCxFQUFpQixPQUFqQixDQUFkOztBQUVBO0FBQ0E7QUFDQSxPQUFLLEVBQUwsQ0FBUSxNQUFSLEVBQWdCLFlBQVc7QUFDekIsWUFBUSxHQUFSO0FBQ0QsR0FGRDs7QUFJQTtBQUNBLE9BQUssSUFBTCxDQUFVLE1BQVYsQ0FBaUI7QUFDZixhQUFTO0FBRE0sR0FBakI7QUFHRCxDQXBCRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByYXNwaSBmcm9tICdyYXNwaS1pbyc7XG5pbXBvcnQgZml2ZSBmcm9tICdqb2hubnktZml2ZSc7XG5pbXBvcnQgb2xlZCBmcm9tICdvbGVkLWpzJztcbmltcG9ydCBmb250IGZyb20gJ29sZWQtZm9udC01eDcnO1xuXG4vLyBzZXR1cCBib2FyZFxuY29uc3QgYm9hcmQgPSBuZXcgZml2ZS5Cb2FyZCh7XG4gIGlvOiBuZXcgcmFzcGkoKVxufSk7XG5cbi8vXG4vKipcblxuKi9cbmNsYXNzIERpc3BsYXkge1xuXG4gIC8vIFRPRE8gbW92ZSBoZWlnaHQsIHdpZHRoIGFuZCBhZGRyZXNzIG9mIGRpc3BsYXkgdG8gY29uZmlnXG4gIC8vIFRPRE8gbWFrZSBkaXNwbGF5IGhhcmR3YXJlIG9wdGlvbmFsLlxuICAvLyAgaWYgc29tZW9uZSB3YW50cyB0byBidWlsZCB0aGUgaHViIHdpdGhvdXQgZGlzcGxheSwgZmFsbGJhY2sgdG8gY29uc29sZVxuICBjb25zdHJ1Y3Rvcihib2FyZCwgZml2ZSkge1xuICAgIGNvbnN0IGhhcmR3YXJlID0gbmV3IG9sZWQoYm9hcmQsIGZpdmUsIHtcbiAgICAgIHdpZHRoOiAxMjgsXG4gICAgICBoZWlnaHQ6IDMyLFxuICAgICAgYWRkcmVzczogMHgzQ1xuICAgIH0pO1xuXG4gICAgdGhpcy5fZGV2aWNlID0gaGFyZHdhcmU7XG5cbiAgICAvLyBzZXR1cCB0b2dnbGVcbiAgICB0aGlzLl9jdXJyZW50U3RhdGUgPSAwO1xuICAgIHRoaXMuX3N0YXRlcyA9IFtcbiAgICAgICdvZmYnLFxuICAgICAgJ2Zsb3cnLFxuICAgICAgJ3RlbXAtbG93ZXInLFxuICAgICAgJ3RlbXAtdXBwZXInXG4gICAgXTtcblxuICAgIC8vIFRPRE8gcGluIGlzIGNvbmZpZ3VyYWJsZVxuICAgIGNvbnN0IHRvZ2dsZSA9IG5ldyBmaXZlLkJ1dHRvbignUDEtMzYnKTtcbiAgICB0b2dnbGUub24oJ3VwJywgKCkgPT4ge1xuICAgICAgbGV0IG5leHQgPSB0aGlzLl9jdXJyZW50U3RhdGUgKyAxO1xuICAgICAgaWYgKG5leHQgPj0gdGhpcy5fc3RhdGVzLmxlbmd0aCkge1xuICAgICAgICBuZXh0ID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKG5leHQgPT09IDApIHtcbiAgICAgICAgLy8gZGlzcGxheSBpcyBvZmZcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICB0aGlzLm9mZigpO1xuXG4gICAgICB9IGVsc2UgaWYgKG5leHQgPT09IDEpIHtcbiAgICAgICAgLy8gZGlzcGxheSBzZXQgdG8gZmxvdyBtZXRlcnNcbiAgICAgICAgdGhpcy5vbigpO1xuICAgICAgICB0aGlzLndyaXRlKCd0ZW1wJyk7XG5cbiAgICAgIH0gZWxzZSBpZiAobmV4dCA9PT0gMikge1xuICAgICAgICAvLyBkaXNwbGF5IHNldCB0byBsb3dlciB0ZW1wZXJhdHVyZVxuICAgICAgICB0aGlzLndyaXRlKCdsb3dlcicpO1xuXG4gICAgICB9IGVsc2UgaWYgKG5leHQgPT09IDMpIHtcbiAgICAgICAgLy8gZGlzcGxheSBzZXQgdG8gdXBwZXIgdGVtcGVyYXR1cmVcbiAgICAgICAgdGhpcy53cml0ZSgndXBwZXInKTtcblxuICAgICAgfVxuXG4gICAgICB0aGlzLl9jdXJyZW50U3RhdGUgPSBuZXh0O1xuICAgIH0pO1xuXG4gICAgLy8gY2xlYXIgZGlzcGxheSBvbiBpbml0aWFsaXphdGlvbiAtIGp1c3QgaW4gY2FzZVxuICAgIHRoaXMuX2RldmljZS51cGRhdGUoKTtcbiAgfVxuXG4gIC8vIHRydW4gZGlzcGxheSBvblxuICBvbigpIHtcbiAgICB0aGlzLl9kZXZpY2UudHVybk9uRGlzcGxheSgpO1xuICB9XG5cbiAgLy8gdHVybiBkaXNwbGF5IG9mZlxuICBvZmYoKSB7XG4gICAgdGhpcy5fZGV2aWNlLnR1cm5PZmZEaXNwbGF5KCk7XG4gIH1cblxuICAvLyBjbGVhciBkaXNwbGF5XG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX2RldmljZS5jbGVhckRpc3BsYXkoKTtcbiAgfVxuXG4gIC8vIHdyaXRlIHN0cmluZyB0byBzY3JlZW5cbiAgd3JpdGUodGV4dCkge1xuICAgIHRoaXMuY2xlYXIoKTtcbiAgICB0aGlzLl9kZXZpY2Uuc2V0Q3Vyc29yKDEsIDEpO1xuICAgIHRoaXMuX2RldmljZS53cml0ZVN0cmluZyhmb250LCAxLCB0ZXh0LCAxLCB0cnVlLCAyKTtcbiAgfVxuXG59XG5cbi8qXG5cbiovXG5jbGFzcyBGbG93TWV0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKGRldmljZSwgZGlzcGxheSkge1xuICAgIHRoaXMuX2RldmljZSA9IGRldmljZTtcbiAgICB0aGlzLl9kaXNwbGF5ID0gZGlzcGxheTtcblxuICAgIC8vIHRvdGFsIHB1bHNlcyBmcm9tIGZsb3cgbWV0ZXJcbiAgICB2YXIgcHVsc2VzID0gMDtcblxuICAgIC8vIHB1bHNlcyBwZXIgc2Vzc2lvbiAtIGdldHMgcmVzZXRcbiAgICB2YXIgc2Vzc2lvblB1bHNlcyA9IDA7XG5cbiAgICAvLyBzdGF0ZSBvZiBmbG93IG1ldGVyXG4gICAgdmFyIGlzT3BlbiA9IGZhbHNlO1xuXG4gICAgLy8gbWF5IHJlcXVpcmUgY2FsaWJyYXRpb25cbiAgICBjb25zdCBwdWxzZXNQZXJMaXRlciA9IDQ1MDtcbiAgICBjb25zdCBvdW5jZXNQZXJMaXRlciA9IDMzLjgxNDtcbiAgICBjb25zdCBwdWxzZXNQZXJPdW5jZSA9IDEzLjMwODtcblxuICAgIHRoaXMuX2RldmljZS5vbignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgcHVsc2VzKys7XG4gICAgICBzZXNzaW9uUHVsc2VzKys7XG4gICAgICBpc09wZW4gPSB0cnVlO1xuXG4gICAgICBsZXQgY3VycmVudFNlc3Npb24gPSBzZXNzaW9uUHVsc2VzO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmIChjdXJyZW50U2Vzc2lvbiA9PT0gc2Vzc2lvblB1bHNlcykge1xuICAgICAgICAgIGNvbnN0IG91bmNlcyA9IE1hdGgucm91bmQoKHNlc3Npb25QdWxzZXMgLyBwdWxzZXNQZXJPdW5jZSkgKiAxMDApIC8gMTAwO1xuICAgICAgICAgIHRoaXMuX2Rpc3BsYXkud3JpdGUoYHBvdXJlZDogJHtvdW5jZXN9IG96YCk7XG5cbiAgICAgICAgICAvLyByZXNldFxuICAgICAgICAgIHNlc3Npb25QdWxzZXMgPSAwO1xuICAgICAgICAgIGlzT3BlbiA9IGZhbHNlO1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fZGlzcGxheS5jbGVhcigpO1xuICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDEwMDApO1xuICAgIH0pO1xuICB9XG59XG5cbi8vIHNldHVwIGh1YlxuYm9hcmQub24oJ3JlYWR5JywgZnVuY3Rpb24oKSB7XG4gIC8vIGluaXRpYWxpemUgZGlzcGxheVxuICBjb25zdCBkaXNwbGF5ID0gbmV3IERpc3BsYXkoYm9hcmQsIGZpdmUpO1xuXG4gIC8vIHNldHVwIGZsb3cgbWV0ZXJcbiAgLy8gVE9ETyBkeW5hbWljIGZyb20gY29uZmlndXJhdGlvbj9cbiAgLy8gVE9ETyBtb3ZlIHNlbnNvciB0byBmbG93bWV0ZXIgY2xhc3NcbiAgY29uc3QgZiA9IG5ldyBmaXZlLlNlbnNvci5EaWdpdGFsKCdQMS0yMicpO1xuICBjb25zdCBtZXRlciA9IG5ldyBGbG93TWV0ZXIoZiwgZGlzcGxheSk7XG5cbiAgLy8gb24gc2h1dGRvd25cbiAgLy8gVE9ETyBub3RpZnkgd2ViIGFwcCBldmVudCBvY2N1cnJlZFxuICB0aGlzLm9uKCdleGl0JywgZnVuY3Rpb24oKSB7XG4gICAgZGlzcGxheS5vZmYoKTtcbiAgfSk7XG5cbiAgLy8gaGVscGVycyB0byBhZGQgdG8gUkVQTFxuICB0aGlzLnJlcGwuaW5qZWN0KHtcbiAgICBkaXNwbGF5OiBkaXNwbGF5XG4gIH0pO1xufSk7XG4iXX0=