var raspi = require('raspi-io');
var five = require('johnny-five');
var oled = require('oled-js');
var font = require('oled-font-5x7');
var board = new five.Board({
  io: new raspi()
});

board.on('ready', function() {
  // initialize display
  var display = new oled(board, five, {
    width: 128,
    height: 32,
    address: 0x3C
  });

  // clean up display - just in case
  display.clearDisplay();

  // on shutdown
  this.on('exit', function() {
    display.turnOffDisplay();
  });

  // helpers to add to REPL
  this.repl.inject({
    display: {
      _hardware: display,
      write: function(text) {
        display.clearDisplay();
        display.setCursor(1, 1);
        display.writeString(font, 1, text, 1, true, 2);
      },
      clear: function() {
        display.clearDisplay();
      },
      on: function() {
        display.turnOnDisplay();
      },
      off: function() {
        display.turnOffDisplay();
      }
    }
  });
});
