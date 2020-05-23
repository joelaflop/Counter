// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer } = require("electron");

const authbutton = document.getElementById("auth button");
const nowplayingbutton = document.getElementById("now playing button");
const refreshtokenbutton = document.getElementById("token refresh button");

authbutton.addEventListener('click', function () {
    var arg ="secondparam";

   //send the info to main process . we can pass any arguments as second param.
    ipcRenderer.send("authbutton_click", arg); // ipcRender.send will pass the information to main process
});
ipcRenderer.on("auth-button-task-finished",function (event, arg) {
   console.log("renderer got confirmation of authbutton click")
});

nowplayingbutton.addEventListener('click', function () {
    var arg ="secondparam";

   //send the info to main process . we can pass any arguments as second param.
    ipcRenderer.send("nowplaying_click", arg); // ipcRender.send will pass the information to main process
});
ipcRenderer.on("nowplaying-button-task-finished",function (event, arg) {
   console.log("renderer got confirmation of nowplaying click")
});
