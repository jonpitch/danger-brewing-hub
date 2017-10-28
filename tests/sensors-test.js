let td = require('testdouble');
let timers = require('testdouble-timers');
timers.default.use(td);

// override setTimeout
td.timers('setTimeout');

// mock bcm
let bcmRead = td.function();
td.replace('node-dht-sensor', {
  initialize: function() {
    return true;
  },
  read: bcmRead
});

// mock ds18b20
let getAll = td.function();
td.replace('ds18x20', {
  getAll: getAll
});

// sensors
let Am2302 = require('../lib/sensors/am2302');
let Ds18b20 = require('../lib/sensors/ds18b20');

const { test } = QUnit;
QUnit.module('sensors', function() {
  
  test('am2302 - probe', function(assert) {  
    const sensorId = 1;
    const pinId = 1;
    const interval = 1;

    // mock firebase
    let firebaseRef = td.function();
    let firebaseUpdate = td.function();
    td.when(firebaseRef('sensors/' + sensorId)).thenReturn({
      update: firebaseUpdate
    });

    let firebase = td.replace('firebase', {
      database: function() {
        return {
          ref: firebaseRef
        };
      }
    });
    
    // create sensor
    td.when(bcmRead()).thenReturn({
      temperature: 0,
      humidity: 0
    });
    
    let sensor = new Am2302.default(firebase, sensorId, pinId, interval);
    assert.equal(sensor._id, sensorId, 'sensor id set');
    assert.equal(sensor._pin, pinId, 'pin id set');
    assert.equal(sensor._interval, interval, 'interval set');
  
    td.verify(firebaseUpdate({
      temperature: '0.00',
      humidity: '0.00'
    }));
    
    // interval has passed
    td.when(bcmRead()).thenReturn({
      temperature: 15,
      humidity: 50
    });

    sensor.probe();
    td.verify(firebaseUpdate({
      temperature: '15.00',
      humidity: '50.00'
    }));
  });
  
  test('ds18b20', function(assert) {
    const sensorId = 1;
    const address = '0x20';
    const interval = 1;
    
    // mock firebase
    let firebaseRef = td.function();
    let firebaseUpdate = td.function();
    td.when(firebaseRef('sensors/' + sensorId)).thenReturn({
      update: firebaseUpdate
    });

    let firebase = td.replace('firebase', {
      database: function() {
        return {
          ref: firebaseRef
        };
      }
    });
    
    // first probe
    td.when(getAll()).thenReturn({
      '0x20': 0
    });
    
    let sensor = new Ds18b20.default(firebase, sensorId, address, interval);
    assert.equal(sensor._id, sensorId, 'sensor id set');
    assert.equal(sensor._address, address, 'address set');
    assert.equal(sensor._interval, interval, 'interval set');
    td.verify(firebaseUpdate({
      temperature: 0
    }));
    
    td.when(getAll()).thenReturn({
      '0x20': 15.236
    });
    
    // next probe
    sensor.probe();
    td.verify(firebaseUpdate({
      temperature: 15.236
    }));
  });
  
  test('flow meter', function(assert) {
    assert.ok(true);
  });
});

