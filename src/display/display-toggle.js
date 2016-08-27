import config from 'config';

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
        // say goodbye and turn off display
        const goodbye = this.randomGoodbye();
        this._display.write(goodbye);
        setTimeout(() => {
          this._display.clear();
          this._display.off();
        }, 1000);
      } else {
        // turn on display
        this._display.on();

        // say hello
        const hello = this.randomGreeting();
        this._display.write(hello);
        setTimeout(() => {
          this._display.clear();
        }, 1000);
      }
    });
  }

  // display a random greeting when turning on the display
  randomGreeting() {
    if (config.has('hub.display.greetings')) {
      const greetings = config.get('hub.display.greetings');
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    return 'hello';
  }

  // display a random goodbye when turning off the display
  randomGoodbye() {
    if (config.has('hub.display.goodbyes')) {
      const goodbyes = config.get('hub.display.goodbyes');
      return goodbyes[Math.floor(Math.random() * goodbyes.length)];
    }

    return 'goodbye';
  }
}
