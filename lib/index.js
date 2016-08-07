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

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

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

      // report to firebase
      // TODO remove hub id - add sensors as relationship
      var hubId = _config2.default.get('hub.id');
      _firebase2.default.database().ref('hubs/' + hubId + '/lowerTemp').set(temperature);

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

      // report to firebase
      // TODO remove hub id - add sensors as relationship
      var hubId = _config2.default.get('hub.id');
      _firebase2.default.database().ref('hubs/' + hubId + '/upperTemp').set(temp);
      _firebase2.default.database().ref('hubs/' + hubId + '/humidity').set(humidity);

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

  var hubId = void 0;
  if (_config2.default.has('hub.id')) {
    hubId = _config2.default.get('hub.id');

    // setup firebase
    var fb = void 0;
    if (_config2.default.has('firebase') && hubId) {
      var firebaseConfig = _config2.default.get('firebase');
      _firebase2.default.initializeApp({
        apiKey: firebaseConfig.get('apiKey'),
        authDomain: firebaseConfig.get('authDomain'),
        databaseURL: firebaseConfig.get('databaseURL'),
        storageBucket: firebaseConfig.get('storageBucket'),
        serviceAccount: firebaseConfig.get('serviceAccountPath')
      });

      // notify web that hub is online
      _firebase2.default.database().ref('hubs/' + hubId + '/status').set('online');

      // setup flow meter(s)
      var taps = _config2.default.get('hub.taps');
      taps.forEach(function (tap) {
        var f = new _johnnyFive2.default.Sensor.Digital(tap.pin);
        var flow = new FlowMeter(tap.id, f, display);
      });

      if (taps.length === 0) {
        console.error('no taps found, skipping');
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
    } else {
      console.error('no firebase config found');
    }
  } else {
    console.error('no hub id found');
  }

  // on shutdown
  this.on('exit', function () {
    // notify application
    _firebase2.default.database().ref('hubs/' + hubId + '/status').set('offline');

    // turn off display hardware
    display.off();
  });

  // helpers to add to REPL
  this.repl.inject({
    display: display
  });
});

//# sourceMappingURL=data:application/json;base64,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Q0FBdEI7QUFDRCxPQUhELE1BR087QUFDTCxnQkFBUSxHQUFSLENBQVksbUNBQVo7QUFDRDtBQUNGLEtBL0NELE1BK0NPO0FBQ0wsY0FBUSxLQUFSLENBQWMsMEJBQWQ7QUFDRDtBQUVGLEdBeERELE1Bd0RPO0FBQ0wsWUFBUSxLQUFSLENBQWMsaUJBQWQ7QUFDRDs7QUFFRDtBQUNBLE9BQUssRUFBTCxDQUFRLE1BQVIsRUFBZ0IsWUFBVztBQUN6QjtBQUNBLHVCQUFTLFFBQVQsR0FBb0IsR0FBcEIsV0FBZ0MsS0FBaEMsY0FBZ0QsR0FBaEQsQ0FBb0QsU0FBcEQ7O0FBRUE7QUFDQSxZQUFRLEdBQVI7QUFDRCxHQU5EOztBQVFBO0FBQ0EsT0FBSyxJQUFMLENBQVUsTUFBVixDQUFpQjtBQUNmLGFBQVM7QUFETSxHQUFqQjtBQUdELENBOUVEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJhc3BpIGZyb20gJ3Jhc3BpLWlvJztcbmltcG9ydCBmaXZlIGZyb20gJ2pvaG5ueS1maXZlJztcbmltcG9ydCBvbGVkIGZyb20gJ29sZWQtanMnO1xuaW1wb3J0IGZvbnQgZnJvbSAnb2xlZC1mb250LTV4Nyc7XG5pbXBvcnQgYmNtIGZyb20gJ25vZGUtZGh0LXNlbnNvcic7XG5pbXBvcnQgc2Vuc29yIGZyb20gJ2RzMTh4MjAnO1xuaW1wb3J0IGNvbmZpZyBmcm9tICdjb25maWcnO1xuaW1wb3J0IGZpcmViYXNlIGZyb20gJ2ZpcmViYXNlJztcblxuLy8gc2V0dXAgYm9hcmRcbmNvbnN0IGJvYXJkID0gbmV3IGZpdmUuQm9hcmQoe1xuICBpbzogbmV3IHJhc3BpKClcbn0pO1xuXG4vKipcblxuKi9cbmNsYXNzIERpc3BsYXkge1xuXG4gIC8vIHNldHVwIG9sZWQgZGlzcGxheSBpZiBhdmFpbGFibGUgLSBmYWxsYmFjayB0byBjb25zb2xlXG4gIGNvbnN0cnVjdG9yKGJvYXJkLCBmaXZlKSB7XG4gICAgbGV0IGhhcmR3YXJlID0gbnVsbDtcbiAgICBpZiAoY29uZmlnLmdldCgnaGFyZHdhcmUuZGlzcGxheS5vbGVkJykpIHtcbiAgICAgIGxldCBhZGRyZXNzID0gY29uZmlnLmdldCgnaGFyZHdhcmUuZGlzcGxheS5vbGVkLmFkZHJlc3MnKTtcbiAgICAgIGhhcmR3YXJlID0gbmV3IG9sZWQoYm9hcmQsIGZpdmUsIHtcbiAgICAgICAgd2lkdGg6IGNvbmZpZy5nZXQoJ2hhcmR3YXJlLmRpc3BsYXkub2xlZC53JyksXG4gICAgICAgIGhlaWdodDogY29uZmlnLmdldCgnaGFyZHdhcmUuZGlzcGxheS5vbGVkLmgnKSxcbiAgICAgICAgYWRkcmVzczogcGFyc2VJbnQoYWRkcmVzcywgMTYpXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fZGV2aWNlID0gaGFyZHdhcmU7XG5cbiAgICAgIC8vIGNsZWFyIGRpc3BsYXkgb24gaW5pdGlhbGl6YXRpb24gLSBqdXN0IGluIGNhc2VcbiAgICAgIHRoaXMuX2RldmljZS51cGRhdGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ25vIG9sZWQgZGV2aWNlIGZvdW5kLCBza2lwcGluZycpO1xuICAgIH1cblxuICAgIHRoaXMuX29uID0gZmFsc2U7XG4gIH1cblxuICAvLyB0cnVuIGRpc3BsYXkgb25cbiAgb24oKSB7XG4gICAgdGhpcy5fb24gPSB0cnVlO1xuICAgIGlmICh0aGlzLl9kZXZpY2UpIHtcbiAgICAgIHRoaXMuX2RldmljZS50dXJuT25EaXNwbGF5KCk7XG4gICAgfVxuICB9XG5cbiAgLy8gdHVybiBkaXNwbGF5IG9mZlxuICBvZmYoKSB7XG4gICAgdGhpcy5fb24gPSBmYWxzZTtcbiAgICBpZiAodGhpcy5fZGV2aWNlKSB7XG4gICAgICB0aGlzLl9kZXZpY2UudHVybk9mZkRpc3BsYXkoKTtcbiAgICB9XG4gIH1cblxuICAvLyBjbGVhciBkaXNwbGF5XG4gIGNsZWFyKCkge1xuICAgIGlmICh0aGlzLl9kZXZpY2UpIHtcbiAgICAgIHRoaXMuX2RldmljZS5jbGVhckRpc3BsYXkoKTtcbiAgICB9XG4gIH1cblxuICAvLyB3cml0ZSBzdHJpbmcgdG8gc2NyZWVuXG4gIHdyaXRlKHRleHQpIHtcbiAgICB0aGlzLmNsZWFyKCk7XG4gICAgaWYgKHRoaXMuX2RldmljZSkge1xuICAgICAgdGhpcy5fZGV2aWNlLnNldEN1cnNvcigxLCAxKTtcbiAgICAgIHRoaXMuX2RldmljZS53cml0ZVN0cmluZyhmb250LCAxLCB0ZXh0LCAxLCB0cnVlLCAyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2codGV4dCk7XG4gICAgfVxuICB9XG5cbiAgLy8gaXMgdGhlIGRpc3BsYXkgb25cbiAgZ2V0SXNPbigpIHtcbiAgICByZXR1cm4gdGhpcy5fb247XG4gIH1cbn1cblxuLyoqXG4gIEFsbCBodWIgc2Vuc29ycyBpbXBsZW1lbnQgLSB1c2VkIGZvciBsb2dnaW5nXG4qL1xuY2xhc3MgSHViU2Vuc29yIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgfVxuXG4gIC8vIHJlcG9ydCBkYXRhXG4gIHJlcG9ydChpbmZvKSB7XG4gICAgY29uc29sZS5sb2coaW5mbyk7XG4gIH1cbn1cblxuLypcblxuKi9cbmNsYXNzIEZsb3dNZXRlciBleHRlbmRzIEh1YlNlbnNvciB7XG5cbiAgY29uc3RydWN0b3IoaWQsIGZpdmVTZW5zb3IsIGRpc3BsYXkgPSBudWxsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9zZW5zb3IgPSBmaXZlU2Vuc29yO1xuICAgIHRoaXMuX2Rpc3BsYXkgPSBkaXNwbGF5O1xuXG4gICAgLy8gdG90YWwgcHVsc2VzIGZyb20gZmxvdyBtZXRlclxuICAgIGxldCBwdWxzZXMgPSAwO1xuXG4gICAgLy8gcHVsc2VzIHBlciBzZXNzaW9uIC0gZ2V0cyByZXNldFxuICAgIGxldCBzZXNzaW9uUHVsc2VzID0gMDtcblxuICAgIC8vIHN0YXRlIG9mIGZsb3cgbWV0ZXJcbiAgICBsZXQgaXNPcGVuID0gZmFsc2U7XG5cbiAgICAvLyBtYXkgcmVxdWlyZSBjYWxpYnJhdGlvblxuICAgIGNvbnN0IHB1bHNlc1BlckxpdGVyID0gNDUwO1xuICAgIGNvbnN0IG91bmNlc1BlckxpdGVyID0gMzMuODE0O1xuICAgIGNvbnN0IHB1bHNlc1Blck91bmNlID0gMTMuMzA4O1xuXG4gICAgdGhpcy5fc2Vuc29yLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBwdWxzZXMrKztcbiAgICAgIHNlc3Npb25QdWxzZXMrKztcbiAgICAgIGlzT3BlbiA9IHRydWU7XG5cbiAgICAgIGxldCBjdXJyZW50U2Vzc2lvbiA9IHNlc3Npb25QdWxzZXM7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKGN1cnJlbnRTZXNzaW9uID09PSBzZXNzaW9uUHVsc2VzKSB7XG4gICAgICAgICAgY29uc3Qgb3VuY2VzID0gTWF0aC5yb3VuZCgoc2Vzc2lvblB1bHNlcyAvIHB1bHNlc1Blck91bmNlKSAqIDEwMCkgLyAxMDA7XG4gICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGAke2lkfSBwb3VyZWQ6ICR7b3VuY2VzfSBvemA7XG4gICAgICAgICAgc3VwZXIucmVwb3J0KG1lc3NhZ2UpO1xuXG4gICAgICAgICAgLy8gd3JpdGUgdG8gZGlzcGxheVxuICAgICAgICAgIGlmICh0aGlzLl9kaXNwbGF5ICYmIHRoaXMuX2Rpc3BsYXkuZ2V0SXNPbigpKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXNwbGF5LndyaXRlKG1lc3NhZ2UpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXkuY2xlYXIoKTtcbiAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gcmVzZXQgc2Vzc2lvblxuICAgICAgICAgIHNlc3Npb25QdWxzZXMgPSAwO1xuICAgICAgICAgIGlzT3BlbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9LCAxMDAwKTtcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAgRFMxOEIyMCBUZW1wZXJhdHVyZSBTZW5zb3JcbiovXG5jbGFzcyBEczE4YjIwIGV4dGVuZHMgSHViU2Vuc29yIHtcblxuICBjb25zdHJ1Y3RvcihpZCwgaW50ZXJ2YWwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2lkID0gaWQ7XG4gICAgdGhpcy5faW50ZXJ2YWwgPSBpbnRlcnZhbDtcblxuICAgIC8vIHN0YXJ0XG4gICAgdGhpcy5wcm9iZSgpO1xuICB9XG5cbiAgLy8gcmVhZCB0ZW1wZXJhdHVyZXMgZXZlcnkgaW50ZXJ2YWxcbiAgcHJvYmUoKSB7XG4gICAgY29uc3QgdGVtcGVyYXR1cmVzID0gc2Vuc29yLmdldEFsbCgpO1xuICAgIGNvbnN0IHRlbXBlcmF0dXJlID0gdGVtcGVyYXR1cmVzW3RoaXMuX2lkXTtcbiAgICBzdXBlci5yZXBvcnQoYCR7dGhpcy5faWR9OiAke3RlbXBlcmF0dXJlfcKwQ2ApO1xuXG4gICAgLy8gcmVwb3J0IHRvIGZpcmViYXNlXG4gICAgLy8gVE9ETyByZW1vdmUgaHViIGlkIC0gYWRkIHNlbnNvcnMgYXMgcmVsYXRpb25zaGlwXG4gICAgY29uc3QgaHViSWQgPSBjb25maWcuZ2V0KCdodWIuaWQnKTtcbiAgICBmaXJlYmFzZS5kYXRhYmFzZSgpLnJlZihgaHVicy8ke2h1YklkfS9sb3dlclRlbXBgKS5zZXQodGVtcGVyYXR1cmUpO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnByb2JlKCk7XG4gICAgfSwgdGhpcy5faW50ZXJ2YWwpO1xuICB9XG59XG5cbi8qKlxuICBBTTIzMDIgVGVtcGVyYXR1cmUvSHVtaWRpdHkgU2Vuc29yXG4qL1xuY2xhc3MgQW0yMzAyIGV4dGVuZHMgSHViU2Vuc29yIHtcblxuICBjb25zdHJ1Y3RvcihwaW4sIGludGVydmFsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9waW4gPSBwaW47XG4gICAgdGhpcy5faW50ZXJ2YWwgPSBpbnRlcnZhbDtcblxuICAgIC8vIHN0YXJ0XG4gICAgaWYgKGJjbS5pbml0aWFsaXplKDIyLCB0aGlzLl9waW4pKSB7XG4gICAgICB0aGlzLnByb2JlKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gcmVhZCB0ZW1wZXJhdHVyZSBhbmQgaHVtaWRpdHkgYXQgaW50ZXJ2YWxcbiAgcHJvYmUoKSB7XG4gICAgY29uc3QgcmVhZGluZyA9IGJjbS5yZWFkKCk7XG4gICAgY29uc3QgdGVtcCA9IHJlYWRpbmcudGVtcGVyYXR1cmUudG9GaXhlZCgyKTtcbiAgICBjb25zdCBodW1pZGl0eSA9IHJlYWRpbmcuaHVtaWRpdHkudG9GaXhlZCgyKTtcblxuICAgIHN1cGVyLnJlcG9ydChgJHt0aGlzLl9waW59OiAke3RlbXB9wrBDICR7aHVtaWRpdHl9JWApO1xuXG4gICAgLy8gcmVwb3J0IHRvIGZpcmViYXNlXG4gICAgLy8gVE9ETyByZW1vdmUgaHViIGlkIC0gYWRkIHNlbnNvcnMgYXMgcmVsYXRpb25zaGlwXG4gICAgY29uc3QgaHViSWQgPSBjb25maWcuZ2V0KCdodWIuaWQnKTtcbiAgICBmaXJlYmFzZS5kYXRhYmFzZSgpLnJlZihgaHVicy8ke2h1YklkfS91cHBlclRlbXBgKS5zZXQodGVtcCk7XG4gICAgZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoYGh1YnMvJHtodWJJZH0vaHVtaWRpdHlgKS5zZXQoaHVtaWRpdHkpO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnByb2JlKCk7XG4gICAgfSwgdGhpcy5faW50ZXJ2YWwpO1xuICB9XG59XG5cbi8qKlxuICBBY3RpdmF0ZSBzZW5zb3IgdG8gd3JpdGUgdG8gZGlzcGxheVxuKi9cbmNsYXNzIERpc3BsYXlUb2dnbGUge1xuXG4gIGNvbnN0cnVjdG9yKHBpbiwgZGlzcGxheSkge1xuICAgIHRoaXMuX3RvZ2dsZSA9IG5ldyBmaXZlLkJ1dHRvbihwaW4pO1xuICAgIHRoaXMuX2Rpc3BsYXkgPSBkaXNwbGF5O1xuXG4gICAgLy8gcmVzZXQgZGlzcGxheVxuICAgIHRoaXMuX2Rpc3BsYXkuY2xlYXIoKTtcbiAgICB0aGlzLl9kaXNwbGF5Lm9mZigpO1xuXG4gICAgLy8gaGFuZGxlIHRvZ2dsZVxuICAgIHRoaXMuX3RvZ2dsZS5vbigndXAnLCAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5fZGlzcGxheS5nZXRJc09uKCkpIHtcbiAgICAgICAgLy8gdHVybiBvZmYgZGlzcGxheVxuICAgICAgICAvLyBUT0RPIHJhbmRvbWl6ZVxuICAgICAgICB0aGlzLl9kaXNwbGF5LndyaXRlKCdnb29kYnllJyk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2Rpc3BsYXkuY2xlYXIoKTtcbiAgICAgICAgICB0aGlzLl9kaXNwbGF5Lm9mZigpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHR1cm4gb24gZGlzcGxheVxuICAgICAgICB0aGlzLl9kaXNwbGF5Lm9uKCk7XG5cbiAgICAgICAgLy8gVE9ETyByYW5kb21pemVcbiAgICAgICAgdGhpcy5fZGlzcGxheS53cml0ZSgnZ3JlZXRpbmdzJyk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2Rpc3BsYXkuY2xlYXIoKTtcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuLy8gc2V0dXAgaHViXG5ib2FyZC5vbigncmVhZHknLCBmdW5jdGlvbigpIHtcbiAgLy8gaW5pdGlhbGl6ZSBkaXNwbGF5XG4gIGNvbnN0IGRpc3BsYXkgPSBuZXcgRGlzcGxheShib2FyZCwgZml2ZSk7XG5cbiAgbGV0IGh1YklkO1xuICBpZiAoY29uZmlnLmhhcygnaHViLmlkJykpIHtcbiAgICBodWJJZCA9IGNvbmZpZy5nZXQoJ2h1Yi5pZCcpO1xuXG4gICAgLy8gc2V0dXAgZmlyZWJhc2VcbiAgICBsZXQgZmI7XG4gICAgaWYgKGNvbmZpZy5oYXMoJ2ZpcmViYXNlJykgJiYgaHViSWQpIHtcbiAgICAgIGNvbnN0IGZpcmViYXNlQ29uZmlnID0gY29uZmlnLmdldCgnZmlyZWJhc2UnKTtcbiAgICAgIGZpcmViYXNlLmluaXRpYWxpemVBcHAoe1xuICAgICAgICBhcGlLZXk6IGZpcmViYXNlQ29uZmlnLmdldCgnYXBpS2V5JyksXG4gICAgICAgIGF1dGhEb21haW46IGZpcmViYXNlQ29uZmlnLmdldCgnYXV0aERvbWFpbicpLFxuICAgICAgICBkYXRhYmFzZVVSTDogZmlyZWJhc2VDb25maWcuZ2V0KCdkYXRhYmFzZVVSTCcpLFxuICAgICAgICBzdG9yYWdlQnVja2V0OiBmaXJlYmFzZUNvbmZpZy5nZXQoJ3N0b3JhZ2VCdWNrZXQnKSxcbiAgICAgICAgc2VydmljZUFjY291bnQ6IGZpcmViYXNlQ29uZmlnLmdldCgnc2VydmljZUFjY291bnRQYXRoJylcbiAgICAgIH0pO1xuXG4gICAgICAvLyBub3RpZnkgd2ViIHRoYXQgaHViIGlzIG9ubGluZVxuICAgICAgZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoYGh1YnMvJHtodWJJZH0vc3RhdHVzYCkuc2V0KCdvbmxpbmUnKTtcblxuICAgICAgLy8gc2V0dXAgZmxvdyBtZXRlcihzKVxuICAgICAgY29uc3QgdGFwcyA9IGNvbmZpZy5nZXQoJ2h1Yi50YXBzJyk7XG4gICAgICB0YXBzLmZvckVhY2goKHRhcCkgPT4ge1xuICAgICAgICBjb25zdCBmID0gbmV3IGZpdmUuU2Vuc29yLkRpZ2l0YWwodGFwLnBpbik7XG4gICAgICAgIGNvbnN0IGZsb3cgPSBuZXcgRmxvd01ldGVyKHRhcC5pZCwgZiwgZGlzcGxheSk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKHRhcHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIHRhcHMgZm91bmQsIHNraXBwaW5nJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIHVwcGVyIHRlbXBlcmF0dXJlIHNlbnNvclxuICAgICAgaWYgKGNvbmZpZy5oYXMoJ2hhcmR3YXJlLnRlbXBlcmF0dXJlLmFtMjMwMicpKSB7XG4gICAgICAgIGNvbnN0IGFtMjMwMiA9IGNvbmZpZy5nZXQoJ2hhcmR3YXJlLnRlbXBlcmF0dXJlLmFtMjMwMicpO1xuICAgICAgICBjb25zdCB1cHBlciA9IG5ldyBBbTIzMDIoYW0yMzAyLnBpbiwgYW0yMzAyLnBvbGxpbmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCdubyBhbTIzMDIgc2Vuc29yIGZvdW5kLCBza2lwcGluZycpO1xuICAgICAgfVxuXG4gICAgICAvLyBsb3dlciB0ZW1wZXJhdHVyZSBzZW5zb3JcbiAgICAgIGlmIChjb25maWcuaGFzKCdoYXJkd2FyZS50ZW1wZXJhdHVyZS5kczE4YjIwJykpIHtcbiAgICAgICAgY29uc3QgZHMxOGIyMCA9IGNvbmZpZy5nZXQoJ2hhcmR3YXJlLnRlbXBlcmF0dXJlLmRzMThiMjAnKTtcbiAgICAgICAgY29uc3QgbG93ZXIgPSBuZXcgRHMxOGIyMChkczE4YjIwLmFkZHJlc3MsIGRzMThiMjAucG9sbGluZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmluZm8oJ25vIGRzMThiMjAgc2Vuc29yIGZvdW5kLCBza2lwcGluZycpO1xuICAgICAgfVxuXG4gICAgICAvLyBzZXR1cCBkaXNwbGF5IHRvZ2dsZVxuICAgICAgaWYgKGNvbmZpZy5oYXMoJ2hhcmR3YXJlLmRpc3BsYXkudG9nZ2xlJykpIHtcbiAgICAgICAgY29uc3QgdG9nZ2xlID0gY29uZmlnLmdldCgnaGFyZHdhcmUuZGlzcGxheS50b2dnbGUnKTtcbiAgICAgICAgY29uc3QgZGlzcGxheVRvZ2dsZSA9IG5ldyBEaXNwbGF5VG9nZ2xlKHRvZ2dsZSwgZGlzcGxheSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygnbm8gZGlzcGxheSB0b2dnbGUgZm91bmQsIHNraXBwaW5nJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGZpcmViYXNlIGNvbmZpZyBmb3VuZCcpO1xuICAgIH1cblxuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IoJ25vIGh1YiBpZCBmb3VuZCcpO1xuICB9XG5cbiAgLy8gb24gc2h1dGRvd25cbiAgdGhpcy5vbignZXhpdCcsIGZ1bmN0aW9uKCkge1xuICAgIC8vIG5vdGlmeSBhcHBsaWNhdGlvblxuICAgIGZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGBodWJzLyR7aHViSWR9L3N0YXR1c2ApLnNldCgnb2ZmbGluZScpO1xuXG4gICAgLy8gdHVybiBvZmYgZGlzcGxheSBoYXJkd2FyZVxuICAgIGRpc3BsYXkub2ZmKCk7XG4gIH0pO1xuXG4gIC8vIGhlbHBlcnMgdG8gYWRkIHRvIFJFUExcbiAgdGhpcy5yZXBsLmluamVjdCh7XG4gICAgZGlzcGxheTogZGlzcGxheVxuICB9KTtcbn0pO1xuIl19