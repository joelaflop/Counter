// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const { ipcMain } = require('electron');
const spotify = require('./spotify');
//const nowplaying = require('./nowplaying');

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  ipcMain.on("authbutton_click",function (event, arg) {
        //create new window
       console.log("test button clicked")
       authSpot()
       // inform the render process that the assigned task finished. Show a message in html
      // event.sender.send in ipcMain will return the reply to renderprocess
       event.sender.send("auth-button-task-finished", "yes");
   });

   ipcMain.on("nowplaying_click",function (event, arg) {
        console.log("nowplaying button clicked")
        response = spotify.nowPlaying(function(track){
           event.sender.send("nowplaying-button-task-finished", track.item);
        });
   });

   ipcMain.on("recentlyplayed_click",function (event, arg) {
        console.log("recentplaying button clicked")
        spotify.recentlyPlayed(function(tracks){
            event.sender.send("recentlyplayed-button-task-finished", tracks.items);
        });
   });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

function authSpot () {
   const authWindow = new BrowserWindow({
     width: 600,
     height: 800,
     webPreferences: {
      preload: path.join(__dirname, 'preload.js'),

     }
   })
   authWindow.loadURL('http://localhost:8888/')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
