// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer } = require("electron");

const btnclick = document.getElementById("test button");
btnclick.addEventListener('click', function () {
    var arg ="secondparam";

   //send the info to main process . we can pass any arguments as second param.
    ipcRenderer.send("test_button_click", arg); // ipcRender.send will pass the information to main process
});

ipcRenderer.on("test-button-task-finished",function (event, arg) {
   console.log("renderer got confirmation")
});
