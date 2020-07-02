// Modules to control application life and create native browser window
const {
   app,
   BrowserWindow,
   ipcMain,
   shell
} = require('electron')
const keytar = require('keytar')
const path = require('path')

require('electron-reload')(__dirname);


const config = require('../config')
const httpConfig = config.httpInfo[1]

const http2 = require('http2');
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const fs = require('fs');

let email;
let authed = false;
let gettingAuthed = false;

var loginWindow, mainWindow;

function createLoginWindow() {
   loginWindow = new BrowserWindow({
      width: 325,
      height: 400,
      webPreferences: {
         preload: path.join(__dirname, 'app/js/preload/login.js'),
         nodeIntegration: true
      }
   })
   loginWindow.loadFile('app/login.html')

   loginWindow.webContents.openDevTools()
}

function createMainWindow() {
   // Create the browser window.
   mainWindow = new BrowserWindow({
      width: 900,
      height: 900,
      titleBarStyle: 'hidden',
      resizeable: true,
      backgroundColor: '#262626',
      webPreferences: {
         preload: path.join(__dirname, 'app/js/preload/main.js'),
         nodeIntegration: true
      }
   })
   mainWindow.loadFile('index.html')

   mainWindow.webContents.on('dom-ready', function () {
      console.log(`mainwindow dom is ready`);
      updateNowPlaying(mainWindow)
      config.loginnInfo = "{lmao}"
   })

   var nowplayingIntervalID;

   mainWindow.on('focus', function () {
      console.log(`mainwindow has focus `);
      updateNowPlaying(mainWindow)
      nowplayingIntervalID = setInterval(function () { //TODO remove this interval on event blur
         console.log(`nowplaying interval HIT`)
         if (authed) {
            if (mainWindow.isFocused()) {
               console.log(`mainwindow has focus - autoupdating nowplaying`);
               updateNowPlaying(mainWindow)
            }
         }
      }, 50000) //25 min * 60000 ms/min = 1500000 ms
   })

   mainWindow.on('blur', function () {
      console.log(`main window blured, intID: ${nowplayingIntervalID}`)
      clearInterval(nowplayingIntervalID);
   })

   mainWindow.webContents.openDevTools()
}

//
//               IPC Incoming
//

ipcMain.on("nowplaying_click", function (event, arg) {
   console.log("nowplaying button clicked")
   headers = {
      ':path': '/nowplaying',
      'email': email
   };
   clientRequest(headers, function (data) {
      if (data === 'getauth') {
         if (!gettingAuthed) {
            gettingAuthed = true
            authSpot();
         }
      } else if (data === 'nothingplaying') {
         event.reply("nowplaying-button-task-finished", data);
      } else {
         try {
            track = JSON.parse(data)
            event.reply("nowplaying-button-task-finished", track);
         } catch (e) {
            console.log(`error parsing now-playing json: ${data}`);
         }
      }
   });
});

ipcMain.on("recentlyplayed_click", function (event, arg) {
   console.log("recentplayed button clicked")
   headers = {
      ':path': '/recentlyplayed',
      'email': email
   };
   clientRequest(headers, function (data) {
      if (data === 'getauth') {
         if (!gettingAuthed) {
            gettingAuthed = true
            authSpot();
         }
      } else {
         try {
            tracks = JSON.parse(data)
            console.log(tracks[0])
            event.reply("recentlyplayed-button-task-finished", tracks)
         } catch (e) {
            console.log(`error parsing recently-played json: ${data}`);
         }
      }
   });
});

ipcMain.on("loginbutton_click", function (event, arg) {
   console.log("login button clicked")
   headers = {
      ':path': '/login',
      'email': arg[0],
      'username': arg[1],
      'password': arg[2]
   };
   clientRequest(headers, function (data) {
      splits = data.split('\n');
      console.log(splits)
      if (splits[0] === 'loginerror') {
         event.reply("login-error", splits[1]);
      } else {
         createMainWindow()
         loginWindow.close()
         email = splits[1]
         keytar.setPassword("Counter-app", email, splits[2]);
      }
   })

});

ipcMain.on("signupbutton_click", function (event, arg) {
   console.log("signup button clicked")
   headers = {
      ':path': '/signup',
      'email': arg[0],
      'username': arg[1],
      'password': arg[2]
   };
   clientRequest(headers, function (data) {
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
   })

});

ipcMain.on("userprofile_click", function (event, arg) {
   console.log("user profile button clicked")

   headers = {
      ':path': '/userprofile',
      'email': email
   };
   clientRequest(headers, function(data){
      splits = data.split('\n');
      console.log(splits)
      if (splits[0] === 'userProfileError') {
         event.reply("userprofile-error", splits[1]);
      } else {
         event.reply("user-button-task-finished", { email: splits[0], username: splits[1], platform: splits[2], created_on: splits[3] });
      }
   })
});

//
//             Interval DB recording
//
setInterval(function () {
   if (authed) {
      headers = {
         ':path': '/updatelistens',
         'email': email
      };
      clientRequest(headers, function(data){});

   }
}, 1500000) //25 min * 60000 ms/min = 1500000 ms


//              Electron specifics
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(function () {
   startup();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
   // On macOS it is common for applications and their menu bar
   // to stay active until the user quits explicitly with Cmd + Q
   if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
   // On macOS it's common to re-create a window in the app when the
   // dock icon is clicked and there are no other windows open.
   if (BrowserWindow.getAllWindows().length === 0) {
      startup();
   }
})

//
//              helper functions
//
function authSpot() {
   headers = {
      ':path': '/authspotify',
      'email': email
   };
   clientRequest(headers, function(data){})

   shell.openExternal(`https://${httpConfig.IP}:8888/login`).then(function () {
      console.log('opened external browser to get auth')
   })
}

function startup() {
   let secret = keytar.findCredentials('Counter-app')
      .then(function (result) {
         if (result[0]) {
            email = result[0].account
            headers = {
               ':path': '/autologin',
               'email': result[0].account,
               'password': result[0].password
            };
            clientRequest(headers, function(data){
               if (data === 'autologinsuccess') {
                  createMainWindow();
               } else {
                  createLoginWindow();
                  console.log(data)
               }
            })
         } else {
            createLoginWindow()
         }
      });
}

function updateNowPlaying(win) {
   headers = {
      ':path': '/nowplaying',
      'email': email
   };
   clientRequest(headers, function(data){
      if (data === 'getauth') {
         if (!gettingAuthed) {
            gettingAuthed = true
            authSpot();
         }
      } else if (data === 'nothingplaying') {
         gettingAuthed = false;
         authed = true;
         win.webContents.send("nowplaying-button-task-finished", data);
         win.webContents.send("nowplaying-button-task-finished", data);
      } else {
         try {
            gettingAuthed = false;
            authed = true;
            track = JSON.parse(data)
            // event.reply("nowplaying-button-task-finished", track);
            win.webContents.send("nowplaying-button-task-finished", track);
         } catch (e) {
            console.log(`error parsing now-playing json: ${data}`);

         }
      }
   });
}

function clientRequest(headers, callback) {
   const clientS = http2.connect(httpConfig.URL, {
      ca: fs.readFileSync(`./certs/${httpConfig.name}-cert.pem`)
   }, function () {
      console.log('connected to https server');
   });
   const req = clientS.request(headers);
   req.on('response', (headers, flags) => {
      console.log('responses (headers):')
      for (const name in headers) {
         console.log(`${name}: ${headers[name]}`);
      }
      console.log('---------')
   });
   let data = '';
   req.on('data', (chunk) => {
      data += chunk;
   });
   req.on('end', () => {
      callback(data);
      clientS.close();
   });
   req.end();
}
