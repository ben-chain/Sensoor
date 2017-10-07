let huejay = require('huejay');

huejay.discover({strategy: 'upnp'})
  .then(bridges => {
    for (let bridge of bridges) {
      console.log(`Id: ${bridge.id}, IP: ${bridge.ip}`);
	  theIP = bridge.ip;
    }
  })
  .catch(error => {
    console.log(`An error occurred: ${error.message}`);
  });
  
  let client = new huejay.Client({
  host:     '192.168.1.114',
  port:     80,               // Optional
  username: 'ZSjjNVSk8fddb5ihutRzk0qSiQUCn37VjIZLibFC', // Optional
  timeout:  15000,            // Optional, timeout in milliseconds (15000 is the default)
});


client.bridge.isAuthenticated()
  .then(() => {
    console.log('Successful hue authentication');
  })


/*
var unirest = require('unirest');
var fs = require('fs');
var util = require('util');
var events = require('events');
var minimist = require('minimist');
var SmartThings = require("./iotdb-smartthings/smartthingslib").SmartThings;

ad = { _: [],
  poll: false,
  type: 'switch',
  device_id: '10b0f8ad-1785-4b0c-bdf5-f1671f48dc9f',
  request: 'switch=0' };

var sm = new SmartThings();
sm.on("endpoint", function () {
    sm.request_devices(ad.type);
});
sm.on("devices", function (device_type, devices) {
	var di;
    var device;

    if (ad.device_id) {
        var ds = [];
        for (di in devices) {
            device = devices[di];
            if ((device.id === ad.device_id) || (device.label === ad.device_id)) {
                ds.push(device);
            }
        }
        devices = ds;
    }

    if (ad.request) {
        for (di in devices) {
            device = devices[di];
			theSwitch = device;
            sm.device_request(device, ad.request);
			console.log("initial state requested.");
			console.log(ad.request);
        }
    } else if (ad.poll && ad.device_id) {
        var _on_state = function (error, _deviced, _stated) {
            console.log(JSON.stringify(_stated, null, 2));
        };
        for (di in devices) {
            device = devices[di];
            sm.device_poll(device, _on_state);
        }
    } else {
        console.log(JSON.stringify(devices, null, 2));
    }

});

if (Object.keys(ad).length === 1) {
    help();
    process.exit(1);
}
if (!ad.type) {
    console.log("error:");
    console.log("  --type <device_type> is required");
    console.log("");
    help();
    process.exit(1);
}
if (ad.request) {
    var parts = ad.request.split("=", 2);
    if (parts.length !== 2) {
        console.log("error:");
        console.log("  --request requires an argument like 'switch=1'");
        console.log("");
        help();
        process.exit(1);
    }
    ad.request = {};
    ad.request[parts[0]] = parseInt(parts[1]);
}

sm.load_settings();
sm.request_endpoint();

*/








var noble = require('noble');

noble.on('stateChange', nobleStateChange);

function nobleStateChange(state){
	if (state == 'poweredOn'){
		console.log('poweredOn.  begin scanning for Sensoor.');
		noble.startScanning(); // any service UUID, no duplicates

	}
};

noble.on('discover', peripheralFound);

function peripheralFound(peripheral){
	var theLocalName = peripheral.advertisement.localName;
	if (theLocalName !== undefined && theLocalName.substring(0,5) == 'ESP32'){
		theSensoor = peripheral;
		curName = theSensoor.advertisement.localName;
		console.log('Sensoor found! :');
		//console.log(theSensoor);
		motionInterval = setInterval(checkForNameChange, 250);
	}
};

function connectCallback(error){
	console.log('error:')
	console.log(error)
};


isPresent = false;

function checkForNameChange(){
	if (curName != theSensoor.advertisement.localName) {
		curName = theSensoor.advertisement.localName
		sensoorTriggered();
	}
};

function sensoorTriggered(){
	console.log("name change!");
	if(!isPresent){
		isPresent = true;
		//sm.device_request(theSwitch, {switch:1});
		clearInterval(motionInterval);
		exitInterval = setInterval(checkForExit, 250);
		
		client.scenes.recall('4uZPikJmSHV9kKO')
		.then(() => {
			console.log('Scene  recalled');
			})
		.catch(error => {
			console.log(error.stack);
		});
	}
};

function checkForExit(){
	console.log(theSensoor.rssi);
	if (theSensoor.rssi < -75){
		isPresent = false;
		//sm.device_request(theSwitch, {switch:0});
		clearInterval(exitInterval);
		curName = theSensoor.advertisement.localName;
		motionInterval = setInterval(checkForNameChange, 250);
		
		client.scenes.recall('ouZNd1upfCqDhJl')
		.then(() => {
			console.log('Scene  recalled');
			})
		.catch(error => {
			console.log(error.stack);
		});
	}
}