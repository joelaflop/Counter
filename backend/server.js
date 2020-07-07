var net = require('net');

const spotify = require('./js/spotify');
const auth = require('./js/auth');
const db = require('./js/db');
const util = require('util');

const http2 = require('http2');
const fs = require('fs');

const configFile = require('../config')
const httpConfig = configFile.httpInfo[1]
const serverS = http2.createSecureServer({
   key: fs.readFileSync(`./certs/${httpConfig.name}-privkey.pem`),
   cert: fs.readFileSync(`./certs/${httpConfig.name}-cert.pem`)
});
// SSL command for certificates
// openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -keyout localhost--privkey.pem -out localhost--cert.pem
// openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=192.168.1.57' -keyout joesmac-privkey.pem -out joesmac-cert.pem

serverS.on('error', (err) => {
   console.log('stream error:')
   console.error(err)
});

serverS.on('stream', (stream, headers) => {
   console.log('header:')
   console.log(headers)
   switch (headers[':path']) {
      case '/recentlyplayed':
         spotify.recentlyPlayed(50, headers.email, function (tracks) {
            if (tracks == 'clientneedsauth') {
               console.log("Client request requires authentification")
               // connection.write('getauth\v\r');
               streamRespond(stream, 'getauth')
            } else if (tracks != 'undefined') {
               var trackList = []
               for (let j = 0; j < tracks.items.length; j++) {
                  trackList.push(buildTrackJSON(tracks.items[j], true))
               }
               streamRespond(stream, JSON.stringify(trackList))
            } else {
               console.log('tracks are undefined')
            }
         });
         break;
      case '/nowplaying':
         spotify.nowPlaying(headers.email, function (track) {
            if (track == 'clientneedsauth') {
               console.log("Client request requires authentification")
               streamRespond(stream, 'getauth')
            } else if (track === "nothingplaying") {
               streamRespond(stream, 'nothingplaying')
            } else if (track != 'undefined') {
               // console.log(buildTrackJSON(track))
               // connection.write('nowplaying\v' + JSON.stringify(track.item))
               // connection.write('nowplaying\v' + JSON.stringify(buildTrackJSON(track.item)) + '\v\r')
               streamRespond(stream, JSON.stringify(buildTrackJSON(track, false)))
            } else {
               console.log('track is undefined')
            }
         });
         break;
      case '/login':
         console.log("login attempt")
         email = headers.email
         password = headers.password
         username = headers.username
         if (!email) {
            db.getEmail(username, function (email) {
               if (!email) {
                  // connection.write('loginerror\v' + 'This username was not found\v\r');
                  streamRespond(stream, 'loginerror\nThis username was not found.')
               } else {
                  login(email, password, stream);
                  updateListens(email);
               }
            })
         } else {
            login(email, password, stream);
            updateListens(email);
         }
         break;
      case '/signup':
         console.log("signup attempt")

         email = headers.email
         password = headers.password
         username = headers.username
         console.log(`email: ${email}`)
         console.log(`password: ${password}`)
         console.log(`username: ${username}`)
         db.getEmail(username, function (returnedEmail) {
            if (!returnedEmail && username) {
               signup(email, password, username, stream)
            }
            if (!username) {
               streamRespond(stream, 'signuperror\nPlease enter a username.')
            } else if (returnedEmail) {
               streamRespond(stream, 'signuperror\nThis username is taken.')
            }
         });
         break;
      case '/authspotify':
         spotify.authSpot(httpConfig.name, httpConfig.IP, function (refresh, access) {
            // console.log(refresh);
            // console.log(access);
            email = headers.email
            db.setTokens(email, refresh, access, function () {
               //callback for if there is no such user to login
            });
            updateListens(email);
            stream.end()
         })
         break;
      case '/autologin':
         console.log("autologin attempt")
         email = headers.email
         password = headers.password
         auth.login(email, password,
            function (error) {
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
                     streamRespond(stream, 'autologinerror\n' + error.message)
               }
            },
            function (success) {
               streamRespond(stream, 'autologinsuccess')
               db.login(email, function () {
                  console.log('this user is not in the DB, but was in auth!')
               });
               updateListens(email);
            });
         break;
      case '/updatelistens':
         updateListens(headers.email);
         stream.end()
         break;
      case '/userprofile':
         console.log("get user profile attempt")
         email = headers.email
         db.getUserInfo(email, function (res) {
            if (res) {
               streamRespond(stream, res.email + '\n' + res.username + '\n' + res.platforms + '\n' + res.created_on)
            } else {
               streamRespond(stream, userProfileError)
            }
         })
         break;
      default:
         console.log(`unknown header: ${headers[':path']}`)
   }
});


function updateListens(email) {
   spotify.recentlyPlayed(50, email, function (tracks) {
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
   auth.login(email, password, function (error) {
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
      streamRespond(stream, `loginerror\n${error.message}`)
      console.log('login error');
   }, function (success) {
      // connection.write('loginsuccess\v' + email + '\v' + password + '\v\r');
      streamRespond(stream, `loginsuccess\n${email}\n${password}`)
      console.log('login success');
      db.login(email, function () {
         console.log('this user is not in the DB')
      });
   });
}

function signup(email, password, username, stream) {
   auth.signup(email, password, function (error) {
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
      streamRespond(stream, `signuperror\n${error.message}`)
      console.log('signup error');
   }, function (success) {
      streamRespond(stream, `signupsucess\n${email}\n${password}`)
      console.log('signup success');
      db.newUser(email, username, password, 'spotify');
   });
}

function streamRespond(stream
   , t, headers = {
      'content-type': 'text',
      ':status': 200
   }
) {
   try {
      stream.respond(headers);
      stream.write(t, function () {
         stream.end()
      });
   } catch (streamerr) {
      console.log(streamerr)
   }
}

function buildTrackJSON(recentlyplayedobject, recentlyplay) {
   let track;
   if (recentlyplay) {
      track = recentlyplayedobject.track
   } else {
      track = recentlyplayedobject.item
   }
   artistNames = []
   for (let i = 0; i < track.artists.length; i++) {
      artistNames.push(track.artists[i].name)
   }
   let json;
   try {
      json = {
         name: track.name,
         album: {
            name: track.album.name,
            imageURL: track.album.images[0] != undefined ? track.album.images[0].url : 'null',
         },
         artists: artistNames != undefined ? artistNames : 'null',
         played_at: recentlyplayedobject.played_at,
      }
   } catch (error) {
      console.log('JSON ERRRR:')
      console.log(error)
   }
   return json;
}

serverS.listen(8443, function () {
   console.log('https server is up');
});
