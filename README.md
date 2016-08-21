# Danger Brewing: Hub
The sensor hub for a NodeBot kegerator.

# Parts Required
more detailed parts list coming soon.

* [Raspberry Pi 3](https://www.adafruit.com/products/3055)
* [Cobbler](https://www.adafruit.com/products/2028)
* [5v Power Supply](https://www.adafruit.com/product/1995)
* [MicroSD](https://www.adafruit.com/products/2693)
* [Monochrome 128x32 OLED](https://www.adafruit.com/products/931)
* [Tactile Button](https://www.adafruit.com/products/367)
* [10K Ohm Resistor](https://www.adafruit.com/products/2784)
* [Flow Meter(s)](https://www.adafruit.com/products/828)
* [Temperature + Humidity Sensor](https://www.adafruit.com/product/393)
* [Temperature Sensor](https://www.adafruit.com/product/381)
* OS - [Raspbian Jessie](https://www.raspberrypi.org/downloads/raspbian/)

# Setup
more detailed instructions coming soon.

* Setup raspberry pi
* install node
  * `cd /tmp`
  * `wget http://node-arm.herokuapp.com/node_latest_armhf.deb`
  * `sudo dpkg -i node_latest_armhf.deb`
* install and setup `git`
* clone repository
  * `npm install`
  * `npm run build`
  * `sudo node lib/index.js`

## Configuration
configuration is done through [node-config](https://github.com/lorenwest/node-config).

```
mv /config/default.example.json /config/default.json
```

Edit `default.json` to your needs. More details coming soon.

## Find i2c Address
`i2cdetect -y 1`

## Temperature Sensors
Raspi-IO does not appear to support one-wire. Instead, we'll use [node-dht-sensor](https://github.com/momenso/node-dht-sensor).

#### bcm2835
Use [node-dht-sensor](https://github.com/momenso/node-dht-sensor)

```
# on the pi
cd /tmp
wget http://www.open.com.au/mikem/bcm2835/bcm2835-1.49.tar.gz
tar xvfz bcm2835-1.49.tar.gz
d bcm2835-1.49/
./configure
make
sudo make install
```

#### ds18b20
Use [ds18x20](https://github.com/mraxus/ds18x20.js)

```
# add to /boot/config.txt - where X = gpio pin
dtoverlay=w1-gpio,gpiopin=X
sudo reboot

sudo modprobe w1-gpio pullup=1
sudo modprobe w1-therm strong_pullup=1
```

# Wiring Diagram
![alt text](assets/diagram.png "Wiring Diagram")

[diagram.fzz](assets/diagram.fzz)

# Building
* `npm run build`

# Running
* `./run.sh`

# Resources
* [Johnny Five](http://johnny-five.io/)
* [Raspi-IO](https://github.com/nebrius/raspi-io)
* [oled-js](https://github.com/noopkat/oled-js)
* [Raspberry Pi Pin Information](https://github.com/nebrius/raspi-io/wiki/Pin-Information)
