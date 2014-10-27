

var server = require('./server.js');

var fs = require('fs'),
    proc = require('child_process');


server.on('listening', function() {
  var child = proc.spawn('mocha-phantomjs', ['http://localhost:3000/test-runner'], {stdio: 'inherit'});
  child.on('exit', function(code){
    process.exit(code);
  });
});

