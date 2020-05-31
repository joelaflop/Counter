/*
            Server
*/

var net = require('net');

const spotify = require('./js/spotify');
const auth = require('./js/auth');
const db = require('./js/db');

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
      console.log("server recieved:")
      console.log(data)
      console.log("----------------------------------")
      split = data.split("\n");
      if (data === 'nowplaying\r') {
         spotify.nowPlaying(function(track) {
            connection.write('nowplaying\n' + JSON.stringify(track.item))
         });
      }
      if (data === 'recentlyplayed\r') {
         spotify.recentlyPlayed(function(tracks) {
            connection.write('recentlyplayed\n' + JSON.stringify(tracks.items))
         });
      }
      if (split[0] == 'login') {
         console.log("login attempt")
         auth.login(split[1], split[2].substring(0, split[2].length - 1), function(error) {
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
                  console.log(error)
                  console.log(error.code)
                  console.log(error.message)
            }
            connection.write('loginerror\n' + error.message);
         }, function(success) {
            connection.write('loginsuccess')
         });
      }
      if (split[0] == 'signup') {
         auth.signup(split[1], split[2].substring(0, split[2].length - 1), function(error) {
            switch (error.code) {
               case "auth/invalid-email":
                  break;
               case "auth/invalid-user-token":
                  break;
               case "auth/email-already-in-use":
                  break;
               default:
                  console.log(error)
                  console.log(error.code)
                  console.log(error.message)
            }
            connection.write('signuperror\n' + error.message);
         }, function(success) {
            connection.write('signupsuccess')
         });
      }
   });

   //connection.pipe(connection);
});

server.listen(8080, function() {
   console.log('server is listening');
});
