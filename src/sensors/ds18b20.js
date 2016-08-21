import HubSensor from 'sensors/hub-sensor';
import sensor from 'ds18x20';

/**
  DS18B20 Temperature Sensor
*/
export default class Ds18b20 extends HubSensor {

  constructor(firebase, id, address, interval) {
    super();
    this._firebase = firebase;
    this._id = id;
    this._address = address;
    this._interval = interval;

    // start
    this.probe();
  }

  // read temperatures every interval
  probe() {
    const temperatures = sensor.getAll();
    const temperature = temperatures[this._address];
    super.report(`${this._address}: ${temperature}°C`);

    // report to firebase
    this._firebase.database().ref(`sensors/${this._id}`).update({
      temperature: temperature
    });

    setTimeout(() => {
      this.probe();
    }, this._interval);
  }
}
