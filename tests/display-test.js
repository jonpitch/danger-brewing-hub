let td = require('testdouble');
let Ssd1306 = require('../lib/display/ssd1306');
// let Toggle = require('../lib/display/display-toggle');

// mock oled and some of its api
let oledjs = require('oled-js');
let font = require('oled-font-5x7');
oledjs.prototype._setUpI2C = td.function();
oledjs.prototype._transfer = td.function();
oledjs.prototype.update = td.function();
oledjs.prototype.turnOnDisplay = td.function();
oledjs.prototype.turnOffDisplay = td.function();
oledjs.prototype.clearDisplay = td.function('.clearDisplay');
oledjs.prototype.setCursor = td.function();
oledjs.prototype.writeString = td.function();

// mock johnny-five, board and basic i2c
let five = td.function();
let board = new td.constructor();
board.io = td.function();
board.io.i2cReadOnce = td.function();
td.when(board.io.i2cReadOnce()).thenReturn(null);

const { test } = QUnit;
QUnit.module('displays', function() {
  
  test('ssd1306 - off by default', function(assert) {
    let display = new Ssd1306.default(board, five);
    assert.notOk(display.getIsOn(), 'display off');
    td.verify(oledjs.prototype.update(), 'display updated');
  });
  
  test('ssd1306 - can set display on', function(assert) {
    let display = new Ssd1306.default(board, five);
    display.on();
    
    assert.ok(display.getIsOn(), 'turned on display');
    td.verify(oledjs.prototype.turnOnDisplay(), 'display on api called');
  });
  
  test('ssd1306 - can turn on and off', function(assert) {
    let display = new Ssd1306.default(board, five);
    display.on();
    td.verify(oledjs.prototype.turnOnDisplay(), 'display on api called');
    
    display.off();
    assert.notOk(display.getIsOn(), 'display was on and now it\'s off');
    td.verify(oledjs.prototype.turnOffDisplay(), 'display off api called');
  });
  
  test('ssd1306 - clear display', function(assert) {
    assert.expect(0);
    let display = new Ssd1306.default(board, five);
    display.clear();
    
    td.verify(oledjs.prototype.clearDisplay(), 'display cleared');
  });
  
  test('ssd1306 - write to screen', function(assert) {
    assert.expect(0);
    let display = new Ssd1306.default(board, five);
    const text = 'hello';
    display.write(text);
    
    td.verify(oledjs.prototype.clearDisplay(), 'display cleared first');
    td.verify(oledjs.prototype.setCursor(1, 1), 'set cursor position called');
    td.verify(oledjs.prototype.writeString(font, 1, text, 1, true, 2), 'string written');
  });
  
  test('toggle - init', function(assert) {
    assert.expect(0);
    five.Button = new td.function();
    five.Button.prototype.on = td.function();
    
    // let display = new Ssd1306.default(board, five);
    // let toggle = new Toggle.default(five, 1, display);
    
    td.verify(oledjs.prototype.turnOffDisplay(), 'display off api called');
    td.verify(oledjs.prototype.clearDisplay(), 'display cleared');
  });
});

