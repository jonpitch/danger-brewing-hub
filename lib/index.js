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
  var fOne = new _johnnyFive2.default.Sensor.Digital('P1-22');
  var flowMeterOne = new FlowMeter(fOne, display);

  var fTwo = new _johnnyFive2.default.Sensor.Digital('P1-18');
  var flowMeterTwo = new FlowMeter(fTwo, display);

  var fThree = new _johnnyFive2.default.Sensor.Digital('P1-38');
  var flowMeterThree = new FlowMeter(fThree, display);

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

//# sourceMappingURL=data:application/json;base64,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QWdCLGNBQWpCLEdBQW1DLEdBQTlDLElBQXFELEdBQXBFO0FBQ0EsZUFBSyxRQUFMLENBQWMsS0FBZCxjQUErQixNQUEvQjs7QUFFQTtBQUNBLHdCQUFnQixDQUFoQjtBQUNBLGlCQUFTLEtBQVQ7QUFDQSxtQkFBVyxZQUFNO0FBQ2YsaUJBQUssUUFBTCxDQUFjLEtBQWQ7QUFDRCxTQUZELEVBRUcsR0FGSDtBQUdEO0FBQ0YsS0FaRCxFQVlHLElBWkg7QUFhRCxHQW5CRDtBQW9CRCxDOztBQUdIOzs7QUFDQSxNQUFNLEVBQU4sQ0FBUyxPQUFULEVBQWtCLFlBQVc7QUFDM0I7QUFDQSxNQUFNLFVBQVUsSUFBSSxPQUFKLENBQVksS0FBWix1QkFBaEI7O0FBRUE7QUFDQTtBQUNBLE1BQU0sT0FBTyxJQUFJLHFCQUFLLE1BQUwsQ0FBWSxPQUFoQixDQUF3QixPQUF4QixDQUFiO0FBQ0EsTUFBTSxlQUFlLElBQUksU0FBSixDQUFjLElBQWQsRUFBb0IsT0FBcEIsQ0FBckI7O0FBRUEsTUFBTSxPQUFPLElBQUkscUJBQUssTUFBTCxDQUFZLE9BQWhCLENBQXdCLE9BQXhCLENBQWI7QUFDQSxNQUFNLGVBQWUsSUFBSSxTQUFKLENBQWMsSUFBZCxFQUFvQixPQUFwQixDQUFyQjs7QUFFQSxNQUFNLFNBQVMsSUFBSSxxQkFBSyxNQUFMLENBQVksT0FBaEIsQ0FBd0IsT0FBeEIsQ0FBZjtBQUNBLE1BQU0saUJBQWlCLElBQUksU0FBSixDQUFjLE1BQWQsRUFBc0IsT0FBdEIsQ0FBdkI7O0FBRUE7QUFDQTtBQUNBLE9BQUssRUFBTCxDQUFRLE1BQVIsRUFBZ0IsWUFBVztBQUN6QixZQUFRLEdBQVI7QUFDRCxHQUZEOztBQUlBO0FBQ0EsT0FBSyxJQUFMLENBQVUsTUFBVixDQUFpQjtBQUNmLGFBQVM7QUFETSxHQUFqQjtBQUdELENBekJEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJhc3BpIGZyb20gJ3Jhc3BpLWlvJztcbmltcG9ydCBmaXZlIGZyb20gJ2pvaG5ueS1maXZlJztcbmltcG9ydCBvbGVkIGZyb20gJ29sZWQtanMnO1xuaW1wb3J0IGZvbnQgZnJvbSAnb2xlZC1mb250LTV4Nyc7XG5cbi8vIHNldHVwIGJvYXJkXG5jb25zdCBib2FyZCA9IG5ldyBmaXZlLkJvYXJkKHtcbiAgaW86IG5ldyByYXNwaSgpXG59KTtcblxuLy9cbi8qKlxuXG4qL1xuY2xhc3MgRGlzcGxheSB7XG5cbiAgLy8gVE9ETyBtb3ZlIGhlaWdodCwgd2lkdGggYW5kIGFkZHJlc3Mgb2YgZGlzcGxheSB0byBjb25maWdcbiAgLy8gVE9ETyBtYWtlIGRpc3BsYXkgaGFyZHdhcmUgb3B0aW9uYWwuXG4gIC8vICBpZiBzb21lb25lIHdhbnRzIHRvIGJ1aWxkIHRoZSBodWIgd2l0aG91dCBkaXNwbGF5LCBmYWxsYmFjayB0byBjb25zb2xlXG4gIGNvbnN0cnVjdG9yKGJvYXJkLCBmaXZlKSB7XG4gICAgY29uc3QgaGFyZHdhcmUgPSBuZXcgb2xlZChib2FyZCwgZml2ZSwge1xuICAgICAgd2lkdGg6IDEyOCxcbiAgICAgIGhlaWdodDogMzIsXG4gICAgICBhZGRyZXNzOiAweDNDXG4gICAgfSk7XG5cbiAgICB0aGlzLl9kZXZpY2UgPSBoYXJkd2FyZTtcblxuICAgIC8vIHNldHVwIHRvZ2dsZVxuICAgIHRoaXMuX2N1cnJlbnRTdGF0ZSA9IDA7XG4gICAgdGhpcy5fc3RhdGVzID0gW1xuICAgICAgJ29mZicsXG4gICAgICAnZmxvdycsXG4gICAgICAndGVtcC1sb3dlcicsXG4gICAgICAndGVtcC11cHBlcidcbiAgICBdO1xuXG4gICAgLy8gVE9ETyBwaW4gaXMgY29uZmlndXJhYmxlXG4gICAgY29uc3QgdG9nZ2xlID0gbmV3IGZpdmUuQnV0dG9uKCdQMS0zNicpO1xuICAgIHRvZ2dsZS5vbigndXAnLCAoKSA9PiB7XG4gICAgICBsZXQgbmV4dCA9IHRoaXMuX2N1cnJlbnRTdGF0ZSArIDE7XG4gICAgICBpZiAobmV4dCA+PSB0aGlzLl9zdGF0ZXMubGVuZ3RoKSB7XG4gICAgICAgIG5leHQgPSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAobmV4dCA9PT0gMCkge1xuICAgICAgICAvLyBkaXNwbGF5IGlzIG9mZlxuICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMub2ZmKCk7XG5cbiAgICAgIH0gZWxzZSBpZiAobmV4dCA9PT0gMSkge1xuICAgICAgICAvLyBkaXNwbGF5IHNldCB0byBmbG93IG1ldGVyc1xuICAgICAgICB0aGlzLm9uKCk7XG4gICAgICAgIHRoaXMud3JpdGUoJ3RlbXAnKTtcblxuICAgICAgfSBlbHNlIGlmIChuZXh0ID09PSAyKSB7XG4gICAgICAgIC8vIGRpc3BsYXkgc2V0IHRvIGxvd2VyIHRlbXBlcmF0dXJlXG4gICAgICAgIHRoaXMud3JpdGUoJ2xvd2VyJyk7XG5cbiAgICAgIH0gZWxzZSBpZiAobmV4dCA9PT0gMykge1xuICAgICAgICAvLyBkaXNwbGF5IHNldCB0byB1cHBlciB0ZW1wZXJhdHVyZVxuICAgICAgICB0aGlzLndyaXRlKCd1cHBlcicpO1xuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2N1cnJlbnRTdGF0ZSA9IG5leHQ7XG4gICAgfSk7XG5cbiAgICAvLyBjbGVhciBkaXNwbGF5IG9uIGluaXRpYWxpemF0aW9uIC0ganVzdCBpbiBjYXNlXG4gICAgdGhpcy5fZGV2aWNlLnVwZGF0ZSgpO1xuICB9XG5cbiAgLy8gdHJ1biBkaXNwbGF5IG9uXG4gIG9uKCkge1xuICAgIHRoaXMuX2RldmljZS50dXJuT25EaXNwbGF5KCk7XG4gIH1cblxuICAvLyB0dXJuIGRpc3BsYXkgb2ZmXG4gIG9mZigpIHtcbiAgICB0aGlzLl9kZXZpY2UudHVybk9mZkRpc3BsYXkoKTtcbiAgfVxuXG4gIC8vIGNsZWFyIGRpc3BsYXlcbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5fZGV2aWNlLmNsZWFyRGlzcGxheSgpO1xuICB9XG5cbiAgLy8gd3JpdGUgc3RyaW5nIHRvIHNjcmVlblxuICB3cml0ZSh0ZXh0KSB7XG4gICAgdGhpcy5jbGVhcigpO1xuICAgIHRoaXMuX2RldmljZS5zZXRDdXJzb3IoMSwgMSk7XG4gICAgdGhpcy5fZGV2aWNlLndyaXRlU3RyaW5nKGZvbnQsIDEsIHRleHQsIDEsIHRydWUsIDIpO1xuICB9XG5cbn1cblxuLypcblxuKi9cbmNsYXNzIEZsb3dNZXRlciB7XG5cbiAgY29uc3RydWN0b3IoZGV2aWNlLCBkaXNwbGF5KSB7XG4gICAgdGhpcy5fZGV2aWNlID0gZGV2aWNlO1xuICAgIHRoaXMuX2Rpc3BsYXkgPSBkaXNwbGF5O1xuXG4gICAgLy8gdG90YWwgcHVsc2VzIGZyb20gZmxvdyBtZXRlclxuICAgIHZhciBwdWxzZXMgPSAwO1xuXG4gICAgLy8gcHVsc2VzIHBlciBzZXNzaW9uIC0gZ2V0cyByZXNldFxuICAgIHZhciBzZXNzaW9uUHVsc2VzID0gMDtcblxuICAgIC8vIHN0YXRlIG9mIGZsb3cgbWV0ZXJcbiAgICB2YXIgaXNPcGVuID0gZmFsc2U7XG5cbiAgICAvLyBtYXkgcmVxdWlyZSBjYWxpYnJhdGlvblxuICAgIGNvbnN0IHB1bHNlc1BlckxpdGVyID0gNDUwO1xuICAgIGNvbnN0IG91bmNlc1BlckxpdGVyID0gMzMuODE0O1xuICAgIGNvbnN0IHB1bHNlc1Blck91bmNlID0gMTMuMzA4O1xuXG4gICAgdGhpcy5fZGV2aWNlLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBwdWxzZXMrKztcbiAgICAgIHNlc3Npb25QdWxzZXMrKztcbiAgICAgIGlzT3BlbiA9IHRydWU7XG5cbiAgICAgIGxldCBjdXJyZW50U2Vzc2lvbiA9IHNlc3Npb25QdWxzZXM7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKGN1cnJlbnRTZXNzaW9uID09PSBzZXNzaW9uUHVsc2VzKSB7XG4gICAgICAgICAgY29uc3Qgb3VuY2VzID0gTWF0aC5yb3VuZCgoc2Vzc2lvblB1bHNlcyAvIHB1bHNlc1Blck91bmNlKSAqIDEwMCkgLyAxMDA7XG4gICAgICAgICAgdGhpcy5fZGlzcGxheS53cml0ZShgcG91cmVkOiAke291bmNlc30gb3pgKTtcblxuICAgICAgICAgIC8vIHJlc2V0XG4gICAgICAgICAgc2Vzc2lvblB1bHNlcyA9IDA7XG4gICAgICAgICAgaXNPcGVuID0gZmFsc2U7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9kaXNwbGF5LmNsZWFyKCk7XG4gICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgfVxuICAgICAgfSwgMTAwMCk7XG4gICAgfSk7XG4gIH1cbn1cblxuLy8gc2V0dXAgaHViXG5ib2FyZC5vbigncmVhZHknLCBmdW5jdGlvbigpIHtcbiAgLy8gaW5pdGlhbGl6ZSBkaXNwbGF5XG4gIGNvbnN0IGRpc3BsYXkgPSBuZXcgRGlzcGxheShib2FyZCwgZml2ZSk7XG5cbiAgLy8gc2V0dXAgZmxvdyBtZXRlclxuICAvLyBUT0RPIGR5bmFtaWMgZnJvbSBjb25maWd1cmF0aW9uP1xuICBjb25zdCBmT25lID0gbmV3IGZpdmUuU2Vuc29yLkRpZ2l0YWwoJ1AxLTIyJyk7XG4gIGNvbnN0IGZsb3dNZXRlck9uZSA9IG5ldyBGbG93TWV0ZXIoZk9uZSwgZGlzcGxheSk7XG5cbiAgY29uc3QgZlR3byA9IG5ldyBmaXZlLlNlbnNvci5EaWdpdGFsKCdQMS0xOCcpO1xuICBjb25zdCBmbG93TWV0ZXJUd28gPSBuZXcgRmxvd01ldGVyKGZUd28sIGRpc3BsYXkpO1xuXG4gIGNvbnN0IGZUaHJlZSA9IG5ldyBmaXZlLlNlbnNvci5EaWdpdGFsKCdQMS0zOCcpO1xuICBjb25zdCBmbG93TWV0ZXJUaHJlZSA9IG5ldyBGbG93TWV0ZXIoZlRocmVlLCBkaXNwbGF5KTtcblxuICAvLyBvbiBzaHV0ZG93blxuICAvLyBUT0RPIG5vdGlmeSB3ZWIgYXBwIGV2ZW50IG9jY3VycmVkXG4gIHRoaXMub24oJ2V4aXQnLCBmdW5jdGlvbigpIHtcbiAgICBkaXNwbGF5Lm9mZigpO1xuICB9KTtcblxuICAvLyBoZWxwZXJzIHRvIGFkZCB0byBSRVBMXG4gIHRoaXMucmVwbC5pbmplY3Qoe1xuICAgIGRpc3BsYXk6IGRpc3BsYXlcbiAgfSk7XG59KTtcbiJdfQ==