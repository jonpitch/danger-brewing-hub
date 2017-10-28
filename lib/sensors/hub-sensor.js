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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZW5zb3JzL2h1Yi1zZW5zb3IuanMiXSwibmFtZXMiOlsiSHViU2Vuc29yIiwiaW5mbyIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7O0lBR3FCQSxTO0FBRW5CLHVCQUFjO0FBQUE7QUFDYjs7QUFFRDs7Ozs7MkJBQ09DLEksRUFBTTtBQUNYQyxjQUFRQyxHQUFSLENBQVlGLElBQVo7QUFDRDs7Ozs7O2tCQVJrQkQsUyIsImZpbGUiOiJodWItc2Vuc29yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gIEFsbCBodWIgc2Vuc29ycyBpbXBsZW1lbnQgLSB1c2VkIGZvciBsb2dnaW5nXG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSHViU2Vuc29yIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgfVxuXG4gIC8vIHJlcG9ydCBkYXRhXG4gIHJlcG9ydChpbmZvKSB7XG4gICAgY29uc29sZS5sb2coaW5mbyk7XG4gIH1cbn1cbiJdfQ==