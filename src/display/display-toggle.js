/**
  Activate sensor to write to display
*/
export default class DisplayToggle {

  constructor(five, pin, display) {
    this._toggle = new five.Button(pin);
    this._display = display;

    // reset display
    this._display.clear();
    this._display.off();

    // handle toggle
    this._toggle.on('up', () => {
      if (this._display.getIsOn()) {
        // turn off display
        // TODO randomize
        this._display.write('goodbye');
        setTimeout(() => {
          this._display.clear();
          this._display.off();
        }, 1000);
      } else {
        // turn on display
        this._display.on();

        // TODO randomize
        this._display.write('greetings');
        setTimeout(() => {
          this._display.clear();
        }, 1000);
      }
    });
  }
}
