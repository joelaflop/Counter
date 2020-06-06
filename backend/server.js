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
      code = split[0];
      if(code != 'updateListens')
         console.log("---------\nserver recieved:" + data.replace(/\v/g,'\n'));
      if (code == 'authspotify') {
         spotify.authSpot(function(refresh, access) {
            console.log(refresh);
            console.log(access);
            db.setTokens(split[1], refresh, access, function(){
               //callback for if there is no such user to login
            });
         })
      } else if (code === 'nowplaying') {
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
      } else if (code === 'recentlyplayed') {
         spotify.recentlyPlayed(10, split[1], function(tracks) {
            if (tracks == 'clientneedsauth') {
               connection.write('getAuth\v\r');
            } else if (tracks != 'undefined') {
               connection.write('recentlyplayed\v' + JSON.stringify(tracks.items))
            } else {
               console.log('tracks are undefined')
            }
         });
      } else if (code == 'login') {
         console.log("login attempt")
         email = split[1]
         password = split[2]
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
            connection.write('loginsuccess\v' + email + '\v' + password + '\v\r');
            db.login(email, function(){
               //callback for if there is no such user to login
            });
         });
      } else if (code == 'autologin') {
         console.log("autologin attempt")
         email = split[1]
         password = split[2]
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
            db.login(email, function(){
               //callback for if there is no such user to login
            });
         });
      } else if (code == 'signup') {
         email = split[1]
         password = split[2]
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
            connection.write('signupsuccess\v' + email + '\v' + password + '\v\r')
            db.newUser(email, 'username', password, 'spotify');
         });
      } else if (code == 'updateListens'){
         email = split[1]
         spotify.recentlyPlayed(50, email, function(tracks) {
            if (tracks == 'clientneedsauth') {
               connection.write('getAuth\v\r'); //maybe use a different flow here
            } else if (tracks != 'undefined') {
               db.listen(email, tracks)
            } else {
               console.log('tracks are undefined')
            }
         });

      } else {
         console.log('server code ^ unknown')
      }
   });
   //connection.pipe(connection);
});

server.listen(8080, function() {
   console.log('server is up');
});
