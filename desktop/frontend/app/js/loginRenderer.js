const {
   ipcRenderer
} = require("electron");

var signupInputEmail = document.getElementById("signupInputEmail")
var loginInputID = document.getElementById("loginInputID")
var signupInputUsername = document.getElementById("signupInputUsername")
var signupInputPassword = document.getElementById("signupInputPassword")
var loginPassword = document.getElementById("loginInputPassword")

var signupPage = document.getElementById("signup-page");
var loginPage = document.getElementById("login-page");
signupPage.style.visibility = 'hidden';
signupPage.style.display = 'none';

let errorDiv = document.getElementById('errorDiv')
errorDiv.style.visibility = 'hidden';
errorDiv.style.display = 'none';

const loginButton = document.getElementById("login-button");

loginButton.addEventListener('click', function() {

   if (/.*@.*\..*/.test(loginInputID.value)) {
      //got an email probably
      info = [loginInputID.value, '', loginPassword.value];
      ipcRenderer.send("loginbutton_click", info);
   } else {
      //got a username probably
      if (loginInputID.value.includes('@')) {
         document.getElementById('errorDiv').innerHTML = 'get rid of the @ character'
      } else {
         info = ['', loginInputID.value, loginPassword.value];
         console.log(info)
         ipcRenderer.send("loginbutton_click", info);
      }
   }

   //send the info to main process . we can pass any arguments as second param.
   // ipcRenderer.send("loginbutton_click", info); // ipcRender.send will pass the information to main process
});

document.addEventListener("keydown", function(event) {
   console.log('login render got key event')
   if (event.key == "Enter") {
      if (/.*@.*\..*/.test(loginInputID.value)) {
         //got an email probably
         info = [loginInputID.value, '', loginPassword.value];
         ipcRenderer.send("loginbutton_click", info);
      } else {
         //got a username probably
         if (loginInputID.value.includes('@')) {
            document.getElementById('errorDiv').innerHTML = 'get rid of the @ character'
         } else {
            info = ['', loginInputID.value, loginPassword.value];
            console.log(info)
            ipcRenderer.send("loginbutton_click", info);
         }
      }
   }
});

const loginPageButton = document.getElementById("login-page-button");

loginPageButton.addEventListener('click', function() {
   console.log('setting up login page')

   loginPage.style.visibility = 'visible';
   loginPage.style.display = 'block';
   signupPage.style.visibility = 'hidden';
   signupPage.style.display = 'none';
   errorDiv.style.visibility = 'hidden';
   errorDiv.style.display = 'none';
});

const signupPageButton = document.getElementById("signup-page-button");

signupPageButton.addEventListener('click', function() {
   console.log('setting up signup page')

   loginPage.style.visibility = 'hidden';
   loginPage.style.display = 'none';
   signupPage.style.visibility = 'visible';
   signupPage.style.display = 'block';
   errorDiv.style.visibility = 'hidden';
   errorDiv.style.display = 'none';
});

const signupButton = document.getElementById("signup-button");

signupButton.addEventListener('click', function() {

   info = [signupInputEmail.value, signupInputUsername.value, signupInputPassword.value];

   //send the info to main process . we can pass any arguments as second param.
   ipcRenderer.send("signupbutton_click", info); // ipcRender.send will pass the information to main process
});

ipcRenderer.on("login-error", function(event, errorMessage) {
   errorDiv.style.visibility = 'visible';
   errorDiv.style.display = 'block';
   errorDiv.innerHTML = errorMessage
});
ipcRenderer.on("signup-error", function(event, errorMessage) {
   errorDiv.style.visibility = 'visible';
   errorDiv.style.display = 'block';
   errorDiv.innerHTML = errorMessage
});
