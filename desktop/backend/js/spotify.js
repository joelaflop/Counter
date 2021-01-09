var express = require('express'); // Express web server framework
var https = require('https');
const fs = require('fs');
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
const db = require('./db');

var client_id = '13aaf88d6e5144d19ae63969c976c861';
var client_secret = '263f372ce07c4da281f59335e104cb7c';

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
   var text = '';
   var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

   for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
   }
   return text;
};

function generateRecentlyPlayedOptions(count, access) {
   return {
      url: 'https://api.spotify.com/v1/me/player/recently-played?' + 'limit=' + count.toString(),
      headers: {
         'Authorization': 'Bearer ' + access
      },
      json: true
   };
}

function generateNowPlayingOptions(access) {
   return {
      url: 'https://api.spotify.com/v1/me/player/currently-playing',
      headers: {
         'Authorization': 'Bearer ' + access
      },
      json: true
   };
}

function refreshToken(email, refresh_token, use_token, handletrack, count) {
   var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
         'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      form: {
         grant_type: 'refresh_token',
         refresh_token: refresh_token
      },
      json: true
   };

   request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
         access_token = body.access_token;
         db.setTokens(email, access_token, refresh_token, function () {
            //callback for if there is no such user to login
         });
         use_token(access_token, handletrack, count)
      } else {
         handletrack('clientneedsauth');
      }
   });
}

function nowPlaying(access, handletrack) {
   var nowplayingoptions = generateNowPlayingOptions(access);
   request.get(nowplayingoptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
         console.log('now playing success')
         handletrack(body);
      } else if (response.statusCode === 204) {
         console.log("user is not playing anything - inner call - last")
         handletrack("nothingplaying")
      } else {
         console.log('error getting nowplaying - last resort:');
      }
   });
}

function recentlyPlayed(access, handletracks, count) { //count has to be last argument
   var recentlyplayedoptions = generateRecentlyPlayedOptions(count, access);
   request.get(recentlyplayedoptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
         console.log('recently played success')
         handletracks(body);
      } else {
         console.log('error getting recently played - last resort');
      }
   });
}

module.exports = {
   nowPlaying: function (email, handletrack) {
      db.getTokens(email, function (access, refresh) {
         if (!refresh) {
            handletrack('clientneedsauth');
         } else {
            var nowplayingoptions = generateNowPlayingOptions(access);
            request.get(nowplayingoptions, function (error, response, body) {
               if (!error && response.statusCode === 200) {
                  console.log('now playing success')
                  handletrack(body);
               } else if (response.statusCode === 401) {
                  console.log("attempting to refresh token")
                  refreshToken(email, refresh, nowPlaying, handletrack);
               } else if (response.statusCode === 204) {
                  console.log("user is not playing anything - first ride")
                  handletrack("nothingplaying")
               } else {
                  console.log('error getting now playing:')
                  console.log(error)
                  console.log(response.statusCode)
               }
            });
         }
      })
   },
   recentlyPlayed: function (count, email, handletracks) {
      db.getTokens(email, function (access, refresh) {
         console.log(email)
         if (!access || !refresh) {
            handletracks('clientneedsauth');
         } else {
            var recentlyplayedoptions = generateRecentlyPlayedOptions(count, access);
            request.get(recentlyplayedoptions, function (error, response, body) {
               if (!error && response.statusCode === 200) {
                  console.log('recently played success')
                  handletracks(body);
               } else if (response.statusCode === 401) {
                  console.log("attempting to refresh token - first resort")
                  refreshToken(email, refresh, recentlyPlayed, handletracks, count);
               } else {
                  console.log('error getting recently played:')
                  console.log(error)
                  console.log(response.statusCode)
               }
            });
         }
      })
   },
   authSpot: function (name, IP, callback) {
      let access_token;
      let refresh_token;

      var stateKey = 'spotify_auth_state';

      var app = express();

      app.use(cors()) //.use(express.static(__dirname))
         .use(cookieParser());

      const serverS = https.createServer({
         key: fs.readFileSync(`certs/${name}-privkey.pem`),
         cert: fs.readFileSync(`certs/${name}-cert.pem`)
      }, app);

      process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

      serverS.listen(8888)

      app.get(`/login`, function (req, res) {

         var state = generateRandomString(16);
         res.cookie(stateKey, state);

         // your application requests authorization
         var scope = 'user-read-private user-read-email user-read-playback-state user-read-recently-played';
         res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
               response_type: 'code',
               client_id: client_id,
               scope: scope,
               redirect_uri: `https://${IP}:8888/callback`,
               state: state
            }));
      });

      app.get('/callback', function (req, res) {

         // your application requests refresh and access tokens
         // after checking the state parameter

         var code = req.query.code || null;
         var state = req.query.state || null;
         var storedState = req.cookies ? req.cookies[stateKey] : null;

         if (state === null || state !== storedState) {
            res.redirect('/#' +
               querystring.stringify({
                  error: 'state_mismatch'
               }));
         } else {
            res.clearCookie(stateKey);
            var authOptions = {
               url: 'https://accounts.spotify.com/api/token',
               form: {
                  code: code,
                  redirect_uri: `https://${IP}:8888/callback`,
                  grant_type: 'authorization_code'
               },
               headers: {
                  'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
               },
               json: true
            };

            request.post(authOptions, function (error, response, body) {
               if (!error && response.statusCode === 200) {

                  access_token = body.access_token;
                  refresh_token = body.refresh_token;

                  callback(access_token, refresh_token)

                  res.redirect("https://spotify.com/");
                  serverS.close();
                  // spot.close()

               } else {
                  res.redirect('/#' +
                     querystring.stringify({
                        error: 'invalid_token'
                     }));
               }
            });
         }
      });
      // var spot = app.listen(8888).on('error', function(err) {
      //    console.log('spotify auth port listening error:')
      //    console.log(err);
      // });

   }
};
