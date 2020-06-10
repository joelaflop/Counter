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
      console.log("---------\nserver recieved:" + data.replace(/\v/g, '\n'));
      if (code == 'authspotify') {
         spotify.authSpot(function(refresh, access) {
            console.log(refresh);
            console.log(access);
            db.setTokens(split[1], refresh, access, function() {
               //callback for if there is no such user to login
            });
         })
      } else if (code === 'nowplaying') {
         spotify.nowPlaying(split[1], function(track) {
            if (track == 'clientneedsauth') {
               console.log("Client request requires authentification")
               connection.write('getauth\v\r');
            } else if (track != 'undefined') {
               // console.log(buildTrackJSON(track))
               // connection.write('nowplaying\v' + JSON.stringify(track.item))
               connection.write('nowplaying\v' + JSON.stringify(buildTrackJSON(track.item)) + '\v\r')
            } else {
               console.log('track is undefined')
            }
         });
      } else if (code === 'recentlyplayed') {
         spotify.recentlyPlayed(10, split[1], function(tracks) {
            if (tracks == 'clientneedsauth') {
               console.log("Client request requires authentification")
               connection.write('getauth\v\r');
            } else if (tracks != 'undefined') {
               var trackList = []
               for(let j=0; j<tracks.items.length; j++){
                  trackList.push(buildTrackJSON(tracks.items[j].track))
               }
               console.log('recently played data writing:')
               console.log(connection.write('recentlyplayed\v' + JSON.stringify(trackList) + '\v\r'))
            } else {
               console.log('tracks are undefined')
            }
         });
      } else if (code == 'login') {
         console.log("login attempt")
         email = split[1]
         password = split[2]
         username = split[3]
         if (!email) {
            db.getEmail(username, function(email) {
               if (!email) {
                  connection.write('loginerror\v' + 'This username was not found\v\r');
               } else {
                  login(email, password, connection);
                  updateListens(email, connection);
               }
            })
         } else {
            login(email, password, connection);
            updateListens(email, connection);
         }
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
            db.login(email, function() {
               console.log('this user is not in the DB')
            });
            updateListens(email, connection);
         });
      } else if (code == 'signup') {
         email = split[1]
         password = split[2]
         username = split[3]
         db.getEmail(username, function(returnedEmail) {
            if(!returnedEmail && username){
               signup(email, password, username, connection)
            } if (!username){
               connection.write('signuperror\v' + 'Please enter a username\v\r');
            } else if (returnedEmail) {
               connection.write('signuperror\v' + 'This username is taken\v\r');
            }
         });
      } else if (code == 'updateListens') {
         email = split[1]
         updateListens(email, connection);

      } else {
         console.log('server code ^ unknown')
      }
   });
   // connection.pipe(connection);
});

function updateListens(email, connection){
   spotify.recentlyPlayed(50, email, function(tracks) {
      if (tracks == 'clientneedsauth') {
         // connection.write('getauth\v\r'); //maybe use a different flow here
         // i think we ignore this case, or tell the user to authorize again in the future
      } else if (tracks != 'undefined') {
         console.log(`autoupdating ${email} listens`)
         db.listen(email, tracks)
      } else {
         console.log('tracks are undefined')
      }
   });
}

function signup(email, password, username, connection){
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
      connection.write('signuperror\v' + error.message +'\v\r');
      console.log('signup error');
   }, function(success) {
      connection.write('signupsuccess\v' + email + '\v' + password + '\v' + username + '\v\r')
      console.log('signup success');
      db.newUser(email, username, password, 'spotify');
   });
}

function login(email, password, connection) {
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
      console.log('login error');
   }, function(success) {
      connection.write('loginsuccess\v' + email + '\v' + password + '\v\r');
      console.log('login success');
      db.login(email, function() {
         console.log('this user is not in the DB')
      });
   });
}

function buildTrackJSON(track){
   artistNames = []
   for(let i=0; i<track.artists.length; i++){
      artistNames.push(track.artists[i].name)
   }
   json =
   {
      name:track.name,
      album:
      {
         name:track.album.name,
         imageURL:track.album.images[0].url
      },
      artists:artistNames
   }
   return json;
}

server.listen(8080, function() {
   console.log('server is up');
});
