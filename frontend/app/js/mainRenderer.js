// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const {
   ipcRenderer
} = require("electron");

let mainPageDiv = document.getElementById('mainpage');
let titleBar = document.getElementById('titleofnavbar');

let countsPageDiv = document.getElementById('countsPage');
countsPageDiv.style.visibility = 'hidden';
countsPageDiv.style.display = 'none';
let userPageDiv = document.getElementById('userPage');
userPageDiv.style.visibility = 'hidden';
userPageDiv.style.display = 'none';
let dataPageDiv = document.getElementById('dataPage');
dataPageDiv.style.visibility = 'hidden';
dataPageDiv.style.display = 'none';
let playingsomethingleftbardiv = document.getElementById('playingsomething');
playingsomethingleftbardiv.style.visibility = 'hidden';
playingsomethingleftbardiv.style.display = 'none';


// const nowplayingbutton = document.getElementById("now playing button");
// nowplayingbutton.addEventListener('click', function() {
//    mainPageDiv.innerHTML = countsPageDiv.innerHTML;
//    var arg = "secondparam";
//
//    //send the info to main process . we can pass any arguments as second param.
//    ipcRenderer.send("nowplaying_click", arg); // ipcRender.send will pass the information to main process
// });

const recentlyplayedbutton = document.getElementById("recently played button");
recentlyplayedbutton.addEventListener('click', function () {
   mainPageDiv.innerHTML = countsPageDiv.innerHTML;
   // titleBar.innerHTML = 'history';
   var arg = "secondparam";
   ipcRenderer.send("recentlyplayed_click", arg); // ipcRender.send will pass the information to main process
});

const userButton = document.getElementById("user page button");
userButton.addEventListener('click', function () {
   mainPageDiv.innerHTML = userPageDiv.innerHTML;
   var arg = "secondparam";
   ipcRenderer.send("userprofile_click", arg); // ipcRender.send will pass the information to main process
});

let datadropdown = document.getElementById('datadropdown');
datadropdown.style.visibility = 'hidden';
datadropdown.style.display = 'none';
var datadropdowntoggle = true;
const dataButton = document.getElementById("data page button");
dataButton.addEventListener('click', function () {
   mainPageDiv.innerHTML = dataPageDiv.innerHTML;
   var arg = "secondparam";
   ipcRenderer.send("dataprofile_click", arg);
   datadropdowntoggle = !datadropdowntoggle;
   if (datadropdowntoggle) {
      
      datadropdown.style.visibility = 'hidden';
      datadropdown.style.display = 'none';
   } else {
      datadropdown.style.visibility = 'visible';
      datadropdown.style.display = 'block';
   }

});
