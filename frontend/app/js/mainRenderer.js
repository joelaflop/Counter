// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const {
   ipcRenderer
} = require("electron");

const graphUtil = require('./app/js/util/graphUtil');
const { keys } = require("d3");
// const { data } = require("jquery");

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
   ipcRenderer.send("dataprofile_click", '');
   titleText.innerText = 'Counts - this week';
   mainPageDiv.innerHTML = dataType1PageDiv.innerHTML;
   var count = 5;
   var days = 7;
   ipcRenderer.send("datatype1_click", [days, count]);
   const datatype1settingsbutton = document.getElementById("dataType1SettingsMenuButton");
   var settingsMenuToggle = false;
   const dataType1SettingsMenu = document.getElementById("dataType1SettingsMenu");
   dataType1SettingsMenu.style.visibility = 'invisible';
   dataType1SettingsMenu.style.display = 'none';
   datatype1settingsbutton.addEventListener('click', function () {
      settingsMenuToggle = !settingsMenuToggle
      if (settingsMenuToggle) {
         dataType1SettingsMenu.style.visibility = 'visible';
         dataType1SettingsMenu.style.display = 'block';
         const dataType1DaysInput = document.getElementById('dataType1DaysInput');
         dataType1DaysInput.addEventListener('click', function () {
            dataType1DaysInput.value = '';
         })
         const dataType1CountInput = document.getElementById('dataType1CountInput');
         // dataType1CountInput.addEventListener('click', function () {
         //    dataType1CountInput.value = '';
         // })

         if (!dataType1DaysInput.value) {
            dataType1DaysInput.value = 'this last week'
         }
         if (!dataType1CountInput.value) {
            dataType1CountInput.value = count
         }

         dataType1SettingsMenu.addEventListener("keydown", function (event) {
            if (event.key == "Enter") {
               let daysTemp = dataType1DaysInput.value
               if (isNaN(daysTemp)) {
                  titleText.innerText = `Counts - ${daysTemp}`;
                  if (daysTemp === 'today') {
                     days = 1;
                  } else if (daysTemp === 'this last week') {
                     days = 7;
                  } else if (daysTemp === 'this last month') {
                     days = 31;
                  } else if (daysTemp === 'this last year') {
                     days = 365;
                  } else if (daysTemp === 'all time') {
                     days = 10000;
                  } else {
                     //TODO: case when we arent given a valid string
                     console.log(daysTemp)
                     console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n')
                  }
               } else {
                  days = daysTemp
                  titleText.innerText = `Counts - last ${days} days`;
               }
               console.log(days)

               count = dataType1CountInput.value
               if (!count) {
                  count = 5
               }
               if (days && count) {
                  ipcRenderer.send("datatype1_click", [days, count]);

                  dataType1SettingsMenu.style.visibility = 'invisible';
                  dataType1SettingsMenu.style.display = 'none';
                  settingsMenuToggle = !settingsMenuToggle
               }

            }
         });
      } else {
         dataType1SettingsMenu.style.visibility = 'invisible';
         dataType1SettingsMenu.style.display = 'none';
      }

   });

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

});

ipcRenderer.on("datatype1-songcounts-finished", function (event, dat) {
   data = JSON.parse(dat)
   data.forEach(element => {
      element.count = parseInt(element.count)
   });
   graphUtil.countsBarGraph(data, 'dataType1SongCounts', 'song')

});


const datatype2Button = document.getElementById("datatype2");
datatype2Button.addEventListener('click', function () {
   ipcRenderer.send("dataprofile_click", '');

   mainPageDiv.innerHTML = dataType2PageDiv.innerHTML;

   var count = 5;
   var days = 10000;
   var type = 'weekly';
   ipcRenderer.send("datatype2_click", [days, count, type]);
   titleText.innerText = `Top ${count} artists - ${type}`;

   const datatype2settingsbutton = document.getElementById("dataType2SettingsMenuButton");
   var settingsMenuToggle = false;
   const dataType2SettingsMenu = document.getElementById("dataType2SettingsMenu");
   dataType2SettingsMenu.style.visibility = 'invisible';
   dataType2SettingsMenu.style.display = 'none';
   datatype2settingsbutton.addEventListener('click', function () {
      settingsMenuToggle = !settingsMenuToggle
      if (settingsMenuToggle) {
         dataType2SettingsMenu.style.visibility = 'visible';
         dataType2SettingsMenu.style.display = 'block';
         const dataType2DaysInput = document.getElementById('dataType2DaysInput');
         dataType2DaysInput.addEventListener('click', function () {
            dataType2DaysInput.value = '';
         })
         const dataType2CountInput = document.getElementById('dataType2CountInput');
         const dataType2TypeInput = document.getElementById('dataType2TypeInput');
         dataType2TypeInput.addEventListener('click', function () {
            dataType2TypeInput.value = '';
         })
         // dataType1CountInput.addEventListener('click', function () {
         //    dataType1CountInput.value = '';
         // })

         if (!dataType2DaysInput.value) {
            dataType2DaysInput.value = 'all time'
         }
         if (!dataType2CountInput.value) {
            dataType2CountInput.value = count
         }
         if (!dataType2TypeInput.value) {
            dataType2TypeInput.value = type
         }

         dataType2SettingsMenu.addEventListener("keydown", function (event) {
            if (event.key == "Enter") {
               let daysTemp = dataType2DaysInput.value
               if (isNaN(daysTemp)) {
                  titleText.innerText = `Counts - ${daysTemp}`;
                  if (daysTemp === 'today') {
                     days = 1;
                  } else if (daysTemp === 'this last week') {
                     days = 7;
                  } else if (daysTemp === 'this last month') {
                     days = 31;
                  } else if (daysTemp === 'this last year') {
                     days = 365;
                  } else if (daysTemp === 'all time') {
                     days = 10000;
                  } else {
                     //TODO: case when we arent given a valid string
                     console.log(daysTemp)
                     console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n')
                  }
               } else {
                  days = daysTemp
                  titleText.innerText = `Top ${count} artists - ${type}`;
               }

               count = dataType2CountInput.value
               if (!count) {
                  count = 5
               }

               type = dataType2TypeInput.value;
               if (type != 'weekly' && type != 'monthly') {
                  type = 'weekly';
               }
               if (days && count && type) {
                  ipcRenderer.send("datatype2_click", [days, count, type]);
                  titleText.innerText = `Top ${count} artists - ${type}`;

                  dataType2SettingsMenu.style.visibility = 'invisible';
                  dataType2SettingsMenu.style.display = 'none';
                  settingsMenuToggle = !settingsMenuToggle
               }

            }
         });
      } else {
         dataType2SettingsMenu.style.visibility = 'invisible';
         dataType2SettingsMenu.style.display = 'none';
      }

   });

});

ipcRenderer.on("datatype2-finished", function (event, dat) {
   var type = dat[1]
   dat = JSON.parse(dat[0])
   cols = new Set();
   for (i = 0; i < dat.length; i++) {
      cols.add(dat[i]['artists'])
   }
   cols = Array.from(cols)


   var data = []
   artists = new Set();
   for (i = 0; i < dat.length; i++) {
      var datepart = dat[i].datepart;
      if (!data[datepart]) {
         if(type == 'weekly'){
            if(datepart > 20210){
               data[datepart] = { date: Date.UTC(2020,  0, (datepart - 202000)*7) };
            } else {
               data[datepart] = { date: Date.UTC(2020,  0, (datepart - 202000)*7)  };
            }
         } else if(type == 'monthly'){
            if(datepart > 20210){ //case for two digits
               data[datepart] = { date: Date.UTC(2020, (datepart - 202000), 0) };
            } else { //case for 1 digit
               data[datepart] = { date: Date.UTC(2020, (datepart - 20200), 0) };
            }
         } else{
            console.log('we dont know this tyupe' + type)
         }
         
      }
      data[dat[i].datepart][dat[i].artists] = parseInt(dat[i].count);
      artists.add(dat[i].artists);

      // let datestring = `2020-0${i % 12}-00`
      // console.log(datestring)
      // data[].date = Date.UTC(2020, dat[i].datepart % 12, 0)
   }


   data = data.filter(function (el) {
      if (el) { return el; }
   });

   for (i = 0; i < data.length; i++) {
      artists.forEach(el => {
         if (!data[i].hasOwnProperty(el)) {
            data[i][el] = 0;
         }
      })
      // if (type == 'weekly') {
      //    // let datestring = `2020-0${i % 12}-00`
      //    // console.log(datestring)
      //    // console.log(Date.UTC(2020, i % 12, 0))
      //    // data[i].date = Date.UTC(2020, i % 12, 0)
      //    data[i].date = i

      // } else if (type = 'monthly') {

      // } else { console.log('!!!!!!!!!!!!!!!!!') }
   }

   data["y"] = "plays"
   data["columns"] = ['date'].concat(Array.from(cols))
   console.log(data)
   graphUtil.artistsSteamGraph(data, 'dataType2ArtistSteamGraph', 'DataType2Legend')

});