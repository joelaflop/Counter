// Modules to control application life and create native browser window
const {
   app,
   BrowserWindow,
   ipcMain
} = require('electron')
// const remote = require('electron').remote;
const path = require('path')
const spotify = require('./app/js/spotify');
const auth = require('./app/js/auth');

//const nowplaying = require('./nowplaying');

let loginWindow, mainWindow;

function createLoginWindow() {
   loginWindow = new BrowserWindow({
      width: 500,
      height: 500,
      webPreferences: {
         preload: path.join(__dirname, 'app/js/preload.js'),
         nodeIntegration: true
      }
   })
   loginWindow.loadFile('app/login.html')

   // Open the DevTools.
   loginWindow.webContents.openDevTools()
}

function createMainWindow() {
   // Create the browser window.
   mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
         preload: path.join(__dirname, 'app/js/preload.js'),
         nodeIntegration: true
      }
   })
   // and load the index.html of the app.
   mainWindow.loadFile('index.html')

   // Open the DevTools.
   mainWindow.webContents.openDevTools()
}

function authSpot() {
   const authWindow = new BrowserWindow({
      width: 600,
      height: 800,
      webPreferences: {
         preload: path.join(__dirname, 'app/js/preload.js'),

      }
   })
   authWindow.loadURL('http://localhost:8888/')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createLoginWindow)

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on("authbutton_click", function(event, arg) {
   //create new window
   console.log("test button clicked")
   authSpot()
   // inform the render process that the assigned task finished. Show a message in html
   // event.sender.send in ipcMain will return the reply to renderprocess
   event.sender.send("auth-button-task-finished", "yes");
});

ipcMain.on("nowplaying_click", function(event, arg) {
   console.log("nowplaying button clicked")
   response = spotify.nowPlaying(function(track) {
      event.sender.send("nowplaying-button-task-finished", track.item);
   });
});

ipcMain.on("recentlyplayed_click", function(event, arg) {
   console.log("recentplaying button clicked")
   spotify.recentlyPlayed(function(tracks) {
      event.sender.send("recentlyplayed-button-task-finished", tracks.items);
   });
});

ipcMain.on("loginbutton_click", function(event, arg) {
   console.log("login button clicked")

   auth.login(arg[0], arg[1], function(error) {
      switch (error.code) {
         case "auth/invalid-email":
            break;
         case "auth/invalid-user-token":
            break;
         case "auth/requires-recent-login":
            break;
         case "auth/user-token-expired":
            break;
         default:
            console.log(error)
            console.log(error.code)
            console.log(error.message)

      }
      event.sender.send("login-error", error.message);
   }, function(success) {
      console.log(success);
      loginWindow.close();
      createMainWindow();
   });
});

ipcMain.on("signupbutton_click", function(event, arg) {
   console.log("signup button clicked")

   auth.signup(arg[0], arg[1], function(error) {
      switch (error.code) {
         case "auth/invalid-email":
            break;
         case "auth/invalid-user-token":
            break;
         case "auth/requires-recent-login":
            break;
         case "auth/user-token-expired":
            break;
         case "auth/email-already-in-use":
            break;
         default:
            console.log(error)
            console.log(error.code)
            console.log(error.message)
      }
      event.sender.send("login-error", error.message);
   }, function(success) {
      console.log(success);
      loginWindow.close();
      createMainWindow();
   });
});
