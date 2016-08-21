import HubSensor from 'hub-sensor';
import sensor from 'ds18x20';
import config from 'config';

/**
  DS18B20 Temperature Sensor
*/
export default class Ds18b20 extends HubSensor {

  constructor(firebase, id, interval) {
    super();
    this._id = id;
    this._interval = interval;

    // start
    this.probe();
  }

  // read temperatures every interval
  probe() {
    const temperatures = sensor.getAll();
    const temperature = temperatures[this._id];
    super.report(`${this._id}: ${temperature}°C`);

    // report to firebase
    const hubId = config.get('hub.id');
    // firebase.database().ref(`hubs/${hubId}/lowerTemp`).set(temperature);

    setTimeout(() => {
      this.probe();
    }, this._interval);
  }
}
