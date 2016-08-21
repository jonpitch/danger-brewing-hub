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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZW5zb3JzL2h1Yi1zZW5zb3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7SUFHcUIsUztBQUVuQix1QkFBYztBQUFBO0FBQ2I7O0FBRUQ7Ozs7OzJCQUNPLEksRUFBTTtBQUNYLGNBQVEsR0FBUixDQUFZLElBQVo7QUFDRDs7Ozs7O2tCQVJrQixTIiwiZmlsZSI6Imh1Yi1zZW5zb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAgQWxsIGh1YiBzZW5zb3JzIGltcGxlbWVudCAtIHVzZWQgZm9yIGxvZ2dpbmdcbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIdWJTZW5zb3Ige1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICB9XG5cbiAgLy8gcmVwb3J0IGRhdGFcbiAgcmVwb3J0KGluZm8pIHtcbiAgICBjb25zb2xlLmxvZyhpbmZvKTtcbiAgfVxufVxuIl19