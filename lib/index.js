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

var _nodeDhtSensor = require('node-dht-sensor');

var _nodeDhtSensor2 = _interopRequireDefault(_nodeDhtSensor);

var _ds18x = require('ds18x20');

var _ds18x2 = _interopRequireDefault(_ds18x);

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

  // BCM2835 sensors

  // AM2302
  var upper = {
    initialize: function initialize() {
      // P1-37 = GPIO26
      return _nodeDhtSensor2.default.initialize(22, 26);
    },
    read: function read() {
      var readout = _nodeDhtSensor2.default.read();
      console.log('Upper Temperature: ' + readout.temperature.toFixed(2) + 'C, ' + 'humidity: ' + readout.humidity.toFixed(2) + '%');
      setTimeout(function () {
        upper.read();
      }, 1000);
    }
  };

  if (upper.initialize()) {
    upper.read();
  } else {
    console.warn('Failed to initialize upper');
  }

  // DS18B20 - #19 - 28-000007c6390c
  var lower = {
    read: function read() {
      var temp = _ds18x2.default.getAll();
      console.log(temp);

      setTimeout(function () {
        lower.read();
      }, 1000);
    }
  };
  lower.read();

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

//# sourceMappingURL=data:application/json;base64,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QXlELEtBQXpELEdBQ04sWUFETSxHQUNTLFFBQVEsUUFBUixDQUFpQixPQUFqQixDQUF5QixDQUF6QixDQURULEdBQ3VDLEdBRG5EO0FBRUEsaUJBQVcsWUFBVztBQUNwQixjQUFNLElBQU47QUFDRCxPQUZELEVBRUcsSUFGSDtBQUdEO0FBWlcsR0FBZDs7QUFlQSxNQUFJLE1BQU0sVUFBTixFQUFKLEVBQXdCO0FBQ3RCLFVBQU0sSUFBTjtBQUNELEdBRkQsTUFFTztBQUNMLFlBQVEsSUFBUixDQUFhLDRCQUFiO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFNLFFBQVE7QUFDWixVQUFNLGdCQUFXO0FBQ2YsVUFBTSxPQUFPLGdCQUFPLE1BQVAsRUFBYjtBQUNBLGNBQVEsR0FBUixDQUFZLElBQVo7O0FBRUEsaUJBQVcsWUFBVztBQUNwQixjQUFNLElBQU47QUFDRCxPQUZELEVBRUcsSUFGSDtBQUdEO0FBUlcsR0FBZDtBQVVBLFFBQU0sSUFBTjs7QUFFQTtBQUNBO0FBQ0EsT0FBSyxFQUFMLENBQVEsTUFBUixFQUFnQixZQUFXO0FBQ3pCLFlBQVEsR0FBUjtBQUNELEdBRkQ7O0FBSUE7QUFDQSxPQUFLLElBQUwsQ0FBVSxNQUFWLENBQWlCO0FBQ2YsYUFBUztBQURNLEdBQWpCO0FBR0QsQ0E5REQiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmFzcGkgZnJvbSAncmFzcGktaW8nO1xuaW1wb3J0IGZpdmUgZnJvbSAnam9obm55LWZpdmUnO1xuaW1wb3J0IG9sZWQgZnJvbSAnb2xlZC1qcyc7XG5pbXBvcnQgZm9udCBmcm9tICdvbGVkLWZvbnQtNXg3JztcbmltcG9ydCBiY20gZnJvbSAnbm9kZS1kaHQtc2Vuc29yJztcbmltcG9ydCBzZW5zb3IgZnJvbSAnZHMxOHgyMCc7XG5cbi8vIHNldHVwIGJvYXJkXG5jb25zdCBib2FyZCA9IG5ldyBmaXZlLkJvYXJkKHtcbiAgaW86IG5ldyByYXNwaSgpXG59KTtcblxuLy9cbi8qKlxuXG4qL1xuY2xhc3MgRGlzcGxheSB7XG5cbiAgLy8gVE9ETyBtb3ZlIGhlaWdodCwgd2lkdGggYW5kIGFkZHJlc3Mgb2YgZGlzcGxheSB0byBjb25maWdcbiAgLy8gVE9ETyBtYWtlIGRpc3BsYXkgaGFyZHdhcmUgb3B0aW9uYWwuXG4gIC8vICBpZiBzb21lb25lIHdhbnRzIHRvIGJ1aWxkIHRoZSBodWIgd2l0aG91dCBkaXNwbGF5LCBmYWxsYmFjayB0byBjb25zb2xlXG4gIGNvbnN0cnVjdG9yKGJvYXJkLCBmaXZlKSB7XG4gICAgY29uc3QgaGFyZHdhcmUgPSBuZXcgb2xlZChib2FyZCwgZml2ZSwge1xuICAgICAgd2lkdGg6IDEyOCxcbiAgICAgIGhlaWdodDogMzIsXG4gICAgICBhZGRyZXNzOiAweDNDXG4gICAgfSk7XG5cbiAgICB0aGlzLl9kZXZpY2UgPSBoYXJkd2FyZTtcblxuICAgIC8vIHNldHVwIHRvZ2dsZVxuICAgIHRoaXMuX2N1cnJlbnRTdGF0ZSA9IDA7XG4gICAgdGhpcy5fc3RhdGVzID0gW1xuICAgICAgJ29mZicsXG4gICAgICAnZmxvdycsXG4gICAgICAndGVtcC1sb3dlcicsXG4gICAgICAndGVtcC11cHBlcidcbiAgICBdO1xuXG4gICAgLy8gVE9ETyBwaW4gaXMgY29uZmlndXJhYmxlXG4gICAgY29uc3QgdG9nZ2xlID0gbmV3IGZpdmUuQnV0dG9uKCdQMS0zNicpO1xuICAgIHRvZ2dsZS5vbigndXAnLCAoKSA9PiB7XG4gICAgICBsZXQgbmV4dCA9IHRoaXMuX2N1cnJlbnRTdGF0ZSArIDE7XG4gICAgICBpZiAobmV4dCA+PSB0aGlzLl9zdGF0ZXMubGVuZ3RoKSB7XG4gICAgICAgIG5leHQgPSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAobmV4dCA9PT0gMCkge1xuICAgICAgICAvLyBkaXNwbGF5IGlzIG9mZlxuICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMub2ZmKCk7XG5cbiAgICAgIH0gZWxzZSBpZiAobmV4dCA9PT0gMSkge1xuICAgICAgICAvLyBkaXNwbGF5IHNldCB0byBmbG93IG1ldGVyc1xuICAgICAgICB0aGlzLm9uKCk7XG4gICAgICAgIHRoaXMud3JpdGUoJ3RlbXAnKTtcblxuICAgICAgfSBlbHNlIGlmIChuZXh0ID09PSAyKSB7XG4gICAgICAgIC8vIGRpc3BsYXkgc2V0IHRvIGxvd2VyIHRlbXBlcmF0dXJlXG4gICAgICAgIHRoaXMud3JpdGUoJ2xvd2VyJyk7XG5cbiAgICAgIH0gZWxzZSBpZiAobmV4dCA9PT0gMykge1xuICAgICAgICAvLyBkaXNwbGF5IHNldCB0byB1cHBlciB0ZW1wZXJhdHVyZVxuICAgICAgICB0aGlzLndyaXRlKCd1cHBlcicpO1xuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2N1cnJlbnRTdGF0ZSA9IG5leHQ7XG4gICAgfSk7XG5cbiAgICAvLyBjbGVhciBkaXNwbGF5IG9uIGluaXRpYWxpemF0aW9uIC0ganVzdCBpbiBjYXNlXG4gICAgdGhpcy5fZGV2aWNlLnVwZGF0ZSgpO1xuICB9XG5cbiAgLy8gdHJ1biBkaXNwbGF5IG9uXG4gIG9uKCkge1xuICAgIHRoaXMuX2RldmljZS50dXJuT25EaXNwbGF5KCk7XG4gIH1cblxuICAvLyB0dXJuIGRpc3BsYXkgb2ZmXG4gIG9mZigpIHtcbiAgICB0aGlzLl9kZXZpY2UudHVybk9mZkRpc3BsYXkoKTtcbiAgfVxuXG4gIC8vIGNsZWFyIGRpc3BsYXlcbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5fZGV2aWNlLmNsZWFyRGlzcGxheSgpO1xuICB9XG5cbiAgLy8gd3JpdGUgc3RyaW5nIHRvIHNjcmVlblxuICB3cml0ZSh0ZXh0KSB7XG4gICAgdGhpcy5jbGVhcigpO1xuICAgIHRoaXMuX2RldmljZS5zZXRDdXJzb3IoMSwgMSk7XG4gICAgdGhpcy5fZGV2aWNlLndyaXRlU3RyaW5nKGZvbnQsIDEsIHRleHQsIDEsIHRydWUsIDIpO1xuICB9XG5cbn1cblxuLypcblxuKi9cbmNsYXNzIEZsb3dNZXRlciB7XG5cbiAgY29uc3RydWN0b3IoZGV2aWNlLCBkaXNwbGF5KSB7XG4gICAgdGhpcy5fZGV2aWNlID0gZGV2aWNlO1xuICAgIHRoaXMuX2Rpc3BsYXkgPSBkaXNwbGF5O1xuXG4gICAgLy8gdG90YWwgcHVsc2VzIGZyb20gZmxvdyBtZXRlclxuICAgIHZhciBwdWxzZXMgPSAwO1xuXG4gICAgLy8gcHVsc2VzIHBlciBzZXNzaW9uIC0gZ2V0cyByZXNldFxuICAgIHZhciBzZXNzaW9uUHVsc2VzID0gMDtcblxuICAgIC8vIHN0YXRlIG9mIGZsb3cgbWV0ZXJcbiAgICB2YXIgaXNPcGVuID0gZmFsc2U7XG5cbiAgICAvLyBtYXkgcmVxdWlyZSBjYWxpYnJhdGlvblxuICAgIGNvbnN0IHB1bHNlc1BlckxpdGVyID0gNDUwO1xuICAgIGNvbnN0IG91bmNlc1BlckxpdGVyID0gMzMuODE0O1xuICAgIGNvbnN0IHB1bHNlc1Blck91bmNlID0gMTMuMzA4O1xuXG4gICAgdGhpcy5fZGV2aWNlLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBwdWxzZXMrKztcbiAgICAgIHNlc3Npb25QdWxzZXMrKztcbiAgICAgIGlzT3BlbiA9IHRydWU7XG5cbiAgICAgIGxldCBjdXJyZW50U2Vzc2lvbiA9IHNlc3Npb25QdWxzZXM7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKGN1cnJlbnRTZXNzaW9uID09PSBzZXNzaW9uUHVsc2VzKSB7XG4gICAgICAgICAgY29uc3Qgb3VuY2VzID0gTWF0aC5yb3VuZCgoc2Vzc2lvblB1bHNlcyAvIHB1bHNlc1Blck91bmNlKSAqIDEwMCkgLyAxMDA7XG4gICAgICAgICAgdGhpcy5fZGlzcGxheS53cml0ZShgcG91cmVkOiAke291bmNlc30gb3pgKTtcblxuICAgICAgICAgIC8vIHJlc2V0XG4gICAgICAgICAgc2Vzc2lvblB1bHNlcyA9IDA7XG4gICAgICAgICAgaXNPcGVuID0gZmFsc2U7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9kaXNwbGF5LmNsZWFyKCk7XG4gICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgfVxuICAgICAgfSwgMTAwMCk7XG4gICAgfSk7XG4gIH1cbn1cblxuLy8gc2V0dXAgaHViXG5ib2FyZC5vbigncmVhZHknLCBmdW5jdGlvbigpIHtcbiAgLy8gaW5pdGlhbGl6ZSBkaXNwbGF5XG4gIGNvbnN0IGRpc3BsYXkgPSBuZXcgRGlzcGxheShib2FyZCwgZml2ZSk7XG5cbiAgLy8gc2V0dXAgZmxvdyBtZXRlclxuICAvLyBUT0RPIGR5bmFtaWMgZnJvbSBjb25maWd1cmF0aW9uP1xuICBjb25zdCBmT25lID0gbmV3IGZpdmUuU2Vuc29yLkRpZ2l0YWwoJ1AxLTIyJyk7XG4gIGNvbnN0IGZsb3dNZXRlck9uZSA9IG5ldyBGbG93TWV0ZXIoZk9uZSwgZGlzcGxheSk7XG5cbiAgY29uc3QgZlR3byA9IG5ldyBmaXZlLlNlbnNvci5EaWdpdGFsKCdQMS0xOCcpO1xuICBjb25zdCBmbG93TWV0ZXJUd28gPSBuZXcgRmxvd01ldGVyKGZUd28sIGRpc3BsYXkpO1xuXG4gIGNvbnN0IGZUaHJlZSA9IG5ldyBmaXZlLlNlbnNvci5EaWdpdGFsKCdQMS0zOCcpO1xuICBjb25zdCBmbG93TWV0ZXJUaHJlZSA9IG5ldyBGbG93TWV0ZXIoZlRocmVlLCBkaXNwbGF5KTtcblxuICAvLyBCQ00yODM1IHNlbnNvcnNcblxuICAvLyBBTTIzMDJcbiAgY29uc3QgdXBwZXIgPSB7XG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBQMS0zNyA9IEdQSU8yNlxuICAgICAgcmV0dXJuIGJjbS5pbml0aWFsaXplKDIyLCAyNik7XG4gICAgfSxcbiAgICByZWFkOiBmdW5jdGlvbigpIHtcbiAgICAgIGxldCByZWFkb3V0ID0gYmNtLnJlYWQoKTtcbiAgICAgIGNvbnNvbGUubG9nKCdVcHBlciBUZW1wZXJhdHVyZTogJyArIHJlYWRvdXQudGVtcGVyYXR1cmUudG9GaXhlZCgyKSArICdDLCAnICtcbiAgICAgICAgICAgICdodW1pZGl0eTogJyArIHJlYWRvdXQuaHVtaWRpdHkudG9GaXhlZCgyKSArICclJyk7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB1cHBlci5yZWFkKCk7XG4gICAgICB9LCAxMDAwKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKHVwcGVyLmluaXRpYWxpemUoKSkge1xuICAgIHVwcGVyLnJlYWQoKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLndhcm4oJ0ZhaWxlZCB0byBpbml0aWFsaXplIHVwcGVyJyk7XG4gIH1cblxuICAvLyBEUzE4QjIwIC0gIzE5IC0gMjgtMDAwMDA3YzYzOTBjXG4gIGNvbnN0IGxvd2VyID0ge1xuICAgIHJlYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgdGVtcCA9IHNlbnNvci5nZXRBbGwoKTtcbiAgICAgIGNvbnNvbGUubG9nKHRlbXApO1xuXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBsb3dlci5yZWFkKCk7XG4gICAgICB9LCAxMDAwKVxuICAgIH1cbiAgfTtcbiAgbG93ZXIucmVhZCgpO1xuXG4gIC8vIG9uIHNodXRkb3duXG4gIC8vIFRPRE8gbm90aWZ5IHdlYiBhcHAgZXZlbnQgb2NjdXJyZWRcbiAgdGhpcy5vbignZXhpdCcsIGZ1bmN0aW9uKCkge1xuICAgIGRpc3BsYXkub2ZmKCk7XG4gIH0pO1xuXG4gIC8vIGhlbHBlcnMgdG8gYWRkIHRvIFJFUExcbiAgdGhpcy5yZXBsLmluamVjdCh7XG4gICAgZGlzcGxheTogZGlzcGxheVxuICB9KTtcbn0pO1xuIl19