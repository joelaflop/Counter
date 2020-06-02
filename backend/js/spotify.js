/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */
var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
const db = require('./db');

var client_id = '13aaf88d6e5144d19ae63969c976c861'; // Your client id
var client_secret = '263f372ce07c4da281f59335e104cb7c'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

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

function generateRecentlyPlayedOtions(access){
   return {
      url: 'https://api.spotify.com/v1/me/player/recently-played?'+'limit='+'50',
      headers: {
         'Authorization': 'Bearer ' + access
      },
      json: true
   };
}

function generateNowPlayingOptions(access){
   return {
      url: 'https://api.spotify.com/v1/me/player/currently-playing',
      headers: {
         'Authorization': 'Bearer ' + access
      },
      json: true
   };
}

function refreshToken(email, refresh_token, use_token, other_callback) {
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

   request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
         access_token = body.access_token;
         db.setTokens(email, access_token, refresh_token);
         use_token(access_token, other_callback)
         // res.send({
         //   'access_token': access_token
         // });
      }
   });
}

function nowPlaying(access, callback) {
   var nowplayingoptions = generateNowPlayingOptions(access);
   request.get(nowplayingoptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
         console.log('now playing success')
         callback(body);
      }
   });
}

function recentlyPlayed(access, callback) {
   var recentlyplayedoptions = generateRecentlyPlayedOtions(access);
   request.get(recentlyplayedoptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
         console.log('recently played success')
         callback(body);
      }
   });
}

module.exports = {
   nowPlaying: function(email, callback) {
      db.getTokens(email, function(access, refresh) {
         if (!access || !refresh) {
            callback('clientneedsauth');
         } else {
            var nowplayingoptions = generateNowPlayingOptions(access);
            request.get(nowplayingoptions, function(error, response, body) {
               if (!error && response.statusCode === 200) {
                  console.log('now playing success')
                  callback(body);
               } else if (response.statusCode === 401) {
                  console.log("attempting to refresh token")
                  console.log(error)
                  console.log(response.statusCode)
                  refreshToken(email, refresh, nowPlaying, callback);
               } else {
                  console.log('error getting now playing:')
                  console.log(error)
                  console.log(response.statusCode)
               }
            });
         }
      })
   },
   recentlyPlayed: function(email, callback) {
      db.getTokens(email, function(access, refresh) {
         if (!access || !refresh) {
            callback('clientneedsauth');
         } else {
            var recentlyplayedoptions = generateRecentlyPlayedOtions(access);
            request.get(recentlyplayedoptions, function(error, response, body) {
               if (!error && response.statusCode === 200) {
                  console.log('recently played success')
                  callback(body);
               } else if (response.statusCode === 401) {
                  console.log("attempting to refresh token")
                  console.log(error)
                  console.log(response.statusCode)
                  refreshToken(email, refresh, recentlyPlayed, callback);
               } else {
                  console.log('error getting recently played:')
                  console.log(error)
                  console.log(response.statusCode)
               }
            });
         }
      })
   },
   authSpot: function(callback) {
      let access_token;
      let refresh_token;

      var stateKey = 'spotify_auth_state';

      var app = express();

      app.use(cors()) //.use(express.static(__dirname))
         .use(cookieParser());

      app.get('/login', function(req, res) {

         var state = generateRandomString(16);
         res.cookie(stateKey, state);

         // your application requests authorization
         var scope = 'user-read-private user-read-email user-read-playback-state user-read-recently-played';
         res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
               response_type: 'code',
               client_id: client_id,
               scope: scope,
               redirect_uri: redirect_uri,
               state: state
            }));
      });

      app.get('/callback', function(req, res) {

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
                  redirect_uri: redirect_uri,
                  grant_type: 'authorization_code'
               },
               headers: {
                  'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
               },
               json: true
            };

            request.post(authOptions, function(error, response, body) {
               if (!error && response.statusCode === 200) {

                  access_token = body.access_token;
                  refresh_token = body.refresh_token;

                  callback(access_token, refresh_token)

                  res.redirect("https://spotify.com/")
                  spot.close()

               } else {
                  res.redirect('/#' +
                     querystring.stringify({
                        error: 'invalid_token'
                     }));
               }
            });
         }
      });
      var spot = app.listen(8888).on('error', function(err) {
         console.log('spotify auth port listening error:')
         console.log(err);
      });
   }
};
