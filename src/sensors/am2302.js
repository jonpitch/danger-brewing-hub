import HubSensor from 'sensors/hub-sensor';
import bcm from 'node-dht-sensor';

/**
  AM2302 Temperature/Humidity Sensor
*/
export default class Am2302 extends HubSensor {

  constructor(firebase, id, pin, interval) {
    super();
    this._firebase = firebase;
    this._id = id;
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

    // log
    super.report(`${this._pin}: ${temp}°C ${humidity}%`);

    // report to firebase
    this._firebase.database().ref(`sensors/${this._id}`).update({
      temperature: temp,
      humidity: humidity
    });

    setTimeout(() => {
      this.probe();
    }, this._interval);
  }
}
