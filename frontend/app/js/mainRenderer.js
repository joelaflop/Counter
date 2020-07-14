// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const {
   ipcRenderer
} = require("electron");

const graphUtil = require('./app/js/util/graphUtil')

let mainPageDiv = document.getElementById('mainpage');
var titleText = document.getElementById('pageTitleText');

let countsPageDiv = document.getElementById('countsPage');

let userPageDiv = document.getElementById('userPage');

let dataPageDiv = document.getElementById('dataPage');

let datadropdown = document.getElementById('datadropdown');
var datadropdowntoggle = true;
datadropdown.style.visibility = 'hidden';
datadropdown.style.display = 'none';

let dataType1PageDiv = document.getElementById('dataType1Page');
let dataType2PageDiv = document.getElementById('dataType2Page');

const recentlyplayedbutton = document.getElementById("recently played button");
recentlyplayedbutton.addEventListener('click', function () {
   if (datadropdown.style.visibility != 'hidden') {
      datadropdown.style.visibility = 'hidden';
      datadropdown.style.display = 'none';
      datadropdowntoggle = !datadropdowntoggle;
   }

   mainPageDiv.innerHTML = countsPageDiv.innerHTML;
   titleText.innerText = 'history';
   // titleBar.innerHTML = 'history';
   var arg = "secondparam";
   ipcRenderer.send("recentlyplayed_click", arg); 
});

const userButton = document.getElementById("user page button");
userButton.addEventListener('click', function () {
   if (datadropdown.style.visibility != 'hidden') {
      datadropdown.style.visibility = 'hidden';
      datadropdown.style.display = 'none';
      datadropdowntoggle = !datadropdowntoggle;
   }
   mainPageDiv.innerHTML = userPageDiv.innerHTML;
   titleText.innerText = 'user page';
   var arg = "secondparam";
   ipcRenderer.send("userprofile_click", arg); 
});


const dataButton = document.getElementById("data page button");
dataButton.addEventListener('click', function () {
   // mainPageDiv.innerHTML = dataPageDiv.innerHTML;

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

const datatype1Button = document.getElementById("datatype1");
datatype1Button.addEventListener('click', function () {

   titleText.innerText = 'data analysis type 1';
   mainPageDiv.innerHTML = dataType1PageDiv.innerHTML;

   var arg = "secondparam";
   ipcRenderer.send("datatype1_click", arg);

});

const datatype2Button = document.getElementById("datatype2");
datatype2Button.addEventListener('click', function () {
   titleText.innerText = 'data analysis type 2';
   mainPageDiv.innerHTML = dataType2PageDiv.innerHTML;

   var arg = "secondparam";
   ipcRenderer.send("datatype2_click", arg);

});

ipcRenderer.on("datatype1-artistcounts-finished", function (event, dat) {
   data = JSON.parse(dat)
   data.forEach(element => {
      element.count = parseInt(element.count)
   });
   graphUtil.countsBarGraph(data, 'dataType1ArtistCounts', 'artists')


});

ipcRenderer.on("datatype1-albumcounts-finished", function (event, dat) {
   data = JSON.parse(dat)
   data.forEach(element => {
      element.count = parseInt(element.count)
   });
   graphUtil.countsBarGraph(data, 'dataType1AlbumCounts', 'album')
   // data = [{ artists: 'a', count: 25 }, { artists: 'b', count: 2.5 }, { artists: 'c', count: 5 }, { artists: 'd', count: 15 }]




});

ipcRenderer.on("datatype1-songcounts-finished", function (event, dat) {
   data = JSON.parse(dat)
   data.forEach(element => {
      element.count = parseInt(element.count)
   });
   graphUtil.countsBarGraph(data, 'dataType1SongCounts', 'song')

});