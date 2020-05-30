const {
   ipcRenderer
} = require("electron");

var email = document.getElementById("email")
var password = document.getElementById("password")

const loginButton = document.getElementById("login button");

loginButton.addEventListener('click', function() {

   info = [email.value, password.value];

   //send the info to main process . we can pass any arguments as second param.
   ipcRenderer.send("loginbutton_click", info); // ipcRender.send will pass the information to main process
});

const signupButton = document.getElementById("singup-button");

signupButton.addEventListener('click', function() {
   info = [email.value, password.value];

   //send the info to main process . we can pass any arguments as second param.
   ipcRenderer.send("signupbutton_click", info); // ipcRender.send will pass the information to main process
});

ipcRenderer.on("login-error", function(event, errorMessage) {
   document.getElementById('errorDiv').innerHTML = errorMessage
});
ipcRenderer.on("signup-error", function(event, errorMessage) {
   document.getElementById('errorDiv').innerHTML = errorMessage
});
