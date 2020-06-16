const {
   ipcRenderer
} = require("electron");

var email = document.getElementById("email")
var username = document.getElementById("username")
var signupPassword = document.getElementById("password-signup")
var loginPassword = document.getElementById("password-login")

var signupPage = document.getElementById("signup-page");
var loginPage = document.getElementById("login-page");
signupPage.style.visibility = 'hidden';
signupPage.style.display = 'none';

const loginButton = document.getElementById("login-button");

loginButton.addEventListener('click', function() {

   // id.value
   // password.value

   if (/.*@.*\..*/.test(id.value)) {
      //got an email probably
      info = [id.value, '', loginPassword.value];
      ipcRenderer.send("loginbutton_click", info);
   } else {
      //got a username probably
      if (id.value.includes('@')) {
         document.getElementById('errorDiv').innerHTML = 'get rid of the @ character'
      } else {
         info = ['', id.value, loginPassword.value];
         console.log(info)
         ipcRenderer.send("loginbutton_click", info);
      }
   }

   //send the info to main process . we can pass any arguments as second param.
   // ipcRenderer.send("loginbutton_click", info); // ipcRender.send will pass the information to main process
});

document.addEventListener("keydown", function(event) {
   if (event.key == "Enter") {
      info = [email.value, username.value, password.value];

      //send the info to main process . we can pass any arguments as second param.
      ipcRenderer.send("loginbutton_click", info); // ipcRender.send will pass the information to main process
   }
});

const signupPageButton = document.getElementById("signup-page-button");

signupPageButton.addEventListener('click', function() {
   console.log('setting up signup page')

   loginPage.style.visibility = 'hidden';
   loginPage.style.display = 'none';
   signupPage.style.visibility = 'visible';
   signupPage.style.display = 'block';
});

const signupButton = document.getElementById("signup-button");

signupButton.addEventListener('click', function() {

   info = [email.value, username.value, signupPassword.value];

   //send the info to main process . we can pass any arguments as second param.
   ipcRenderer.send("signupbutton_click", info); // ipcRender.send will pass the information to main process
});

ipcRenderer.on("login-error", function(event, errorMessage) {
   document.getElementById('errorDiv').innerHTML = errorMessage
});
ipcRenderer.on("signup-error", function(event, errorMessage) {
   document.getElementById('errorDiv').innerHTML = errorMessage
});
