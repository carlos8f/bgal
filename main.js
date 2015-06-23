var app = require('app')
  , BrowserWindow = require('browser-window')
  , axon = require('axon')
  , push = axon.socket('push')
  , pull = axon.socket('pull')
  , id = require('idgen')()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

pull.connect(6634);
push.connect(6635);

pull.on('connect', function () {
  console.log(id, 'connected to pull server');
});

push.on('connect', function () {
  console.log(id, 'connected to push server');
});

pull.on('message', function (msg) {
  msg = msg.toString();
  if (!~msg.indexOf(id)) {
    console.log('pulled msg', msg.toString());
  }
});

setInterval(function () {
  push.send(id + ' says time is ' + new Date().getTime());
}, 5000);

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
