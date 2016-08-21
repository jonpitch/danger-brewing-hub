"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
  All hub sensors implement - used for logging
*/
var HubSensor = function () {
  function HubSensor() {
    _classCallCheck(this, HubSensor);
  }

  // report data


  _createClass(HubSensor, [{
    key: "report",
    value: function report(info) {
      console.log(info);
    }
  }]);

  return HubSensor;
}();

exports.default = HubSensor;
//# sourceMappingURL=hub-sensor.js.map