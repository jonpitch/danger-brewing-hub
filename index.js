var raspi = require('raspi-io');
var five = require('johnny-five');
var oled = require('oled-js');
var board = new five.Board({
  io: new raspi()
});

board.on('ready', function() {
  var opts = {
    width: 128,
    height: 32,
    address: 0x3C
  };

  var display = new oled(board, five, opts);
  // TODO
});
