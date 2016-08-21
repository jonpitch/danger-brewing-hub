import oled from 'oled-js';
import font from 'oled-font-5x7';
import config from 'config';

/**

*/
export default class Ssd1306 {

  // setup oled display if available - fallback to console
  constructor(board, five) {
    let hardware = null;
    if (config.get('hardware.display.oled')) {
      let address = config.get('hardware.display.oled.address');
      hardware = new oled(board, five, {
        width: config.get('hardware.display.oled.w'),
        height: config.get('hardware.display.oled.h'),
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
  on() {
    this._on = true;
    if (this._device) {
      this._device.turnOnDisplay();
    }
  }

  // turn display off
  off() {
    this._on = false;
    if (this._device) {
      this._device.turnOffDisplay();
    }
  }

  // clear display
  clear() {
    if (this._device) {
      this._device.clearDisplay();
    }
  }

  // write string to screen
  write(text) {
    this.clear();
    if (this._device) {
      this._device.setCursor(1, 1);
      this._device.writeString(font, 1, text, 1, true, 2);
    } else {
      console.log(text);
    }
  }

  // is the display on
  getIsOn() {
    return this._on;
  }
}
