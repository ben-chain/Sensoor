var keypress = require('keypress');
var robot = require("robotjs");

 
// make `process.stdin` begin emitting "keypress" events 
keypress(process.stdin);
 
// listen for the "keypress" event 
process.stdin.on('keypress', function (ch, key) {
  console.log('got "keypress"', key);
  if (key && key.ctrl && key.name == 'c') {
    process.stdin.pause();
  }
  if (key && key.name == 'pagedown')
  {
	  clickerClick();
  }
});

var winctl = require('winctl');
var thisWindow = winctl.GetActiveWindow();
winctl.FindWindows(win => win.isVisible() && win.getTitle()).then(windows => {
	console.log("Visible windows:");
	windows.sort((a,b) => a.getTitle().localeCompare(b.getTitle())).forEach(window => console.log(" - %s [pid=%d, hwnd=%d, parent=%d]", window.getTitle(), window.getPid(), window.getHwnd(), window.getParent()));
	windows.sort((a,b) => a.getTitle().localeCompare(b.getTitle())).forEach(window => checkWindow(window));

});
function checkWindow(window){
	if(window.getTitle().search("PowerPoint Slide Show") != -1 ){
		console.log("presentation found.");
		pptWindow = window;
	}
}

i = 0;
doAdvanceSlide = [true, true, true, true, true, true, false, false, true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true];
slideScenes = ['dcO4BN05EmoCUpL', false, false, false, false, false, 'nqUexAn-fAOXxlM', 'dcO4BN05EmoCUpL', false, false, false, false, false, 'H25kqssdETQQZWJ', 'dcO4BN05EmoCUpL', false, 'N48JF5AhiblEGD2', 'dcO4BN05EmoCUpL', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
slideScenes[20] = 'CruBWkYL8BZBMCV';
slideScenes[21] = 'dcO4BN05EmoCUpL';
slideScenes[23] = '5Pq52V1TC72lKTV';
slideScenes[24] = 'CruBWkYL8BZBMCV';
delays = [];
delays[13] = 1500;
delays[14] = delays[13];
delays[16] = delays[13];

function clickerClick(){
	console.log('i on click is: ' + i);
	if (doAdvanceSlide[i]){
		advanceSlide();
	}
	if (slideScenes[i]){
		console.log('recall called');
		console.log(slideScenes[i]);
		setTimeout(function() {
			client.scenes.recall(slideScenes[i]);
			i++;
			}, delays[i]);
	} else {
		i++;
	}
}

function advanceSlide(){
	var rightDelay = 300;
	var backDelay = 300;
	pptWindow.setForegroundWindow();
	setTimeout(function(){robot.keyTap("right");}, rightDelay);
	setTimeout(function(){thisWindow.setForegroundWindow();}, rightDelay+backDelay);
}

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
    console.log('Successful authentication');
  })
  
client.scenes.recall('dcO4BN05EmoCUpL')
  .then(() => {
    console.log('Start scene  recalled');
  })
  .catch(error => {
    console.log(error.stack);
  });

process.stdin.setRawMode(true);
process.stdin.resume();