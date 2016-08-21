import HubSensor from 'hub-sensor';
import bcm from 'node-dht-sensor';
import config from 'config';

/**
  AM2302 Temperature/Humidity Sensor
*/
export default class Am2302 extends HubSensor {

  constructor(firebase, pin, interval) {
    super();
    this._pin = pin;
    this._interval = interval;

    // start
    if (bcm.initialize(22, this._pin)) {
      this.probe();
    }
  }

  // read temperature and humidity at interval
  probe() {
    const reading = bcm.read();
    const temp = reading.temperature.toFixed(2);
    const humidity = reading.humidity.toFixed(2);

    super.report(`${this._pin}: ${temp}°C ${humidity}%`);

    // report to firebase
    const hubId = config.get('hub.id');
    // firebase.database().ref(`hubs/${hubId}`).set({
    //   upperTemp: temp,
    //   humidity: humidity
    // });

    setTimeout(() => {
      this.probe();
    }, this._interval);
  }
}
