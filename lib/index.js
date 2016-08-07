'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

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

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// setup board
var board = new _johnnyFive2.default.Board({
  io: new _raspiIo2.default()
});

/**

*/

var Display = function () {

  // setup oled display if available - fallback to console
  function Display(board, five) {
    _classCallCheck(this, Display);

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


  _createClass(Display, [{
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

  return Display;
}();

/**
  All hub sensors implement - used for logging
*/


var HubSensor = function () {
  function HubSensor() {
    _classCallCheck(this, HubSensor);
  }

  // report data


  _createClass(HubSensor, [{
    key: 'report',
    value: function report(info) {
      console.log(info);
    }
  }]);

  return HubSensor;
}();

/*

*/


var FlowMeter = function (_HubSensor) {
  _inherits(FlowMeter, _HubSensor);

  function FlowMeter(id, fiveSensor) {
    var display = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    _classCallCheck(this, FlowMeter);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FlowMeter).call(this));

    _this._sensor = fiveSensor;
    _this._display = display;

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

    _this._sensor.on('change', function () {
      pulses++;
      sessionPulses++;
      isOpen = true;

      var currentSession = sessionPulses;
      setTimeout(function () {
        if (currentSession === sessionPulses) {
          var ounces = Math.round(sessionPulses / pulsesPerOunce * 100) / 100;
          var message = id + ' poured: ' + ounces + ' oz';
          _get(Object.getPrototypeOf(FlowMeter.prototype), 'report', _this).call(_this, message);

          // write to display
          if (_this._display && _this._display.getIsOn()) {
            _this._display.write(message);
            setTimeout(function () {
              _this._display.clear();
            }, 500);
          }

          // reset session
          sessionPulses = 0;
          isOpen = false;
        }
      }, 1000);
    });
    return _this;
  }

  return FlowMeter;
}(HubSensor);

/**
  DS18B20 Temperature Sensor
*/


var Ds18b20 = function (_HubSensor2) {
  _inherits(Ds18b20, _HubSensor2);

  function Ds18b20(id, interval) {
    _classCallCheck(this, Ds18b20);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Ds18b20).call(this));

    _this2._id = id;
    _this2._interval = interval;

    // start
    _this2.probe();
    return _this2;
  }

  // read temperatures every interval


  _createClass(Ds18b20, [{
    key: 'probe',
    value: function probe() {
      var _this3 = this;

      var temperatures = _ds18x2.default.getAll();
      var temperature = temperatures[this._id];
      _get(Object.getPrototypeOf(Ds18b20.prototype), 'report', this).call(this, this._id + ': ' + temperature + '°C');

      setTimeout(function () {
        _this3.probe();
      }, this._interval);
    }
  }]);

  return Ds18b20;
}(HubSensor);

/**
  AM2302 Temperature/Humidity Sensor
*/


var Am2302 = function (_HubSensor3) {
  _inherits(Am2302, _HubSensor3);

  function Am2302(pin, interval) {
    _classCallCheck(this, Am2302);

    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Am2302).call(this));

    _this4._pin = pin;
    _this4._interval = interval;

    // start
    if (_nodeDhtSensor2.default.initialize(22, _this4._pin)) {
      _this4.probe();
    }
    return _this4;
  }

  // read temperature and humidity at interval


  _createClass(Am2302, [{
    key: 'probe',
    value: function probe() {
      var _this5 = this;

      var reading = _nodeDhtSensor2.default.read();
      var temp = reading.temperature.toFixed(2);
      var humidity = reading.humidity.toFixed(2);

      _get(Object.getPrototypeOf(Am2302.prototype), 'report', this).call(this, this._pin + ': ' + temp + '°C ' + humidity + '%');
      setTimeout(function () {
        _this5.probe();
      }, this._interval);
    }
  }]);

  return Am2302;
}(HubSensor);

/**
  Activate sensor to write to display
*/


var DisplayToggle = function DisplayToggle(pin, display) {
  var _this6 = this;

  _classCallCheck(this, DisplayToggle);

  this._toggle = new _johnnyFive2.default.Button(pin);
  this._display = display;

  // reset display
  this._display.clear();
  this._display.off();

  // handle toggle
  this._toggle.on('up', function () {
    if (_this6._display.getIsOn()) {
      // turn off display
      // TODO randomize
      _this6._display.write('goodbye');
      setTimeout(function () {
        _this6._display.clear();
        _this6._display.off();
      }, 1000);
    } else {
      // turn on display
      _this6._display.on();

      // TODO randomize
      _this6._display.write('greetings');
      setTimeout(function () {
        _this6._display.clear();
      }, 1000);
    }
  });
};

// setup hub


board.on('ready', function () {
  // initialize display
  var display = new Display(board, _johnnyFive2.default);

  // setup flow meter(s)
  var taps = _config2.default.get('hub.taps');
  taps.forEach(function (tap) {
    var f = new _johnnyFive2.default.Sensor.Digital(tap.pin);
    var flow = new FlowMeter(tap.id, f, display);
  });

  if (taps.length === 0) {
    console.log('no taps found, skipping');
  }

  // upper temperature sensor
  if (_config2.default.has('hardware.temperature.am2302')) {
    var am2302 = _config2.default.get('hardware.temperature.am2302');
    var upper = new Am2302(am2302.pin, am2302.polling);
  } else {
    console.info('no am2302 sensor found, skipping');
  }

  // lower temperature sensor
  if (_config2.default.has('hardware.temperature.ds18b20')) {
    var ds18b20 = _config2.default.get('hardware.temperature.ds18b20');
    var lower = new Ds18b20(ds18b20.address, ds18b20.polling);
  } else {
    console.info('no ds18b20 sensor found, skipping');
  }

  // setup display toggle
  if (_config2.default.has('hardware.display.toggle')) {
    var toggle = _config2.default.get('hardware.display.toggle');
    var displayToggle = new DisplayToggle(toggle, display);
  } else {
    console.log('no display toggle found, skipping');
  }

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

//# sourceMappingURL=data:application/json;base64,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LFNBQVMsaUJBQU8sR0FBUCxDQUFXLHlCQUFYLENBQWY7QUFDQSxRQUFNLGdCQUFnQixJQUFJLGFBQUosQ0FBa0IsTUFBbEIsRUFBMEIsT0FBMUIsQ0FBdEI7QUFDRCxHQUhELE1BR087QUFDTCxZQUFRLEdBQVIsQ0FBWSxtQ0FBWjtBQUNEOztBQUVEO0FBQ0E7QUFDQSxPQUFLLEVBQUwsQ0FBUSxNQUFSLEVBQWdCLFlBQVc7QUFDekIsWUFBUSxHQUFSO0FBQ0QsR0FGRDs7QUFJQTtBQUNBLE9BQUssSUFBTCxDQUFVLE1BQVYsQ0FBaUI7QUFDZixhQUFTO0FBRE0sR0FBakI7QUFHRCxDQWpERCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByYXNwaSBmcm9tICdyYXNwaS1pbyc7XG5pbXBvcnQgZml2ZSBmcm9tICdqb2hubnktZml2ZSc7XG5pbXBvcnQgb2xlZCBmcm9tICdvbGVkLWpzJztcbmltcG9ydCBmb250IGZyb20gJ29sZWQtZm9udC01eDcnO1xuaW1wb3J0IGJjbSBmcm9tICdub2RlLWRodC1zZW5zb3InO1xuaW1wb3J0IHNlbnNvciBmcm9tICdkczE4eDIwJztcbmltcG9ydCBjb25maWcgZnJvbSAnY29uZmlnJztcblxuLy8gc2V0dXAgYm9hcmRcbmNvbnN0IGJvYXJkID0gbmV3IGZpdmUuQm9hcmQoe1xuICBpbzogbmV3IHJhc3BpKClcbn0pO1xuXG4vKipcblxuKi9cbmNsYXNzIERpc3BsYXkge1xuXG4gIC8vIHNldHVwIG9sZWQgZGlzcGxheSBpZiBhdmFpbGFibGUgLSBmYWxsYmFjayB0byBjb25zb2xlXG4gIGNvbnN0cnVjdG9yKGJvYXJkLCBmaXZlKSB7XG4gICAgbGV0IGhhcmR3YXJlID0gbnVsbDtcbiAgICBpZiAoY29uZmlnLmdldCgnaGFyZHdhcmUuZGlzcGxheS5vbGVkJykpIHtcbiAgICAgIGxldCBhZGRyZXNzID0gY29uZmlnLmdldCgnaGFyZHdhcmUuZGlzcGxheS5vbGVkLmFkZHJlc3MnKTtcbiAgICAgIGhhcmR3YXJlID0gbmV3IG9sZWQoYm9hcmQsIGZpdmUsIHtcbiAgICAgICAgd2lkdGg6IGNvbmZpZy5nZXQoJ2hhcmR3YXJlLmRpc3BsYXkub2xlZC53JyksXG4gICAgICAgIGhlaWdodDogY29uZmlnLmdldCgnaGFyZHdhcmUuZGlzcGxheS5vbGVkLmgnKSxcbiAgICAgICAgYWRkcmVzczogcGFyc2VJbnQoYWRkcmVzcywgMTYpXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fZGV2aWNlID0gaGFyZHdhcmU7XG5cbiAgICAgIC8vIGNsZWFyIGRpc3BsYXkgb24gaW5pdGlhbGl6YXRpb24gLSBqdXN0IGluIGNhc2VcbiAgICAgIHRoaXMuX2RldmljZS51cGRhdGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ25vIG9sZWQgZGV2aWNlIGZvdW5kLCBza2lwcGluZycpO1xuICAgIH1cblxuICAgIHRoaXMuX29uID0gZmFsc2U7XG4gIH1cblxuICAvLyB0cnVuIGRpc3BsYXkgb25cbiAgb24oKSB7XG4gICAgdGhpcy5fb24gPSB0cnVlO1xuICAgIGlmICh0aGlzLl9kZXZpY2UpIHtcbiAgICAgIHRoaXMuX2RldmljZS50dXJuT25EaXNwbGF5KCk7XG4gICAgfVxuICB9XG5cbiAgLy8gdHVybiBkaXNwbGF5IG9mZlxuICBvZmYoKSB7XG4gICAgdGhpcy5fb24gPSBmYWxzZTtcbiAgICBpZiAodGhpcy5fZGV2aWNlKSB7XG4gICAgICB0aGlzLl9kZXZpY2UudHVybk9mZkRpc3BsYXkoKTtcbiAgICB9XG4gIH1cblxuICAvLyBjbGVhciBkaXNwbGF5XG4gIGNsZWFyKCkge1xuICAgIGlmICh0aGlzLl9kZXZpY2UpIHtcbiAgICAgIHRoaXMuX2RldmljZS5jbGVhckRpc3BsYXkoKTtcbiAgICB9XG4gIH1cblxuICAvLyB3cml0ZSBzdHJpbmcgdG8gc2NyZWVuXG4gIHdyaXRlKHRleHQpIHtcbiAgICB0aGlzLmNsZWFyKCk7XG4gICAgaWYgKHRoaXMuX2RldmljZSkge1xuICAgICAgdGhpcy5fZGV2aWNlLnNldEN1cnNvcigxLCAxKTtcbiAgICAgIHRoaXMuX2RldmljZS53cml0ZVN0cmluZyhmb250LCAxLCB0ZXh0LCAxLCB0cnVlLCAyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2codGV4dCk7XG4gICAgfVxuICB9XG5cbiAgLy8gaXMgdGhlIGRpc3BsYXkgb25cbiAgZ2V0SXNPbigpIHtcbiAgICByZXR1cm4gdGhpcy5fb247XG4gIH1cbn1cblxuLyoqXG4gIEFsbCBodWIgc2Vuc29ycyBpbXBsZW1lbnQgLSB1c2VkIGZvciBsb2dnaW5nXG4qL1xuY2xhc3MgSHViU2Vuc29yIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgfVxuXG4gIC8vIHJlcG9ydCBkYXRhXG4gIHJlcG9ydChpbmZvKSB7XG4gICAgY29uc29sZS5sb2coaW5mbyk7XG4gIH1cbn1cblxuLypcblxuKi9cbmNsYXNzIEZsb3dNZXRlciBleHRlbmRzIEh1YlNlbnNvciB7XG5cbiAgY29uc3RydWN0b3IoaWQsIGZpdmVTZW5zb3IsIGRpc3BsYXkgPSBudWxsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9zZW5zb3IgPSBmaXZlU2Vuc29yO1xuICAgIHRoaXMuX2Rpc3BsYXkgPSBkaXNwbGF5O1xuXG4gICAgLy8gdG90YWwgcHVsc2VzIGZyb20gZmxvdyBtZXRlclxuICAgIGxldCBwdWxzZXMgPSAwO1xuXG4gICAgLy8gcHVsc2VzIHBlciBzZXNzaW9uIC0gZ2V0cyByZXNldFxuICAgIGxldCBzZXNzaW9uUHVsc2VzID0gMDtcblxuICAgIC8vIHN0YXRlIG9mIGZsb3cgbWV0ZXJcbiAgICBsZXQgaXNPcGVuID0gZmFsc2U7XG5cbiAgICAvLyBtYXkgcmVxdWlyZSBjYWxpYnJhdGlvblxuICAgIGNvbnN0IHB1bHNlc1BlckxpdGVyID0gNDUwO1xuICAgIGNvbnN0IG91bmNlc1BlckxpdGVyID0gMzMuODE0O1xuICAgIGNvbnN0IHB1bHNlc1Blck91bmNlID0gMTMuMzA4O1xuXG4gICAgdGhpcy5fc2Vuc29yLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBwdWxzZXMrKztcbiAgICAgIHNlc3Npb25QdWxzZXMrKztcbiAgICAgIGlzT3BlbiA9IHRydWU7XG5cbiAgICAgIGxldCBjdXJyZW50U2Vzc2lvbiA9IHNlc3Npb25QdWxzZXM7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKGN1cnJlbnRTZXNzaW9uID09PSBzZXNzaW9uUHVsc2VzKSB7XG4gICAgICAgICAgY29uc3Qgb3VuY2VzID0gTWF0aC5yb3VuZCgoc2Vzc2lvblB1bHNlcyAvIHB1bHNlc1Blck91bmNlKSAqIDEwMCkgLyAxMDA7XG4gICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGAke2lkfSBwb3VyZWQ6ICR7b3VuY2VzfSBvemA7XG4gICAgICAgICAgc3VwZXIucmVwb3J0KG1lc3NhZ2UpO1xuXG4gICAgICAgICAgLy8gd3JpdGUgdG8gZGlzcGxheVxuICAgICAgICAgIGlmICh0aGlzLl9kaXNwbGF5ICYmIHRoaXMuX2Rpc3BsYXkuZ2V0SXNPbigpKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXNwbGF5LndyaXRlKG1lc3NhZ2UpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXkuY2xlYXIoKTtcbiAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gcmVzZXQgc2Vzc2lvblxuICAgICAgICAgIHNlc3Npb25QdWxzZXMgPSAwO1xuICAgICAgICAgIGlzT3BlbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9LCAxMDAwKTtcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAgRFMxOEIyMCBUZW1wZXJhdHVyZSBTZW5zb3JcbiovXG5jbGFzcyBEczE4YjIwIGV4dGVuZHMgSHViU2Vuc29yIHtcblxuICBjb25zdHJ1Y3RvcihpZCwgaW50ZXJ2YWwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2lkID0gaWQ7XG4gICAgdGhpcy5faW50ZXJ2YWwgPSBpbnRlcnZhbDtcblxuICAgIC8vIHN0YXJ0XG4gICAgdGhpcy5wcm9iZSgpO1xuICB9XG5cbiAgLy8gcmVhZCB0ZW1wZXJhdHVyZXMgZXZlcnkgaW50ZXJ2YWxcbiAgcHJvYmUoKSB7XG4gICAgY29uc3QgdGVtcGVyYXR1cmVzID0gc2Vuc29yLmdldEFsbCgpO1xuICAgIGNvbnN0IHRlbXBlcmF0dXJlID0gdGVtcGVyYXR1cmVzW3RoaXMuX2lkXTtcbiAgICBzdXBlci5yZXBvcnQoYCR7dGhpcy5faWR9OiAke3RlbXBlcmF0dXJlfcKwQ2ApO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnByb2JlKCk7XG4gICAgfSwgdGhpcy5faW50ZXJ2YWwpO1xuICB9XG59XG5cbi8qKlxuICBBTTIzMDIgVGVtcGVyYXR1cmUvSHVtaWRpdHkgU2Vuc29yXG4qL1xuY2xhc3MgQW0yMzAyIGV4dGVuZHMgSHViU2Vuc29yIHtcblxuICBjb25zdHJ1Y3RvcihwaW4sIGludGVydmFsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9waW4gPSBwaW47XG4gICAgdGhpcy5faW50ZXJ2YWwgPSBpbnRlcnZhbDtcblxuICAgIC8vIHN0YXJ0XG4gICAgaWYgKGJjbS5pbml0aWFsaXplKDIyLCB0aGlzLl9waW4pKSB7XG4gICAgICB0aGlzLnByb2JlKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gcmVhZCB0ZW1wZXJhdHVyZSBhbmQgaHVtaWRpdHkgYXQgaW50ZXJ2YWxcbiAgcHJvYmUoKSB7XG4gICAgY29uc3QgcmVhZGluZyA9IGJjbS5yZWFkKCk7XG4gICAgY29uc3QgdGVtcCA9IHJlYWRpbmcudGVtcGVyYXR1cmUudG9GaXhlZCgyKTtcbiAgICBjb25zdCBodW1pZGl0eSA9IHJlYWRpbmcuaHVtaWRpdHkudG9GaXhlZCgyKTtcblxuICAgIHN1cGVyLnJlcG9ydChgJHt0aGlzLl9waW59OiAke3RlbXB9wrBDICR7aHVtaWRpdHl9JWApO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5wcm9iZSgpO1xuICAgIH0sIHRoaXMuX2ludGVydmFsKTtcbiAgfVxufVxuXG4vKipcbiAgQWN0aXZhdGUgc2Vuc29yIHRvIHdyaXRlIHRvIGRpc3BsYXlcbiovXG5jbGFzcyBEaXNwbGF5VG9nZ2xlIHtcblxuICBjb25zdHJ1Y3RvcihwaW4sIGRpc3BsYXkpIHtcbiAgICB0aGlzLl90b2dnbGUgPSBuZXcgZml2ZS5CdXR0b24ocGluKTtcbiAgICB0aGlzLl9kaXNwbGF5ID0gZGlzcGxheTtcblxuICAgIC8vIHJlc2V0IGRpc3BsYXlcbiAgICB0aGlzLl9kaXNwbGF5LmNsZWFyKCk7XG4gICAgdGhpcy5fZGlzcGxheS5vZmYoKTtcblxuICAgIC8vIGhhbmRsZSB0b2dnbGVcbiAgICB0aGlzLl90b2dnbGUub24oJ3VwJywgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuX2Rpc3BsYXkuZ2V0SXNPbigpKSB7XG4gICAgICAgIC8vIHR1cm4gb2ZmIGRpc3BsYXlcbiAgICAgICAgLy8gVE9ETyByYW5kb21pemVcbiAgICAgICAgdGhpcy5fZGlzcGxheS53cml0ZSgnZ29vZGJ5ZScpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9kaXNwbGF5LmNsZWFyKCk7XG4gICAgICAgICAgdGhpcy5fZGlzcGxheS5vZmYoKTtcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyB0dXJuIG9uIGRpc3BsYXlcbiAgICAgICAgdGhpcy5fZGlzcGxheS5vbigpO1xuXG4gICAgICAgIC8vIFRPRE8gcmFuZG9taXplXG4gICAgICAgIHRoaXMuX2Rpc3BsYXkud3JpdGUoJ2dyZWV0aW5ncycpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9kaXNwbGF5LmNsZWFyKCk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbi8vIHNldHVwIGh1YlxuYm9hcmQub24oJ3JlYWR5JywgZnVuY3Rpb24oKSB7XG4gIC8vIGluaXRpYWxpemUgZGlzcGxheVxuICBjb25zdCBkaXNwbGF5ID0gbmV3IERpc3BsYXkoYm9hcmQsIGZpdmUpO1xuXG4gIC8vIHNldHVwIGZsb3cgbWV0ZXIocylcbiAgY29uc3QgdGFwcyA9IGNvbmZpZy5nZXQoJ2h1Yi50YXBzJyk7XG4gIHRhcHMuZm9yRWFjaCgodGFwKSA9PiB7XG4gICAgY29uc3QgZiA9IG5ldyBmaXZlLlNlbnNvci5EaWdpdGFsKHRhcC5waW4pO1xuICAgIGNvbnN0IGZsb3cgPSBuZXcgRmxvd01ldGVyKHRhcC5pZCwgZiwgZGlzcGxheSk7XG4gIH0pO1xuXG4gIGlmICh0YXBzLmxlbmd0aCA9PT0gMCkge1xuICAgIGNvbnNvbGUubG9nKCdubyB0YXBzIGZvdW5kLCBza2lwcGluZycpO1xuICB9XG5cbiAgLy8gdXBwZXIgdGVtcGVyYXR1cmUgc2Vuc29yXG4gIGlmIChjb25maWcuaGFzKCdoYXJkd2FyZS50ZW1wZXJhdHVyZS5hbTIzMDInKSkge1xuICAgIGNvbnN0IGFtMjMwMiA9IGNvbmZpZy5nZXQoJ2hhcmR3YXJlLnRlbXBlcmF0dXJlLmFtMjMwMicpO1xuICAgIGNvbnN0IHVwcGVyID0gbmV3IEFtMjMwMihhbTIzMDIucGluLCBhbTIzMDIucG9sbGluZyk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5pbmZvKCdubyBhbTIzMDIgc2Vuc29yIGZvdW5kLCBza2lwcGluZycpO1xuICB9XG5cbiAgLy8gbG93ZXIgdGVtcGVyYXR1cmUgc2Vuc29yXG4gIGlmIChjb25maWcuaGFzKCdoYXJkd2FyZS50ZW1wZXJhdHVyZS5kczE4YjIwJykpIHtcbiAgICBjb25zdCBkczE4YjIwID0gY29uZmlnLmdldCgnaGFyZHdhcmUudGVtcGVyYXR1cmUuZHMxOGIyMCcpO1xuICAgIGNvbnN0IGxvd2VyID0gbmV3IERzMThiMjAoZHMxOGIyMC5hZGRyZXNzLCBkczE4YjIwLnBvbGxpbmcpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUuaW5mbygnbm8gZHMxOGIyMCBzZW5zb3IgZm91bmQsIHNraXBwaW5nJyk7XG4gIH1cblxuICAvLyBzZXR1cCBkaXNwbGF5IHRvZ2dsZVxuICBpZiAoY29uZmlnLmhhcygnaGFyZHdhcmUuZGlzcGxheS50b2dnbGUnKSkge1xuICAgIGNvbnN0IHRvZ2dsZSA9IGNvbmZpZy5nZXQoJ2hhcmR3YXJlLmRpc3BsYXkudG9nZ2xlJyk7XG4gICAgY29uc3QgZGlzcGxheVRvZ2dsZSA9IG5ldyBEaXNwbGF5VG9nZ2xlKHRvZ2dsZSwgZGlzcGxheSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coJ25vIGRpc3BsYXkgdG9nZ2xlIGZvdW5kLCBza2lwcGluZycpO1xuICB9XG5cbiAgLy8gb24gc2h1dGRvd25cbiAgLy8gVE9ETyBub3RpZnkgd2ViIGFwcCBldmVudCBvY2N1cnJlZFxuICB0aGlzLm9uKCdleGl0JywgZnVuY3Rpb24oKSB7XG4gICAgZGlzcGxheS5vZmYoKTtcbiAgfSk7XG5cbiAgLy8gaGVscGVycyB0byBhZGQgdG8gUkVQTFxuICB0aGlzLnJlcGwuaW5qZWN0KHtcbiAgICBkaXNwbGF5OiBkaXNwbGF5XG4gIH0pO1xufSk7XG4iXX0=