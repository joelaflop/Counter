var net = require('net');

const spotify = require('./js/spotify');
const auth = require('./js/auth');
const db = require('./js/db');
const util = require('util');

var server = net.createServer(function(connection) {
   console.log('client connected');

   connection.on('end', function() {
      console.log('client disconnected');
   });

   connection.on('error', function(err) {
      console.log(err)
   });

   connection.on('data', function(dat) {
      data = dat.toString()
      split = data.split("\v");
      console.log("server recieved:" + data.replace(/\v/g,'\n')+'\n-----');
      if (split[0] == 'authspotify') {
         spotify.authSpot(function(refresh, access) {
            console.log(refresh);
            console.log(access);
            db.setTokens(split[1], refresh, access);
         })
      } else if (split[0] === 'nowplaying') {
         spotify.nowPlaying(split[1], function(track) {
            if (track == 'clientneedsauth') {
               console.log("GETTTTT")
               connection.write('getAuth\v\r');
            } else if (track != 'undefined') {
               connection.write('nowplaying\v' + JSON.stringify(track.item))
            } else {
               console.log('track is undefined')
            }
         });
      } else if (split[0] === 'recentlyplayed') {
         spotify.recentlyPlayed(split[1], function(tracks) {
            if (tracks == 'clientneedsauth') {
               connection.write('getAuth\v\r');
            } else if (tracks != 'undefined') {
               connection.write('recentlyplayed\v' + JSON.stringify(tracks.items.slice(0,10)))
            } else {
               console.log('tracks are undefined')
            }
         });
      } else if (split[0] == 'login') {
         console.log("login attempt")
         email = split[1]
         password = split[2].substring(0, split[2].length - 1)
         auth.login(email, password, function(error) {
            switch (error.code) {
               case "auth/invalid-email":
                  break;
               case "auth/invalid-user-token":
                  break;
               case "auth/requires-recent-login":
                  break;
               case "auth/user-token-expired":
                  break;
               default:
                  // console.log(error)
                  console.log(error.code)
                  console.log(error.message)
            }
            connection.write('loginerror\v' + error.message);
         }, function(success) {
            connection.write('loginsuccess\v' + email + '\v' + password + '\r');
            db.login(email);
         });
      } else if (split[0] == 'autologin') {
         console.log("autologin attempt")
         email = split[1]
         password = split[2].substring(0, split[2].length - 1)
         auth.login(email, password, function(error) {
            switch (error.code) {
               case "auth/invalid-email":
                  break;
               case "auth/invalid-user-token":
                  break;
               case "auth/requires-recent-login":
                  break;
               case "auth/user-token-expired":
                  break;
               default:
                  // console.log(error)
                  console.log(error.code);
                  console.log(error.message);
                  connection.write('autologinerror\v' + error.message);
            }
         }, function(success) {
            connection.write('autologinsuccess');
            db.login(email);
         });
      } else if (split[0] == 'signup') {
         email = split[1]
         password = split[2].substring(0, split[2].length - 1)
         auth.signup(email, password, function(error) {
            switch (error.code) {
               case "auth/invalid-email":
                  break;
               case "auth/invalid-user-token":
                  break;
               case "auth/email-already-in-use":
                  break;
               default:
                  // console.log(error)
                  console.log(error.code)
                  console.log(error.message)
            }
            connection.write('signuperror\v' + error.message);
         }, function(success) {
            connection.write('signupsuccess\v' + email + '\v' + password + '\r')
            db.newUser(email, 'username', password, 'spotify', 'refresh_token', 'created_on', 'last_login');
         });
      }
   });
   //connection.pipe(connection);
});

server.listen(8080, function() {
   console.log('server is up');
});
<<<<<<< Updated upstream
=======


//listen data recording
// function listen(email, items){
//    for(int i = 0; i < items.length; i++){
//       track = items[i]
//       artistString = 'placeholder';
//       for(int j = 0; j < track.artists.length; j++){
//
//       }
//       db.listen(email, artistString, track.album.name, track.name, track.album.release_date, 'spotify', track.id)
//    }
// }
>>>>>>> Stashed changes
