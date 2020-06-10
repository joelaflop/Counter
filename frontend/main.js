// Modules to control application life and create native browser window
const {
   app,
   BrowserWindow,
   ipcMain,
   shell
} = require('electron')
const keytar = require('keytar')
const path = require('path')
var net = require('net');

let email;
let authed = false;

app.allowRendererProcessReuse = true;

var client = net.connect({
   port: 8080
   , host:'192.168.1.57'
}, function() {
   console.log('connected to server');
   client.write('lmao we got in')
});

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
   client.write('authspotify\v' + email + '\v\r');

   // const authWindow = new BrowserWindow({
   //    width: 600,
   //    height: 800,
   // })
   // authWindow.loadURL('http://192.168.1.57:8888/login')
   shell.openExternal('http:192.168.1.57:8888/login').then(function(){console.log('opened external browser to get auth')})

   // authWindow.webContents.on("will-redirect", function(event, url) {
   //    if (url.startsWith("https://spotify")) {
   //       authWindow.close();
   //       authed = true;
   //    }
   // })
}

function startup() {
   let secret = keytar.findCredentials('Counter-app')
      .then(function(result) {
         if (result[0]) {
            email = result[0].account
            client.write('autologin\v' + result[0].account + '\v' + result[0].password + '\v\r');
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
   client.write('nowplaying\v' + email + '\v\r');
});
ipcMain.on("recentlyplayed_click", function(event, arg) {
   console.log("recentplayed button clicked")
   client.write('recentlyplayed\v' + email + '\v\r');
});
ipcMain.on("loginbutton_click", function(event, arg) {
   console.log("login button clicked")
   client.write('login\v' + arg[0] + '\v' + arg[1] + '\v' + arg[2] + '\v\r');

});
ipcMain.on("signupbutton_click", function(event, arg) {
   console.log("signup button clicked")
   client.write('signup\v' + arg[0] + '\v' + arg[1] + '\v' + arg[2] + '\v\r');
});

//
//             Server Comm Incoming
//

client.on('data', function(dat) {
   data = dat.toString()
   split = data.split("\v");
   code = split[0];
   if (code == 'recentlyplayed') {
      mainWindow.webContents.send("recentlyplayed-button-task-finished"
                                 , JSON.parse(split[1]));
      authed = true;
   } else if (code == 'nowplaying') {
      mainWindow.webContents.send("nowplaying-button-task-finished"
                                 , JSON.parse(split[1]));
      authed = true;
   } else if (code == 'loginsuccess' || code == 'signupsuccess') {
      createMainWindow()
      loginWindow.close()

      email = split[1]
      password = split[2]
      keytar.setPassword("Counter-app", email, password);
   } else if (code == 'autologinerror') {
      createLoginWindow();
   } else if (code == 'autologinsuccess') {
      createMainWindow();
   } else if (code == 'signuperror') {
      loginWindow.webContents.send("signup-error", split[1]);
   } else if (code == 'loginerror') {
      loginWindow.webContents.send("login-error", split[1]);
   } else if (code == 'getauth') {
      console.log('client getting auth')
      authSpot();
   }
});

//
//             Interval DB recording
//

setInterval(function() {
   if (authed) {
      client.write('updateListens\v' + email + '\v\r');
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
