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

  // TODO move height, width and address of display to config
  function Display(board, five) {
    _classCallCheck(this, Display);

    var hardware = new _oledJs2.default(board, five, {
      width: 128,
      height: 32,
      address: 0x3C
    });

    this._device = hardware;
    this._on = false;

    // clear display on initialization - just in case
    this._device.update();
  }

  // trun display on


  _createClass(Display, [{
    key: 'on',
    value: function on() {
      this._device.turnOnDisplay();
      this._on = true;
    }

    // turn display off

  }, {
    key: 'off',
    value: function off() {
      this._device.turnOffDisplay();
      this._on = false;
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
      }, 500);
    } else {
      // turn on display
      _this6._display.on();

      // TODO randomize
      _this6._display.write('greetings');
      setTimeout(function () {
        _this6._display.clear();
      }, 500);
    }
  });
};

// setup hub


board.on('ready', function () {
  // initialize display
  var display = new Display(board, _johnnyFive2.default);

  // setup flow meter(s)
  // TODO dynamic from configuration?
  var flowMeters = [{
    id: 1,
    pin: 'P1-22'
  }, {
    id: 2,
    pin: 'P1-18'
  }, {
    id: 3,
    pin: 'P1-38'
  }];

  flowMeters.forEach(function (fm) {
    var f = new _johnnyFive2.default.Sensor.Digital(fm.pin);
    var flow = new FlowMeter(fm.id, f, display);
  });

  // upper temperature sensor
  var upper = new Am2302(26, 5000);

  // lower temperature sensor
  var lower = new Ds18b20('28-000007c6390c', 5000);

  // setup display toggle
  var toggle = new DisplayToggle('P1-36', display);

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

//# sourceMappingURL=data:application/json;base64,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QixDQUFWO0FBQ0EsUUFBTSxPQUFPLElBQUksU0FBSixDQUFjLEdBQUcsRUFBakIsRUFBcUIsQ0FBckIsRUFBd0IsT0FBeEIsQ0FBYjtBQUNELEdBSEQ7O0FBS0E7QUFDQSxNQUFNLFFBQVEsSUFBSSxNQUFKLENBQVcsRUFBWCxFQUFlLElBQWYsQ0FBZDs7QUFFQTtBQUNBLE1BQU0sUUFBUSxJQUFJLE9BQUosQ0FBWSxpQkFBWixFQUErQixJQUEvQixDQUFkOztBQUVBO0FBQ0EsTUFBTSxTQUFTLElBQUksYUFBSixDQUFrQixPQUFsQixFQUEyQixPQUEzQixDQUFmOztBQUVBO0FBQ0E7QUFDQSxPQUFLLEVBQUwsQ0FBUSxNQUFSLEVBQWdCLFlBQVc7QUFDekIsWUFBUSxHQUFSO0FBQ0QsR0FGRDs7QUFJQTtBQUNBLE9BQUssSUFBTCxDQUFVLE1BQVYsQ0FBaUI7QUFDZixhQUFTO0FBRE0sR0FBakI7QUFHRCxDQXpDRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByYXNwaSBmcm9tICdyYXNwaS1pbyc7XG5pbXBvcnQgZml2ZSBmcm9tICdqb2hubnktZml2ZSc7XG5pbXBvcnQgb2xlZCBmcm9tICdvbGVkLWpzJztcbmltcG9ydCBmb250IGZyb20gJ29sZWQtZm9udC01eDcnO1xuaW1wb3J0IGJjbSBmcm9tICdub2RlLWRodC1zZW5zb3InO1xuaW1wb3J0IHNlbnNvciBmcm9tICdkczE4eDIwJztcblxuLy8gc2V0dXAgYm9hcmRcbmNvbnN0IGJvYXJkID0gbmV3IGZpdmUuQm9hcmQoe1xuICBpbzogbmV3IHJhc3BpKClcbn0pO1xuXG4vKipcblxuKi9cbmNsYXNzIERpc3BsYXkge1xuXG4gIC8vIFRPRE8gbW92ZSBoZWlnaHQsIHdpZHRoIGFuZCBhZGRyZXNzIG9mIGRpc3BsYXkgdG8gY29uZmlnXG4gIGNvbnN0cnVjdG9yKGJvYXJkLCBmaXZlKSB7XG4gICAgY29uc3QgaGFyZHdhcmUgPSBuZXcgb2xlZChib2FyZCwgZml2ZSwge1xuICAgICAgd2lkdGg6IDEyOCxcbiAgICAgIGhlaWdodDogMzIsXG4gICAgICBhZGRyZXNzOiAweDNDXG4gICAgfSk7XG5cbiAgICB0aGlzLl9kZXZpY2UgPSBoYXJkd2FyZTtcbiAgICB0aGlzLl9vbiA9IGZhbHNlO1xuXG4gICAgLy8gY2xlYXIgZGlzcGxheSBvbiBpbml0aWFsaXphdGlvbiAtIGp1c3QgaW4gY2FzZVxuICAgIHRoaXMuX2RldmljZS51cGRhdGUoKTtcbiAgfVxuXG4gIC8vIHRydW4gZGlzcGxheSBvblxuICBvbigpIHtcbiAgICB0aGlzLl9kZXZpY2UudHVybk9uRGlzcGxheSgpO1xuICAgIHRoaXMuX29uID0gdHJ1ZTtcbiAgfVxuXG4gIC8vIHR1cm4gZGlzcGxheSBvZmZcbiAgb2ZmKCkge1xuICAgIHRoaXMuX2RldmljZS50dXJuT2ZmRGlzcGxheSgpO1xuICAgIHRoaXMuX29uID0gZmFsc2U7XG4gIH1cblxuICAvLyBjbGVhciBkaXNwbGF5XG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX2RldmljZS5jbGVhckRpc3BsYXkoKTtcbiAgfVxuXG4gIC8vIHdyaXRlIHN0cmluZyB0byBzY3JlZW5cbiAgd3JpdGUodGV4dCkge1xuICAgIHRoaXMuY2xlYXIoKTtcbiAgICB0aGlzLl9kZXZpY2Uuc2V0Q3Vyc29yKDEsIDEpO1xuICAgIHRoaXMuX2RldmljZS53cml0ZVN0cmluZyhmb250LCAxLCB0ZXh0LCAxLCB0cnVlLCAyKTtcbiAgfVxuXG4gIC8vIGlzIHRoZSBkaXNwbGF5IG9uXG4gIGdldElzT24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX29uO1xuICB9XG59XG5cbi8qKlxuICBBbGwgaHViIHNlbnNvcnMgaW1wbGVtZW50IC0gdXNlZCBmb3IgbG9nZ2luZ1xuKi9cbmNsYXNzIEh1YlNlbnNvciB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICAvLyByZXBvcnQgZGF0YVxuICByZXBvcnQoaW5mbykge1xuICAgIGNvbnNvbGUubG9nKGluZm8pO1xuICB9XG59XG5cbi8qXG5cbiovXG5jbGFzcyBGbG93TWV0ZXIgZXh0ZW5kcyBIdWJTZW5zb3Ige1xuXG4gIGNvbnN0cnVjdG9yKGlkLCBmaXZlU2Vuc29yLCBkaXNwbGF5ID0gbnVsbCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fc2Vuc29yID0gZml2ZVNlbnNvcjtcbiAgICB0aGlzLl9kaXNwbGF5ID0gZGlzcGxheTtcblxuICAgIC8vIHRvdGFsIHB1bHNlcyBmcm9tIGZsb3cgbWV0ZXJcbiAgICBsZXQgcHVsc2VzID0gMDtcblxuICAgIC8vIHB1bHNlcyBwZXIgc2Vzc2lvbiAtIGdldHMgcmVzZXRcbiAgICBsZXQgc2Vzc2lvblB1bHNlcyA9IDA7XG5cbiAgICAvLyBzdGF0ZSBvZiBmbG93IG1ldGVyXG4gICAgbGV0IGlzT3BlbiA9IGZhbHNlO1xuXG4gICAgLy8gbWF5IHJlcXVpcmUgY2FsaWJyYXRpb25cbiAgICBjb25zdCBwdWxzZXNQZXJMaXRlciA9IDQ1MDtcbiAgICBjb25zdCBvdW5jZXNQZXJMaXRlciA9IDMzLjgxNDtcbiAgICBjb25zdCBwdWxzZXNQZXJPdW5jZSA9IDEzLjMwODtcblxuICAgIHRoaXMuX3NlbnNvci5vbignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgcHVsc2VzKys7XG4gICAgICBzZXNzaW9uUHVsc2VzKys7XG4gICAgICBpc09wZW4gPSB0cnVlO1xuXG4gICAgICBsZXQgY3VycmVudFNlc3Npb24gPSBzZXNzaW9uUHVsc2VzO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmIChjdXJyZW50U2Vzc2lvbiA9PT0gc2Vzc2lvblB1bHNlcykge1xuICAgICAgICAgIGNvbnN0IG91bmNlcyA9IE1hdGgucm91bmQoKHNlc3Npb25QdWxzZXMgLyBwdWxzZXNQZXJPdW5jZSkgKiAxMDApIC8gMTAwO1xuICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBgJHtpZH0gcG91cmVkOiAke291bmNlc30gb3pgO1xuICAgICAgICAgIHN1cGVyLnJlcG9ydChtZXNzYWdlKTtcblxuICAgICAgICAgIC8vIHdyaXRlIHRvIGRpc3BsYXlcbiAgICAgICAgICBpZiAodGhpcy5fZGlzcGxheSAmJiB0aGlzLl9kaXNwbGF5LmdldElzT24oKSkge1xuICAgICAgICAgICAgdGhpcy5fZGlzcGxheS53cml0ZShtZXNzYWdlKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9kaXNwbGF5LmNsZWFyKCk7XG4gICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIHJlc2V0IHNlc3Npb25cbiAgICAgICAgICBzZXNzaW9uUHVsc2VzID0gMDtcbiAgICAgICAgICBpc09wZW4gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSwgMTAwMCk7XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gIERTMThCMjAgVGVtcGVyYXR1cmUgU2Vuc29yXG4qL1xuY2xhc3MgRHMxOGIyMCBleHRlbmRzIEh1YlNlbnNvciB7XG5cbiAgY29uc3RydWN0b3IoaWQsIGludGVydmFsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9pZCA9IGlkO1xuICAgIHRoaXMuX2ludGVydmFsID0gaW50ZXJ2YWw7XG5cbiAgICAvLyBzdGFydFxuICAgIHRoaXMucHJvYmUoKTtcbiAgfVxuXG4gIC8vIHJlYWQgdGVtcGVyYXR1cmVzIGV2ZXJ5IGludGVydmFsXG4gIHByb2JlKCkge1xuICAgIGNvbnN0IHRlbXBlcmF0dXJlcyA9IHNlbnNvci5nZXRBbGwoKTtcbiAgICBjb25zdCB0ZW1wZXJhdHVyZSA9IHRlbXBlcmF0dXJlc1t0aGlzLl9pZF07XG4gICAgc3VwZXIucmVwb3J0KGAke3RoaXMuX2lkfTogJHt0ZW1wZXJhdHVyZX3CsENgKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5wcm9iZSgpO1xuICAgIH0sIHRoaXMuX2ludGVydmFsKTtcbiAgfVxufVxuXG4vKipcbiAgQU0yMzAyIFRlbXBlcmF0dXJlL0h1bWlkaXR5IFNlbnNvclxuKi9cbmNsYXNzIEFtMjMwMiBleHRlbmRzIEh1YlNlbnNvciB7XG5cbiAgY29uc3RydWN0b3IocGluLCBpbnRlcnZhbCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fcGluID0gcGluO1xuICAgIHRoaXMuX2ludGVydmFsID0gaW50ZXJ2YWw7XG5cbiAgICAvLyBzdGFydFxuICAgIGlmIChiY20uaW5pdGlhbGl6ZSgyMiwgdGhpcy5fcGluKSkge1xuICAgICAgdGhpcy5wcm9iZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHJlYWQgdGVtcGVyYXR1cmUgYW5kIGh1bWlkaXR5IGF0IGludGVydmFsXG4gIHByb2JlKCkge1xuICAgIGNvbnN0IHJlYWRpbmcgPSBiY20ucmVhZCgpO1xuICAgIGNvbnN0IHRlbXAgPSByZWFkaW5nLnRlbXBlcmF0dXJlLnRvRml4ZWQoMik7XG4gICAgY29uc3QgaHVtaWRpdHkgPSByZWFkaW5nLmh1bWlkaXR5LnRvRml4ZWQoMik7XG5cbiAgICBzdXBlci5yZXBvcnQoYCR7dGhpcy5fcGlufTogJHt0ZW1wfcKwQyAke2h1bWlkaXR5fSVgKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMucHJvYmUoKTtcbiAgICB9LCB0aGlzLl9pbnRlcnZhbCk7XG4gIH1cbn1cblxuLyoqXG4gIEFjdGl2YXRlIHNlbnNvciB0byB3cml0ZSB0byBkaXNwbGF5XG4qL1xuY2xhc3MgRGlzcGxheVRvZ2dsZSB7XG5cbiAgY29uc3RydWN0b3IocGluLCBkaXNwbGF5KSB7XG4gICAgdGhpcy5fdG9nZ2xlID0gbmV3IGZpdmUuQnV0dG9uKHBpbik7XG4gICAgdGhpcy5fZGlzcGxheSA9IGRpc3BsYXk7XG5cbiAgICAvLyByZXNldCBkaXNwbGF5XG4gICAgdGhpcy5fZGlzcGxheS5jbGVhcigpO1xuICAgIHRoaXMuX2Rpc3BsYXkub2ZmKCk7XG5cbiAgICAvLyBoYW5kbGUgdG9nZ2xlXG4gICAgdGhpcy5fdG9nZ2xlLm9uKCd1cCcsICgpID0+IHtcbiAgICAgIGlmICh0aGlzLl9kaXNwbGF5LmdldElzT24oKSkge1xuICAgICAgICAvLyB0dXJuIG9mZiBkaXNwbGF5XG4gICAgICAgIC8vIFRPRE8gcmFuZG9taXplXG4gICAgICAgIHRoaXMuX2Rpc3BsYXkud3JpdGUoJ2dvb2RieWUnKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fZGlzcGxheS5jbGVhcigpO1xuICAgICAgICAgIHRoaXMuX2Rpc3BsYXkub2ZmKCk7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyB0dXJuIG9uIGRpc3BsYXlcbiAgICAgICAgdGhpcy5fZGlzcGxheS5vbigpO1xuXG4gICAgICAgIC8vIFRPRE8gcmFuZG9taXplXG4gICAgICAgIHRoaXMuX2Rpc3BsYXkud3JpdGUoJ2dyZWV0aW5ncycpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9kaXNwbGF5LmNsZWFyKCk7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuLy8gc2V0dXAgaHViXG5ib2FyZC5vbigncmVhZHknLCBmdW5jdGlvbigpIHtcbiAgLy8gaW5pdGlhbGl6ZSBkaXNwbGF5XG4gIGNvbnN0IGRpc3BsYXkgPSBuZXcgRGlzcGxheShib2FyZCwgZml2ZSk7XG5cbiAgLy8gc2V0dXAgZmxvdyBtZXRlcihzKVxuICAvLyBUT0RPIGR5bmFtaWMgZnJvbSBjb25maWd1cmF0aW9uP1xuICBjb25zdCBmbG93TWV0ZXJzID0gW3tcbiAgICBpZDogMSxcbiAgICBwaW46ICdQMS0yMidcbiAgfSwge1xuICAgIGlkOiAyLFxuICAgIHBpbjogJ1AxLTE4J1xuICB9LCB7XG4gICAgaWQ6IDMsXG4gICAgcGluOiAnUDEtMzgnXG4gIH1dO1xuXG4gIGZsb3dNZXRlcnMuZm9yRWFjaCgoZm0pID0+IHtcbiAgICBjb25zdCBmID0gbmV3IGZpdmUuU2Vuc29yLkRpZ2l0YWwoZm0ucGluKTtcbiAgICBjb25zdCBmbG93ID0gbmV3IEZsb3dNZXRlcihmbS5pZCwgZiwgZGlzcGxheSk7XG4gIH0pO1xuXG4gIC8vIHVwcGVyIHRlbXBlcmF0dXJlIHNlbnNvclxuICBjb25zdCB1cHBlciA9IG5ldyBBbTIzMDIoMjYsIDUwMDApO1xuXG4gIC8vIGxvd2VyIHRlbXBlcmF0dXJlIHNlbnNvclxuICBjb25zdCBsb3dlciA9IG5ldyBEczE4YjIwKCcyOC0wMDAwMDdjNjM5MGMnLCA1MDAwKTtcblxuICAvLyBzZXR1cCBkaXNwbGF5IHRvZ2dsZVxuICBjb25zdCB0b2dnbGUgPSBuZXcgRGlzcGxheVRvZ2dsZSgnUDEtMzYnLCBkaXNwbGF5KTtcblxuICAvLyBvbiBzaHV0ZG93blxuICAvLyBUT0RPIG5vdGlmeSB3ZWIgYXBwIGV2ZW50IG9jY3VycmVkXG4gIHRoaXMub24oJ2V4aXQnLCBmdW5jdGlvbigpIHtcbiAgICBkaXNwbGF5Lm9mZigpO1xuICB9KTtcblxuICAvLyBoZWxwZXJzIHRvIGFkZCB0byBSRVBMXG4gIHRoaXMucmVwbC5pbmplY3Qoe1xuICAgIGRpc3BsYXk6IGRpc3BsYXlcbiAgfSk7XG59KTtcbiJdfQ==