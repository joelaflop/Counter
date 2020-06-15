// Modules to control application life and create native browser window
const {
   app,
   BrowserWindow,
   ipcMain,
   shell
} = require('electron')
const keytar = require('keytar')
const path = require('path')
// var net = require('net');
const config = require('../config')

const http2 = require('http2');
const fs = require('fs');

let email;
let authed = false;

// app.allowRendererProcessReuse = true;

var loginWindow, mainWindow;

function createLoginWindow() {
   loginWindow = new BrowserWindow({
      width: 500,
      height: 500,
      webPreferences: {
         preload: path.join(__dirname, 'app/js/preload/login.js'),
         nodeIntegration: true
      }
   })
   loginWindow.loadFile('app/login.html')

   // loginWindow.webContents.openDevTools()
}

function createMainWindow() {
   // Create the browser window.
   mainWindow = new BrowserWindow({
      width: 600,
      height: 900,
      webPreferences: {
         preload: path.join(__dirname, 'app/js/preload/main.js'),
         nodeIntegration: true
      }
   })
   mainWindow.loadFile('index.html')

   mainWindow.webContents.openDevTools()
}

function authSpot() {
   // client.write('authspotify\v' + email + '\v\r');

   const clientS = http2.connect(config.serverURL, {
      ca: fs.readFileSync('localhost--cert.pem')
   }, function() {
      console.log('connected to https server');
   });
   //email password username
   const req = clientS.request({
      ':path': '/authspotify',
      'email': email
   });
   req.on('response', (headers, flags) => {
      console.log('responses (headers):')
      for (const name in headers) {
         console.log(`${name}: ${headers[name]}`);
      }
      console.log('---------')
   });
   req.setEncoding('utf8');
   // let data = '';
   // req.on('data', (chunk) => {
   //    data += chunk;
   // });
   req.on('end', () => {
      clientS.close();
   });
   req.end();


   shell.openExternal(`http:${config.serverIP}:8888/login`).then(function() {
      console.log('opened external browser to get auth')
   })

}

function startup() {
   let secret = keytar.findCredentials('Counter-app')
      .then(function(result) {
         if (result[0]) {
            email = result[0].account
            // client.write('autologin\v' + result[0].account + '\v' + result[0].password + '\v\r');
            const clientS = http2.connect(config.serverURL, {
               ca: fs.readFileSync('localhost--cert.pem')
            }, function() {
               console.log('connected to https server');
            });
            const req = clientS.request({
               ':path': '/autologin',
               'email':result[0].account,
               'password':result[0].password
            });
            req.on('response', (headers, flags) => {
               console.log('responses (headers):')
               for (const name in headers) {
                  console.log(`${name}: ${headers[name]}`);
               }
               console.log('---------')
            });
            req.setEncoding('utf8');
            let data = '';
            req.on('data', (chunk) => {
               data += chunk;
            });
            req.on('end', () => {
               if (data === 'autologinerror') {
                  createLoginWindow();
               } else {
                  createMainWindow();
               }
               clientS.close();
            });
            req.end();

         } else {
            createLoginWindow()
         }
      });
}

//
//               IPC Incoming
//

ipcMain.on("nowplaying_click", function(event, arg) {
   console.log("nowplaying button clicked")
   // client.write('nowplaying\v' + email + '\v\r');

   const clientS = http2.connect(config.serverURL, {
      ca: fs.readFileSync('localhost--cert.pem')
   }, function() {
      console.log('connected to https server');
   });
   const req = clientS.request({
      ':path': '/nowplaying',
      'email':email
   });
   req.on('response', (headers, flags) => {
      console.log('responses (headers):')
      for (const name in headers) {
         console.log(`${name}: ${headers[name]}`);
      }
      console.log('---------')
   });
   req.setEncoding('utf8');
   let data = '';
   req.on('data', (chunk) => {
      data += chunk;
   });
   req.on('end', () => {
      if (data === 'getauth') {
         authSpot();
      } else {
         track = JSON.parse(data)
         event.reply("nowplaying-button-task-finished", track)
      }
      clientS.close();
   });
   req.end();

});

ipcMain.on("recentlyplayed_click", function(event, arg) {
   console.log("recentplayed button clicked")
   // client.write('recentlyplayed\v' + email + '\v\r');
   const clientS = http2.connect(config.serverURL, {
      ca: fs.readFileSync('localhost--cert.pem')
   }, function() {
      console.log('connected to https server');
   });
   const req = clientS.request({
      ':path': '/recentlyplayed',
      'email': email
   });
   req.on('response', (headers, flags) => {
      console.log('responses (headers):')
      for (const name in headers) {
         console.log(`${name}: ${headers[name]}`);
      }
      console.log('---------')
   });
   req.setEncoding('utf8');
   let data = '';
   req.on('data', (chunk) => {
      data += chunk;
   });
   req.on('end', () => {
      if (data === 'getauth') {
         authSpot();
      } else {
         tracks = JSON.parse(data)
         event.reply("recentlyplayed-button-task-finished", tracks)

      }
      clientS.close();
   });
   req.end();
});

ipcMain.on("loginbutton_click", function(event, arg) {
   console.log("login button clicked")
   // client.write('login\v' + arg[0] + '\v' + arg[1] + '\v' + arg[2] + '\v\r');

   const clientS = http2.connect(config.serverURL, {
      ca: fs.readFileSync('localhost--cert.pem')
   }, function() {
      console.log('connected to https server');
   });
   //email password username
   const req = clientS.request({
      ':path': '/login',
      'email': arg[0],
      'username': arg[1],
      'password':arg[2]
   });
   req.on('response', (headers, flags) => {
      console.log('responses (headers):')
      for (const name in headers) {
         console.log(`${name}: ${headers[name]}`);
      }
      console.log('---------')
   });
   req.setEncoding('utf8');
   let data = '';
   req.on('data', (chunk) => {
      data += chunk;
   });
   req.on('end', () => {
      splits = data.split('\n');
      console.log(splits)
      if (splits[0] === 'loginerror') {
         event.reply("signup-error", splits[1]);
      } else {
         createMainWindow()
         loginWindow.close()
         email = splits[1]
         keytar.setPassword("Counter-app", email, splits[2]);
      }
      clientS.close();
   });
   req.end();

});
ipcMain.on("signupbutton_click", function(event, arg) {
   console.log("signup button clicked")
   // client.write('signup\v' + arg[0] + '\v' + arg[1] + '\v' + arg[2] + '\v\r');
   const clientS = http2.connect(config.serverURL, {
      ca: fs.readFileSync('localhost--cert.pem')
   }, function() {
      console.log('connected to https server');
   });
   //email password username
   const req = clientS.request({
      ':path': '/signup',
      'email': arg[0],
      'username': arg[1],
      'password':arg[2]
   });
   req.on('response', (headers, flags) => {
      console.log('responses (headers):')
      for (const name in headers) {
         console.log(`${name}: ${headers[name]}`);
      }
      console.log('---------')
   });
   req.setEncoding('utf8');
   let data = '';
   req.on('data', (chunk) => {
      data += chunk;
   });
   req.on('end', () => {
      splits = data.split('\n');
      console.log(splits)
      if (splits[0] === 'signuperror') {
         event.reply("signup-error", splits[1]);
      } else {
         createMainWindow()
         loginWindow.close()
         email = splits[1]
         keytar.setPassword("Counter-app", email, splits[2]);
      }
      clientS.close();
   });
   req.end();
});

//
//             Interval DB recording
//
setInterval(function() {
   if (authed) {
      // client.write('updateListens\v' + email + '\v\r');
      // client.write('nowplaying\v' + email + '\v\r');

      const clientS = http2.connect(config.serverURL, {
         ca: fs.readFileSync('localhost--cert.pem')
      }, function() {
         console.log('connected to https server');
      });
      const req = clientS.request({
         ':path': '/updatelistens',
         'email':email
      });
      req.on('response', (headers, flags) => {
         console.log('responses (headers):')
         for (const name in headers) {
            console.log(`${name}: ${headers[name]}`);
         }
         console.log('---------')
      });
      req.setEncoding('utf8');
      let data = '';
      req.on('data', (chunk) => {
         data += chunk;
      });
      req.on('end', () => {
         clientS.close();
      });
      req.end();

   }
}, 1500000) //25 min * 60000 ms/min = 1500000 ms


//              Electron specifics
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(function() {
   startup();
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
   // On macOS it is common for applications and their menu bar
   // to stay active until the user quits explicitly with Cmd + Q
   if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
   // On macOS it's common to re-create a window in the app when the
   // dock icon is clicked and there are no other windows open.
   if (BrowserWindow.getAllWindows().length === 0) {
      startup();
   }
})
