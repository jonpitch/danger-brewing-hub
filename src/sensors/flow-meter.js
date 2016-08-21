import HubSensor from 'sensors/hub-sensor';

// the amount of ounces required to flow to consider a pour occurred
const pourThreshold = 0.15;

// may require calibration
const pulsesPerLiter = 450;
const ouncesPerLiter = 33.814;
const pulsesPerOunce = 13.308;

/*

*/
export default class FlowMeter extends HubSensor {

  constructor(firebase, id, fiveSensor, display = null) {
    super();
    this._firebase = firebase;
    this._id = id;
    this._sensor = fiveSensor;
    this._display = display;

    // total pulses from flow meter
    let pulses = 0;

    // pulses per session - gets reset
    let sessionPulses = 0;

    // state of flow meter
    let isOpen = false;

    this._sensor.on('change', () => {
      pulses++;
      sessionPulses++;
      isOpen = true;

      let currentSession = sessionPulses;
      setTimeout(() => {
        if (currentSession === sessionPulses) {
          const ounces = Math.round((sessionPulses / pulsesPerOunce) * 100) / 100;
          if (ounces > pourThreshold) {
            const message = `${id} poured: ${ounces} oz`;
            super.report(message);

            // report to firebase
            this.logPour(ounces);

            // write to display
            if (this._display && this._display.getIsOn()) {
              this._display.write(message);
              setTimeout(() => {
                this._display.clear();
              }, 500);
            }

            // reset session
            sessionPulses = 0;
            isOpen = false;
          }
        }
      }, 1000);
    });
  }

  // save the last pour
  logPour(ounces) {
    // get beer id for relationship
    this._firebase.database().ref(`taps/${this._id}`).once('value').then((snapshot) => {
      const beer = snapshot.val().beer;
      const pourData = {
        beer: beer,
        ounces: ounces,
        created: (new Date()).getTime()
      };

      // record pour for beer
      const pour = this._firebase.database().ref(`pours`).push(pourData).key;
      this._firebase.database().ref(`beers/${beer}/pours/${pour}`).set(true);
    });
  }
}
