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

/**
  All hub sensors implement - used for logging
*/


var HubSensor = function () {
  function HubSensor() {
    var display = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

    _classCallCheck(this, HubSensor);

    this._display = display;
  }

  // report data


  _createClass(HubSensor, [{
    key: 'report',
    value: function report(info) {
      if (this._display) {
        this._display.write(info);
      }

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

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FlowMeter).call(this, display));

    _this._sensor = fiveSensor;

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
          _get(Object.getPrototypeOf(FlowMeter.prototype), 'report', _this).call(_this, id + ' poured: ' + ounces + ' oz');

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
    var display = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    _classCallCheck(this, Ds18b20);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Ds18b20).call(this, display));

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
    var display = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    _classCallCheck(this, Am2302);

    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Am2302).call(this, display));

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
    var flow = new FlowMeter(fm.id, f, null);
  });

  // upper temperature sensor
  var upper = new Am2302(26, 1000, null);

  // lower temperature sensor
  var lower = new Ds18b20('28-000007c6390c', 1000, null);

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

//# sourceMappingURL=data:application/json;base64,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QUdoQjtBQUNELFFBQUksQ0FESDtBQUVELFNBQUs7QUFGSixHQUhnQixFQU1oQjtBQUNELFFBQUksQ0FESDtBQUVELFNBQUs7QUFGSixHQU5nQixDQUFuQjs7QUFXQSxhQUFXLE9BQVgsQ0FBbUIsVUFBQyxFQUFELEVBQVE7QUFDekIsUUFBTSxJQUFJLElBQUkscUJBQUssTUFBTCxDQUFZLE9BQWhCLENBQXdCLEdBQUcsR0FBM0IsQ0FBVjtBQUNBLFFBQU0sT0FBTyxJQUFJLFNBQUosQ0FBYyxHQUFHLEVBQWpCLEVBQXFCLENBQXJCLEVBQXdCLElBQXhCLENBQWI7QUFDRCxHQUhEOztBQUtBO0FBQ0EsTUFBTSxRQUFRLElBQUksTUFBSixDQUFXLEVBQVgsRUFBZSxJQUFmLEVBQXFCLElBQXJCLENBQWQ7O0FBRUE7QUFDQSxNQUFNLFFBQVEsSUFBSSxPQUFKLENBQVksaUJBQVosRUFBK0IsSUFBL0IsRUFBcUMsSUFBckMsQ0FBZDs7QUFFQTtBQUNBO0FBQ0EsT0FBSyxFQUFMLENBQVEsTUFBUixFQUFnQixZQUFXO0FBQ3pCLFlBQVEsR0FBUjtBQUNELEdBRkQ7O0FBSUE7QUFDQSxPQUFLLElBQUwsQ0FBVSxNQUFWLENBQWlCO0FBQ2YsYUFBUztBQURNLEdBQWpCO0FBR0QsQ0F0Q0QiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmFzcGkgZnJvbSAncmFzcGktaW8nO1xuaW1wb3J0IGZpdmUgZnJvbSAnam9obm55LWZpdmUnO1xuaW1wb3J0IG9sZWQgZnJvbSAnb2xlZC1qcyc7XG5pbXBvcnQgZm9udCBmcm9tICdvbGVkLWZvbnQtNXg3JztcbmltcG9ydCBiY20gZnJvbSAnbm9kZS1kaHQtc2Vuc29yJztcbmltcG9ydCBzZW5zb3IgZnJvbSAnZHMxOHgyMCc7XG5cbi8vIHNldHVwIGJvYXJkXG5jb25zdCBib2FyZCA9IG5ldyBmaXZlLkJvYXJkKHtcbiAgaW86IG5ldyByYXNwaSgpXG59KTtcblxuLyoqXG5cbiovXG5jbGFzcyBEaXNwbGF5IHtcblxuICAvLyBUT0RPIG1vdmUgaGVpZ2h0LCB3aWR0aCBhbmQgYWRkcmVzcyBvZiBkaXNwbGF5IHRvIGNvbmZpZ1xuICBjb25zdHJ1Y3Rvcihib2FyZCwgZml2ZSkge1xuICAgIGNvbnN0IGhhcmR3YXJlID0gbmV3IG9sZWQoYm9hcmQsIGZpdmUsIHtcbiAgICAgIHdpZHRoOiAxMjgsXG4gICAgICBoZWlnaHQ6IDMyLFxuICAgICAgYWRkcmVzczogMHgzQ1xuICAgIH0pO1xuXG4gICAgdGhpcy5fZGV2aWNlID0gaGFyZHdhcmU7XG5cbiAgICAvLyBjbGVhciBkaXNwbGF5IG9uIGluaXRpYWxpemF0aW9uIC0ganVzdCBpbiBjYXNlXG4gICAgdGhpcy5fZGV2aWNlLnVwZGF0ZSgpO1xuICB9XG5cbiAgLy8gdHJ1biBkaXNwbGF5IG9uXG4gIG9uKCkge1xuICAgIHRoaXMuX2RldmljZS50dXJuT25EaXNwbGF5KCk7XG4gIH1cblxuICAvLyB0dXJuIGRpc3BsYXkgb2ZmXG4gIG9mZigpIHtcbiAgICB0aGlzLl9kZXZpY2UudHVybk9mZkRpc3BsYXkoKTtcbiAgfVxuXG4gIC8vIGNsZWFyIGRpc3BsYXlcbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5fZGV2aWNlLmNsZWFyRGlzcGxheSgpO1xuICB9XG5cbiAgLy8gd3JpdGUgc3RyaW5nIHRvIHNjcmVlblxuICB3cml0ZSh0ZXh0KSB7XG4gICAgdGhpcy5jbGVhcigpO1xuICAgIHRoaXMuX2RldmljZS5zZXRDdXJzb3IoMSwgMSk7XG4gICAgdGhpcy5fZGV2aWNlLndyaXRlU3RyaW5nKGZvbnQsIDEsIHRleHQsIDEsIHRydWUsIDIpO1xuICB9XG5cbn1cblxuLyoqXG4gIEFsbCBodWIgc2Vuc29ycyBpbXBsZW1lbnQgLSB1c2VkIGZvciBsb2dnaW5nXG4qL1xuY2xhc3MgSHViU2Vuc29yIHtcblxuICBjb25zdHJ1Y3RvcihkaXNwbGF5ID0gbnVsbCkge1xuICAgIHRoaXMuX2Rpc3BsYXkgPSBkaXNwbGF5O1xuICB9XG5cbiAgLy8gcmVwb3J0IGRhdGFcbiAgcmVwb3J0KGluZm8pIHtcbiAgICBpZiAodGhpcy5fZGlzcGxheSkge1xuICAgICAgdGhpcy5fZGlzcGxheS53cml0ZShpbmZvKTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhpbmZvKTtcbiAgfVxufVxuXG4vKlxuXG4qL1xuY2xhc3MgRmxvd01ldGVyIGV4dGVuZHMgSHViU2Vuc29yIHtcblxuICBjb25zdHJ1Y3RvcihpZCwgZml2ZVNlbnNvciwgZGlzcGxheSA9IG51bGwpIHtcbiAgICBzdXBlcihkaXNwbGF5KTtcbiAgICB0aGlzLl9zZW5zb3IgPSBmaXZlU2Vuc29yO1xuXG4gICAgLy8gdG90YWwgcHVsc2VzIGZyb20gZmxvdyBtZXRlclxuICAgIGxldCBwdWxzZXMgPSAwO1xuXG4gICAgLy8gcHVsc2VzIHBlciBzZXNzaW9uIC0gZ2V0cyByZXNldFxuICAgIGxldCBzZXNzaW9uUHVsc2VzID0gMDtcblxuICAgIC8vIHN0YXRlIG9mIGZsb3cgbWV0ZXJcbiAgICBsZXQgaXNPcGVuID0gZmFsc2U7XG5cbiAgICAvLyBtYXkgcmVxdWlyZSBjYWxpYnJhdGlvblxuICAgIGNvbnN0IHB1bHNlc1BlckxpdGVyID0gNDUwO1xuICAgIGNvbnN0IG91bmNlc1BlckxpdGVyID0gMzMuODE0O1xuICAgIGNvbnN0IHB1bHNlc1Blck91bmNlID0gMTMuMzA4O1xuXG4gICAgdGhpcy5fc2Vuc29yLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBwdWxzZXMrKztcbiAgICAgIHNlc3Npb25QdWxzZXMrKztcbiAgICAgIGlzT3BlbiA9IHRydWU7XG5cbiAgICAgIGxldCBjdXJyZW50U2Vzc2lvbiA9IHNlc3Npb25QdWxzZXM7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKGN1cnJlbnRTZXNzaW9uID09PSBzZXNzaW9uUHVsc2VzKSB7XG4gICAgICAgICAgY29uc3Qgb3VuY2VzID0gTWF0aC5yb3VuZCgoc2Vzc2lvblB1bHNlcyAvIHB1bHNlc1Blck91bmNlKSAqIDEwMCkgLyAxMDA7XG4gICAgICAgICAgc3VwZXIucmVwb3J0KGAke2lkfSBwb3VyZWQ6ICR7b3VuY2VzfSBvemApO1xuXG4gICAgICAgICAgLy8gcmVzZXQgc2Vzc2lvblxuICAgICAgICAgIHNlc3Npb25QdWxzZXMgPSAwO1xuICAgICAgICAgIGlzT3BlbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9LCAxMDAwKTtcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAgRFMxOEIyMCBUZW1wZXJhdHVyZSBTZW5zb3JcbiovXG5jbGFzcyBEczE4YjIwIGV4dGVuZHMgSHViU2Vuc29yIHtcblxuICBjb25zdHJ1Y3RvcihpZCwgaW50ZXJ2YWwsIGRpc3BsYXkgPSBudWxsKSB7XG4gICAgc3VwZXIoZGlzcGxheSk7XG4gICAgdGhpcy5faWQgPSBpZDtcbiAgICB0aGlzLl9pbnRlcnZhbCA9IGludGVydmFsO1xuXG4gICAgLy8gc3RhcnRcbiAgICB0aGlzLnByb2JlKCk7XG4gIH1cblxuICAvLyByZWFkIHRlbXBlcmF0dXJlcyBldmVyeSBpbnRlcnZhbFxuICBwcm9iZSgpIHtcbiAgICBjb25zdCB0ZW1wZXJhdHVyZXMgPSBzZW5zb3IuZ2V0QWxsKCk7XG4gICAgY29uc3QgdGVtcGVyYXR1cmUgPSB0ZW1wZXJhdHVyZXNbdGhpcy5faWRdO1xuICAgIHN1cGVyLnJlcG9ydChgJHt0aGlzLl9pZH06ICR7dGVtcGVyYXR1cmV9wrBDYCk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMucHJvYmUoKTtcbiAgICB9LCB0aGlzLl9pbnRlcnZhbCk7XG4gIH1cbn1cblxuLyoqXG4gIEFNMjMwMiBUZW1wZXJhdHVyZS9IdW1pZGl0eSBTZW5zb3JcbiovXG5jbGFzcyBBbTIzMDIgZXh0ZW5kcyBIdWJTZW5zb3Ige1xuXG4gIGNvbnN0cnVjdG9yKHBpbiwgaW50ZXJ2YWwsIGRpc3BsYXkgPSBudWxsKSB7XG4gICAgc3VwZXIoZGlzcGxheSk7XG4gICAgdGhpcy5fcGluID0gcGluO1xuICAgIHRoaXMuX2ludGVydmFsID0gaW50ZXJ2YWw7XG5cbiAgICAvLyBzdGFydFxuICAgIGlmIChiY20uaW5pdGlhbGl6ZSgyMiwgdGhpcy5fcGluKSkge1xuICAgICAgdGhpcy5wcm9iZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHJlYWQgdGVtcGVyYXR1cmUgYW5kIGh1bWlkaXR5IGF0IGludGVydmFsXG4gIHByb2JlKCkge1xuICAgIGNvbnN0IHJlYWRpbmcgPSBiY20ucmVhZCgpO1xuICAgIGNvbnN0IHRlbXAgPSByZWFkaW5nLnRlbXBlcmF0dXJlLnRvRml4ZWQoMik7XG4gICAgY29uc3QgaHVtaWRpdHkgPSByZWFkaW5nLmh1bWlkaXR5LnRvRml4ZWQoMik7XG5cbiAgICBzdXBlci5yZXBvcnQoYCR7dGhpcy5fcGlufTogJHt0ZW1wfcKwQyAke2h1bWlkaXR5fSVgKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMucHJvYmUoKTtcbiAgICB9LCB0aGlzLl9pbnRlcnZhbCk7XG4gIH1cbn1cblxuLy8gc2V0dXAgaHViXG5ib2FyZC5vbigncmVhZHknLCBmdW5jdGlvbigpIHtcbiAgLy8gaW5pdGlhbGl6ZSBkaXNwbGF5XG4gIGNvbnN0IGRpc3BsYXkgPSBuZXcgRGlzcGxheShib2FyZCwgZml2ZSk7XG5cbiAgLy8gc2V0dXAgZmxvdyBtZXRlcihzKVxuICAvLyBUT0RPIGR5bmFtaWMgZnJvbSBjb25maWd1cmF0aW9uP1xuICBjb25zdCBmbG93TWV0ZXJzID0gW3tcbiAgICBpZDogMSxcbiAgICBwaW46ICdQMS0yMidcbiAgfSwge1xuICAgIGlkOiAyLFxuICAgIHBpbjogJ1AxLTE4J1xuICB9LCB7XG4gICAgaWQ6IDMsXG4gICAgcGluOiAnUDEtMzgnXG4gIH1dO1xuXG4gIGZsb3dNZXRlcnMuZm9yRWFjaCgoZm0pID0+IHtcbiAgICBjb25zdCBmID0gbmV3IGZpdmUuU2Vuc29yLkRpZ2l0YWwoZm0ucGluKTtcbiAgICBjb25zdCBmbG93ID0gbmV3IEZsb3dNZXRlcihmbS5pZCwgZiwgbnVsbCk7XG4gIH0pO1xuXG4gIC8vIHVwcGVyIHRlbXBlcmF0dXJlIHNlbnNvclxuICBjb25zdCB1cHBlciA9IG5ldyBBbTIzMDIoMjYsIDEwMDAsIG51bGwpO1xuXG4gIC8vIGxvd2VyIHRlbXBlcmF0dXJlIHNlbnNvclxuICBjb25zdCBsb3dlciA9IG5ldyBEczE4YjIwKCcyOC0wMDAwMDdjNjM5MGMnLCAxMDAwLCBudWxsKTtcblxuICAvLyBvbiBzaHV0ZG93blxuICAvLyBUT0RPIG5vdGlmeSB3ZWIgYXBwIGV2ZW50IG9jY3VycmVkXG4gIHRoaXMub24oJ2V4aXQnLCBmdW5jdGlvbigpIHtcbiAgICBkaXNwbGF5Lm9mZigpO1xuICB9KTtcblxuICAvLyBoZWxwZXJzIHRvIGFkZCB0byBSRVBMXG4gIHRoaXMucmVwbC5pbmplY3Qoe1xuICAgIGRpc3BsYXk6IGRpc3BsYXlcbiAgfSk7XG59KTtcbiJdfQ==