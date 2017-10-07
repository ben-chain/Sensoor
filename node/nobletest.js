var noble = require('noble');


var unirest = require('unirest');
var fs = require('fs');
var util = require('util');
var events = require('events');
var SmartThings = require("./iotdb-smartthings/smartthingslib").SmartThings;



var sm = new SmartThings();
sm.on("endpoint", function () {
    sm.request_devices(ad.type);
});
sm.on("devices", function (device_type, devices) {
    console.log('called?');
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
            sm.device_request(device, ad.request);
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

console.log(sm);



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
		setInterval(checkForNameChange, 250);
	}
};

function connectCallback(error){
	console.log('error:')
	console.log(error)
};

function checkForNameChange(){
	if (curName != theSensoor.advertisement.localName) {
		curName = theSensoor.advertisement.localName
		sensoorTriggered();
	}
};

function sensoorTriggered(){
	console.log("name change!");
};