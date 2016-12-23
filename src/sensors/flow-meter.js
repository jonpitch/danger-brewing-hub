import HubSensor from 'sensors/hub-sensor';

const threshold = 0.075;
const msPerSecond = 1000;
const calibration = 21.11338;

/*

*/
export default class FlowMeter extends HubSensor {

  constructor(firebase, id, fiveSensor, display = null) {
    super();
    this._firebase = firebase;
    this._id = id;
    this._sensor = fiveSensor;
    this._display = display;

    this._lastPulse = Date.now();
    this._hertz = 0;
    this._flow = 0;
    this._totalPour = 0;
    
    this._sensor.on('change', (value) => {
      if (!value) {
        return;
      }
      
      let currentTime = Date.now();
      this._clickDelta = Math.max([currentTime - this._lastPulse], 1);
      if (this._clickDelta < 1000) {
        this._hertz = msPerSecond / this._clickDelta;
        this._flow = this._hertz / (60 * 7.5);
        let p = (this._flow * (this._clickDelta / msPerSecond)) * calibration;
        this._totalPour += p;
        setTimeout(() => {
          let now = Date.now();
          console.log(`${id} last: ${this._lastPulse} now: ${now} poured: ${this._totalPour}`);
          // if ((this._lastPulse - now) >= msPerSecond 
          //   && this._totalPour > threshold
          // ) {
            // const message = `${id} poured: ${this._totalPour} oz`;
            // super.report(message);
      
            // report to firebase
            // this.logPour(ounces);
      
            // write to display
            // if (this._display && this._display.getIsOn()) {
            //   this._display.write(message);
            //   setTimeout(() => {
            //     this._display.clear();
            //   }, 500);
            // }
            
            // reset
            // this._totalPour = 0;
          // }
        }, 1000);
      }
      
      this._lastPulse = currentTime;
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
