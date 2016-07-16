var raspi = require('raspi-io');
var five = require('johnny-five');
var board = new five.Board({
  io: new raspi()
});

board.on('ready', function() {
  var led = new five.Led('P1-37');
  led.strobe(500);
});
