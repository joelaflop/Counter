var net = require('net');

const spotify = require('./js/spotify');
const auth = require('./js/auth');
const db = require('./js/db');
const util = require('util');

const http2 = require('http2');
const fs = require('fs');

const configFile = require('../config')
const config = configFile[1]
const serverS = http2.createSecureServer({
   key: fs.readFileSync(`./certs/${config.name}-privkey.pem`),
   cert: fs.readFileSync(`./certs/${config.name}-cert.pem`)
});
// SSL command for certificates
// openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -keyout localhost--privkey.pem -out localhost--cert.pem
// openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=192.168.1.57' -keyout joesmac-privkey.pem -out joesmac-cert.pem

serverS.on('error', (err) => console.error(err));

serverS.on('stream', (stream, headers) => {
   // stream is a Duplex
   // console.log('stream:')
   // console.log(stream)
   console.log('header:')
   console.log(headers)
   if (headers[':path'] === '/recentlyplayed') {
      stream.respond({
         'content-type': 'text',
         ':status': 200
      });
      spotify.recentlyPlayed(50, headers.email, function(tracks) {
         if (tracks == 'clientneedsauth') {
            console.log("Client request requires authentification")
            // connection.write('getauth\v\r');
            stream.write('getauth', function() {
               stream.end('');
            })
         } else if (tracks != 'undefined') {
            var trackList = []
            for (let j = 0; j < tracks.items.length; j++) {
               trackList.push(buildTrackJSON(tracks.items[j].track))
            }
            stream.write(JSON.stringify(trackList), function() {
               stream.end('');
            });

         } else {
            console.log('tracks are undefined')
         }
      });

   } else if (headers[':path'] === '/nowplaying') {
      stream.respond({
         'content-type': 'text',
         ':status': 200
      });
      spotify.nowPlaying(headers.email, function(track) {
         if (track == 'clientneedsauth') {
            console.log("Client request requires authentification")
            stream.write('getauth', function() {
               stream.end('');
            })
         } else if (track != 'undefined') {
            // console.log(buildTrackJSON(track))
            // connection.write('nowplaying\v' + JSON.stringify(track.item))
            // connection.write('nowplaying\v' + JSON.stringify(buildTrackJSON(track.item)) + '\v\r')
            stream.write(JSON.stringify(buildTrackJSON(track.item)), function() {stream.end();});
         } else {
            console.log('track is undefined')
         }
      });
   } else if (headers[':path'] === '/login') {
      console.log("login attempt")

      email = headers.email
      password = headers.password
      username = headers.username
      if (!email) {
         db.getEmail(username, function(email) {
            if (!email) {
               // connection.write('loginerror\v' + 'This username was not found\v\r');
               stream.respond({
                  'content-type': 'text',
                  ':status': 200
               });
               stream.write('loginerror\n', function() {
                  stream.end('This username was not found.')
               })
            } else {
               login(email, password, stream);
               updateListens(email);
            }
         })
      } else {
         login(email, password, stream);
         updateListens(email);
      }
   } else if (headers[':path'] === '/signup') {
      console.log("signup attempt")

      email = headers.email
      password = headers.password
      username = headers.username
      console.log(`email: ${email}`)
      console.log(`password: ${password}`)
      console.log(`username: ${username}`)
      db.getEmail(username, function(returnedEmail) {
         if (!returnedEmail && username) {
            signup(email, password, username, stream)
         }
         if (!username) {
            stream.respond({
               'content-type': 'text',
               ':status': 200
            });
            stream.write('signuperror\n', function() {
               stream.end('Please enter a username.')
            })
         } else if (returnedEmail) {
            stream.respond({
               'content-type': 'text',
               ':status': 200
            });
            stream.write('signuperror\n', function() {
               stream.end('This username is taken.')
            })
         }
      });
   } else if (headers[':path'] === '/authspotify') {
      spotify.authSpot(config.name, config.IP, function(refresh, access) {
         console.log(refresh);
         console.log(access);
         email = headers.email
         db.setTokens(email, refresh, access, function() {
            //callback for if there is no such user to login
         });
         updateListens(email);
         stream.end()
      })
   } else if (headers[':path'] === '/autologin') {
      console.log("autologin attempt")
      email = headers.email
      password = headers.password
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
               stream.write('autologinerror\n' + error.message, function(){stream.end()});
         }
      }, function(success) {
         stream.write('autologinsuccess', function(){stream.end()});
         db.login(email, function() {
            console.log('this user is not in the DB')
         });
         updateListens(email);
      });
   } else if (headers[':path'] === '/updatelistens'){
      updateListens(headers.email);
      stream.end()
   } else {
      console.log('unknown header')
   }

});

function updateListens(email) {
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

function login(email, password, stream) {
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
      stream.respond({
         'content-type': 'text',
         ':status': 200
      });
      stream.write('loginerror\n', function() {
         stream.end(error.message)
      })
      console.log('login error');
   }, function(success) {
      // connection.write('loginsuccess\v' + email + '\v' + password + '\v\r');
      stream.respond({
         'content-type': 'text',
         ':status': 200
      });
      stream.write(`loginsuccess\n${email}\n${password}`, function() {
         stream.end('')
      })
      console.log('login success');
      db.login(email, function() {
         console.log('this user is not in the DB')
      });
   });
}

function signup(email, password, username, stream) {
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
      stream.respond({
         'content-type': 'text',
         ':status': 200
      });
      stream.write('signuperror\n', function() {
         stream.end(error.message)
      })
      console.log('signup error');
   }, function(success) {
      stream.respond({
         'content-type': 'text',
         ':status': 200
      });
      stream.write(`signupsucess\n${email}\n${password}\n${username}`, function() {
         stream.end('')
      })
      console.log('signup success');
      db.newUser(email, username, password, 'spotify');
   });
}

function buildTrackJSON(track) {
   artistNames = []
   for (let i = 0; i < track.artists.length; i++) {
      artistNames.push(track.artists[i].name)
   }
   json = {
      name: track.name,
      album: {
         name: track.album.name,
         imageURL: track.album.images[0].url
      },
      artists: artistNames
   }
   return json;
}


serverS.listen(8443, function() {
   console.log('https server is up');
});
