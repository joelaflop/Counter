// Modules to control application life and create native browser window
const {
   app,
   BrowserWindow,
   ipcMain
} = require('electron')
const path = require('path')
var net = require('net');
var client = net.connect({port: 8080}, function() {
   console.log('connected to server!');
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

ipcMain.on("authbutton_click", function(event, arg) {
   console.log("auth button clicked")

   const authWindow = new BrowserWindow({
      width: 600,
      height: 800,
   })
   authWindow.loadURL('http://localhost:8888/login')

   authWindow.webContents.on("will-redirect", function(event, url){
      if(url.startsWith("https://spotify")){
         authWindow.close();
      }
   })
   // inform the render process that the assigned task finished. Show a message in html
   // event.sender.send in ipcMain will return the reply to renderprocess
   event.sender.send("auth-button-task-finished", "yes");
});

ipcMain.on("nowplaying_click", function(event, arg) {
   console.log("nowplaying button clicked")
   client.write('nowplaying\r');
});

ipcMain.on("recentlyplayed_click", function(event, arg) {
   console.log("recentplayed button clicked")
   client.write('recentlyplayed\r');
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
   if(split[0] == 'recentlyplayed'){
      mainWindow.webContents.send("recentlyplayed-button-task-finished",
                        JSON.parse(split[1]));
   }
   else if(split[0] == 'nowplaying'){
      mainWindow.webContents.send("nowplaying-button-task-finished", JSON.parse(split[1]));
   }

   else if(split[0] == 'loginerror'){
      loginWindow.webContents.send("login-error", split[1]);
   }
   else if(split[0] == 'loginsuccess'){
      createMainWindow()
      loginWindow.close()
   }
   else if(split[0] == 'signuperror'){
      loginWindow.webContents.send("signup-error", split[1]);
   }
   else if(split[0] == 'signupsuccess'){
      createMainWindow()
      loginwindow.close()
   }

});

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
