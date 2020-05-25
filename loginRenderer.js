const { ipcRenderer } = require("electron");

const loginButton = document.getElementById("login button");

loginButton.addEventListener('click', function () {
   var arg ="secondparam";

   //send the info to main process . we can pass any arguments as second param.
   ipcRenderer.send("loginbutton_click", arg); // ipcRender.send will pass the information to main process
});
