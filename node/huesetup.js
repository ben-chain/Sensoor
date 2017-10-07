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
  
client.scenes.getAll()
  .then(scenes => {
    for (let scene of scenes) {
      console.log(`Scene [${scene.id}]: ${scene.name}`);
      console.log('  Lights:', scene.lightIds.join(', '));
      console.log();
    }
  });
  
  client.scenes.recall('64b4aa87ea-on-0')
  .then(() => {
    console.log('Scene  recalled');
  })
  .catch(error => {
    console.log(error.stack);
  });