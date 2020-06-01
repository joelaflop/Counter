// Modules to control application life and create native browser window
const {
   app,
   BrowserWindow,
   ipcMain
} = require('electron')
const keytar = require('keytar')
const path = require('path')
var net = require('net');

let email;

var client = net.connect({
   port: 8080
}, function() {
   console.log('connected to server');
});

let loginWindow, mainWindow;

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

   loginWindow.webContents.openDevTools()
}

function createMainWindow() {
   // Create the browser window.
   mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
         preload: path.join(__dirname, 'app/js/preload/main.js'),
         nodeIntegration: true
      }
   })
   mainWindow.loadFile('index.html')

   mainWindow.webContents.openDevTools()
}

// ipcMain.on("authbutton_click", function(event, arg) {
//    console.log("auth button clicked")
//
//    authSpot();
//
//    // inform the render process that the assigned task finished. Show a message in html
//    // event.sender.send in ipcMain will return the reply to renderprocess
//    event.sender.send("auth-button-task-finished", "yes");
// });

function authSpot(){
   client.write('authspotify\v'+email+'\v\r');

   const authWindow = new BrowserWindow({
      width: 600,
      height: 800,
   })
   authWindow.loadURL('http://localhost:8888/login')

   authWindow.webContents.on("will-redirect", function(event, url) {
      if (url.startsWith("https://spotify")) {
         authWindow.close();
      }
   })
}

ipcMain.on("nowplaying_click", function(event, arg) {
   console.log("nowplaying button clicked")
   client.write('nowplaying\v'+email+'\v\r');
});

ipcMain.on("recentlyplayed_click", function(event, arg) {
   console.log("recentplayed button clicked")
   client.write('recentlyplayed\v'+email+'\v\r');
});

ipcMain.on("loginbutton_click", function(event, arg) {
   console.log("login button clicked")
   client.write('login\v' + arg[0] + '\v' + arg[1] + '\r');

});

ipcMain.on("signupbutton_click", function(event, arg) {
   console.log("signup button clicked")
   client.write('signup\v' + arg[0] + '\v' + arg[1] + '\r');
});

client.on('data', function(dat) {
   data = dat.toString()
   split = data.split("\v");
   if (split[0] == 'recentlyplayed') {
      mainWindow.webContents.send("recentlyplayed-button-task-finished",
         JSON.parse(split[1]));
   } else if (split[0] == 'nowplaying') {
      mainWindow.webContents.send("nowplaying-button-task-finished", JSON.parse(split[1]));
   } else if (split[0] == 'loginsuccess' || split[0] == 'signupsuccess') {
      createMainWindow()
      loginWindow.close()
      email = split[1]
      password = split[2].substring(0, split[2].length - 1)
      keytar.setPassword("Counter-app", email, password);
   } else if (split[0] == 'autologinerror') {
      createLoginWindow();
   } else if (split[0] == 'autologinsuccess') {
      createMainWindow();
   } else if (split[0] == 'signuperror') {
      loginWindow.webContents.send("signup-error", split[1]);
   } else if (split[0] == 'loginerror') {
      loginWindow.webContents.send("login-error", split[1]);
   } else if (split[0] == 'getAuth'){
      authSpot();
   }

});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(function() {
   let secret = keytar.findCredentials('Counter-app')
      .then(function(result) {
         if (result[0]) {
            email = result[0].account
            client.write('autologin\v' + result[0].account + '\v' + result[0].password + '\r');
         } else {
            createLoginWindow()
         }
      });
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
   if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
})
